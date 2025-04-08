import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor, RefreshCw } from "lucide-react";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function PreviewPanel({ html, css, js }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to update the iframe content
  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    setIsLoading(true);
    
    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!iframeDoc) return;
      
      // Reset the iframe content
      iframeDoc.open();
      
      // Set the content with HTML, CSS, and JS
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `;
      
      iframeDoc.write(content);
      iframeDoc.close();
    } catch (error) {
      console.error('Error updating preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update preview when code changes
  useEffect(() => {
    updatePreview();
  }, [html, css, js]);

  // Get width class based on selected device
  const getWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
        return 'w-full';
      default:
        return 'max-w-[375px]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-100 rounded-md overflow-hidden">
      {/* Preview Controls */}
      <div className="flex justify-between items-center border-b border-neutral-300 bg-white px-4 py-2">
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant={device === 'mobile' ? 'default' : 'outline'}
            className={`h-8 w-8 rounded-full ${device === 'mobile' ? 'bg-primary-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
            onClick={() => setDevice('mobile')}
            aria-label="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={device === 'tablet' ? 'default' : 'outline'}
            className={`h-8 w-8 rounded-full ${device === 'tablet' ? 'bg-primary-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
            onClick={() => setDevice('tablet')}
            aria-label="Tablet view"
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={device === 'desktop' ? 'default' : 'outline'}
            className={`h-8 w-8 rounded-full ${device === 'desktop' ? 'bg-primary-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
            onClick={() => setDevice('desktop')}
            aria-label="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs text-neutral-500 px-2 py-1 rounded border border-neutral-300 hover:bg-neutral-200 transition duration-300"
          onClick={updatePreview}
          disabled={isLoading}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-neutral-200 flex items-start justify-center p-4">
        <div className={`h-full ${getWidthClass()} transition-all duration-300 ease-in-out shadow-md bg-white`}>
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
