import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWebsite } from "@/hooks/use-website";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Save, DownloadCloud, Trash2 } from "lucide-react";
import { CodeEditor } from "@/components/ui/code-editor";
import { PreviewPanel } from "@/components/ui/preview-panel";
import { ChatInterface, Message } from "@/components/ui/chat-interface";
import { WebsiteCard } from "@/components/ui/website-card";
import { v4 as uuidv4 } from 'uuid';

export default function BuilderPage() {
  const { user } = useAuth();
  const { 
    websites, 
    isLoading, 
    createWebsiteMutation, 
    updateWebsiteMutation,
    deleteWebsiteMutation,
    fetchWebsites 
  } = useWebsite();

  const [activeWebsiteId, setActiveWebsiteId] = useState<number | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [cssContent, setCssContent] = useState<string>("");
  const [jsContent, setJsContent] = useState<string>("");
  const [websiteName, setWebsiteName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'ai',
      content: "Hello! I'm your AI website assistant. What kind of website would you like me to create for you today?",
      timestamp: new Date()
    }
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showWebsiteList, setShowWebsiteList] = useState<boolean>(true);

  // Find the active website
  const activeWebsite = websites?.find(website => website.id === activeWebsiteId);

  // Load website content when active website changes
  useEffect(() => {
    if (activeWebsite) {
      setHtmlContent(activeWebsite.htmlContent);
      setCssContent(activeWebsite.cssContent);
      setJsContent(activeWebsite.jsContent || "");
      setWebsiteName(activeWebsite.name);
      setShowWebsiteList(false);
    } else {
      setHtmlContent("");
      setCssContent("");
      setJsContent("");
      setWebsiteName("");
    }
  }, [activeWebsite]);

  // Function to handle sending messages to AI
  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      // If we're modifying an existing website
      if (activeWebsiteId) {
        // Add AI typing indicator
        const updatedMessage: Message = {
          id: uuidv4(),
          role: 'ai',
          content: "Updating your website based on your instructions...",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, updatedMessage]);

        // Call API to update website
        await updateWebsiteMutation.mutateAsync({
          id: activeWebsiteId,
          instruction: content
        });

        // Update success message
        const successMessage: Message = {
          id: uuidv4(),
          role: 'system',
          content: "Website updated successfully!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev.slice(0, prev.length - 1), successMessage]);
      } else {
        // We're creating a new website
        // Add AI typing indicator
        const generatingMessage: Message = {
          id: uuidv4(),
          role: 'ai',
          content: "I'm generating a website based on your description. This may take a moment...",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, generatingMessage]);

        // Call API to create website
        const newWebsite = await createWebsiteMutation.mutateAsync({
          description: content,
          name: content.substring(0, 50) // Use start of description as initial name
        });

        // Set the new website as active
        setActiveWebsiteId(newWebsite.id);

        // Add success message
        const successMessage: Message = {
          id: uuidv4(),
          role: 'system',
          content: "Website generated successfully!",
          timestamp: new Date()
        };
        setMessages(prev => [...prev.slice(0, prev.length - 1), successMessage]);
      }
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : "Failed to process your request"}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save website changes
  const handleSaveChanges = async () => {
    if (!activeWebsiteId) return;

    try {
      await updateWebsiteMutation.mutateAsync({
        id: activeWebsiteId,
        name: websiteName,
        htmlContent,
        cssContent,
        jsContent
      });

      // Add success message
      const successMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: "Changes saved successfully!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'system',
        content: `Error saving changes: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Function to handle website deletion
  const handleDeleteWebsite = async (id: number) => {
    try {
      await deleteWebsiteMutation.mutateAsync(id);
      
      // If the deleted website was active, reset the active website
      if (id === activeWebsiteId) {
        setActiveWebsiteId(null);
        setShowWebsiteList(true);
      }
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  // Function to export website code
  const handleExportCode = () => {
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const cssBlob = new Blob([cssContent], { type: 'text/css' });
    const jsBlob = new Blob([jsContent || ""], { type: 'text/javascript' });

    // Create download links
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const cssUrl = URL.createObjectURL(cssBlob);
    const jsUrl = URL.createObjectURL(jsBlob);

    // Create anchor elements and trigger downloads
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = 'index.html';
    htmlLink.click();

    const cssLink = document.createElement('a');
    cssLink.href = cssUrl;
    cssLink.download = 'styles.css';
    cssLink.click();

    if (jsContent) {
      const jsLink = document.createElement('a');
      jsLink.href = jsUrl;
      jsLink.download = 'script.js';
      jsLink.click();
    }

    // Clean up
    URL.revokeObjectURL(htmlUrl);
    URL.revokeObjectURL(cssUrl);
    URL.revokeObjectURL(jsUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-900">
      <Navbar />

      <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl py-8">
          {/* Builder Interface */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowWebsiteList(!showWebsiteList)}
                className="text-neutral-400 hover:text-white"
              >
                {showWebsiteList ? "Hide" : "Show"} My Websites
              </Button>
              
              {activeWebsite && (
                <div className="flex items-center gap-2">
                  <Input
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    className="max-w-[250px] bg-primary-800 border-neutral-700"
                    placeholder="Website name"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveChanges}
                    disabled={updateWebsiteMutation.isPending}
                    className="text-neutral-300 border-neutral-600 hover:border-accent-cyan hover:text-accent-cyan"
                  >
                    {updateWebsiteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {activeWebsite && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveWebsiteId(null);
                      setShowWebsiteList(true);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    New Website
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportCode}
                    className="text-neutral-300 border-neutral-600 hover:border-accent-cyan hover:text-accent-cyan"
                  >
                    <DownloadCloud className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </>
              )}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-primary-900 hover:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Website
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-primary-800 border-neutral-700">
                  <DialogHeader>
                    <DialogTitle>Create New Website</DialogTitle>
                    <DialogDescription>
                      Describe the website you want to create with AI.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-neutral-400 mb-2">Example prompts:</p>
                    <ul className="text-sm text-neutral-400 list-disc pl-5 space-y-1">
                      <li>A portfolio website for a photographer with a dark theme</li>
                      <li>An e-commerce landing page for handmade jewelry</li>
                      <li>A modern restaurant website with a menu section</li>
                    </ul>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={() => {
                        setActiveWebsiteId(null);
                        setShowWebsiteList(false);
                      }}
                      className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-primary-900"
                    >
                      Start Building
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Website List Section */}
          {showWebsiteList ? (
            <div className="mb-8">
              <h2 className="text-xl font-space font-semibold text-white mb-4">My Websites</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />
                </div>
              ) : websites && websites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {websites.map((website) => (
                    <WebsiteCard
                      key={website.id}
                      website={website}
                      onSelect={() => setActiveWebsiteId(website.id)}
                      onDelete={() => handleDeleteWebsite(website.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-primary-800 border-neutral-700">
                  <CardContent className="flex flex-col items-center justify-center text-center p-6">
                    <div className="mb-4 p-4 rounded-full bg-primary-700">
                      <Plus className="h-6 w-6 text-accent-cyan" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No websites yet</h3>
                    <p className="text-neutral-400 mb-4">Create your first website with AI</p>
                    <Button 
                      onClick={() => {
                        setActiveWebsiteId(null);
                        setShowWebsiteList(false);
                      }}
                      className="bg-gradient-to-r from-[#00FFFF] to-[#FF00FF] text-primary-900"
                    >
                      Start Building
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
              {/* Left Panel - Chat Interface */}
              <div className="lg:col-span-1">
                <ChatInterface 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isGenerating || createWebsiteMutation.isPending || updateWebsiteMutation.isPending}
                  placeholder={activeWebsite 
                    ? "Describe what you want to change..." 
                    : "Describe the website you want to create..."}
                />
              </div>
              
              {/* Center Panel - Code Editor */}
              <div className="lg:col-span-1">
                <CodeEditor 
                  html={htmlContent}
                  css={cssContent}
                  js={jsContent}
                  onHtmlChange={setHtmlContent}
                  onCssChange={setCssContent}
                  onJsChange={setJsContent}
                />
              </div>
              
              {/* Right Panel - Preview */}
              <div className="lg:col-span-1">
                <PreviewPanel 
                  html={htmlContent}
                  css={cssContent}
                  js={jsContent}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
