import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Copy } from "lucide-react";

interface CodeEditorProps {
  html: string;
  css: string;
  js: string;
  onHtmlChange: (html: string) => void;
  onCssChange: (css: string) => void;
  onJsChange: (js: string) => void;
}

export function CodeEditor({ html, css, js, onHtmlChange, onCssChange, onJsChange }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<string>("html");
  const [copied, setCopied] = useState<boolean>(false);
  
  // Handle text area changes
  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onHtmlChange(e.target.value);
  };
  
  const handleCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCssChange(e.target.value);
  };
  
  const handleJsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onJsChange(e.target.value);
  };
  
  // Copy to clipboard functionality
  const copyToClipboard = () => {
    let contentToCopy = '';
    
    switch (activeTab) {
      case 'html':
        contentToCopy = html;
        break;
      case 'css':
        contentToCopy = css;
        break;
      case 'js':
        contentToCopy = js;
        break;
    }
    
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Auto resize text area
  const resizeTextArea = (textArea: HTMLTextAreaElement) => {
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  };
  
  // Line numbers for code editor
  const getLineNumbers = (text: string): string => {
    const lines = text.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };
  
  return (
    <div className="flex flex-col h-full bg-primary-900 border border-neutral-700 rounded-md overflow-hidden">
      <div className="flex justify-between items-center px-3 py-2 bg-primary-800 border-b border-neutral-700">
        <Tabs defaultValue="html" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-primary-900/50">
            <TabsTrigger value="html" className="data-[state=active]:bg-primary-700 data-[state=active]:text-accent-cyan">
              index.html
            </TabsTrigger>
            <TabsTrigger value="css" className="data-[state=active]:bg-primary-700 data-[state=active]:text-accent-magenta">
              styles.css
            </TabsTrigger>
            <TabsTrigger value="js" className="data-[state=active]:bg-primary-700 data-[state=active]:text-accent-purple">
              script.js
            </TabsTrigger>
          </TabsList>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1 relative">
        <div className="flex">
          <div className="text-neutral-500 p-4 text-right select-none font-mono text-sm" style={{ minWidth: '40px' }}>
            {activeTab === 'html' && getLineNumbers(html)}
            {activeTab === 'css' && getLineNumbers(css)}
            {activeTab === 'js' && getLineNumbers(js)}
          </div>
          
          <TabsContent value="html" className="flex-1 p-0 m-0">
            <textarea
              className="w-full h-full p-4 bg-transparent border-none outline-none font-mono text-sm resize-none text-neutral-200"
              value={html}
              onChange={handleHtmlChange}
              onInput={(e) => resizeTextArea(e.target as HTMLTextAreaElement)}
              spellCheck="false"
            />
          </TabsContent>
          
          <TabsContent value="css" className="flex-1 p-0 m-0">
            <textarea
              className="w-full h-full p-4 bg-transparent border-none outline-none font-mono text-sm resize-none text-neutral-200"
              value={css}
              onChange={handleCssChange}
              onInput={(e) => resizeTextArea(e.target as HTMLTextAreaElement)}
              spellCheck="false"
            />
          </TabsContent>
          
          <TabsContent value="js" className="flex-1 p-0 m-0">
            <textarea
              className="w-full h-full p-4 bg-transparent border-none outline-none font-mono text-sm resize-none text-neutral-200"
              value={js}
              onChange={handleJsChange}
              onInput={(e) => resizeTextArea(e.target as HTMLTextAreaElement)}
              spellCheck="false"
            />
          </TabsContent>
        </div>
      </ScrollArea>
    </div>
  );
}
