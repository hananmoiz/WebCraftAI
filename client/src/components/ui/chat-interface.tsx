import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Info } from "lucide-react";

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  placeholder = "Describe what you want to change..."
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto resize textarea as user types
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex flex-col h-full border border-neutral-700 rounded-md overflow-hidden">
      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4 bg-primary-900/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-neutral-400">
            <Bot className="h-12 w-12 mb-3 text-accent-cyan" />
            <h3 className="text-lg font-medium text-neutral-300 mb-1">AI Website Generator</h3>
            <p className="text-sm">
              Describe the website you want to create, and our AI will generate it for you.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role !== 'user' && (
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 
                  ${message.role === 'ai' ? 'bg-accent-cyan text-primary-900' : 'bg-neutral-600 text-white'}`}>
                  {message.role === 'ai' ? <Bot size={16} /> : <Info size={16} />}
                </div>
              )}
              
              <div className={`flex-1 ${message.role === 'user' ? 'ml-12' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary-700 rounded-tr-none ml-auto' 
                    : message.role === 'ai'
                      ? 'bg-primary-800 rounded-tl-none'
                      : 'bg-primary-800/30 text-neutral-400 text-sm'
                }`}>
                  {message.content}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-accent-magenta flex items-center justify-center text-primary-900 flex-shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-full bg-accent-cyan flex items-center justify-center text-primary-900 flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="flex-1">
              <div className="bg-primary-800 p-3 rounded-lg rounded-tl-none inline-flex space-x-1">
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
      
      {/* Input Area */}
      <div className="p-4 border-t border-neutral-700 bg-primary-800">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full bg-primary-900 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-accent-cyan transition duration-300 pr-12 resize-none min-h-[80px]"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-3 bottom-3 h-8 w-8 bg-accent-cyan text-primary-900 rounded-full flex items-center justify-center hover:bg-accent-magenta transition duration-300 p-0"
            aria-label="Send message"
          >
            <Send size={16} />
          </Button>
        </form>
        <div className="flex items-center justify-between mt-3 text-xs text-neutral-400">
          <span>Try: "Create a portfolio website with a dark theme"</span>
          <span>
            <kbd className="px-1 py-0.5 text-xs bg-neutral-700 rounded">Shift</kbd> + <kbd className="px-1 py-0.5 text-xs bg-neutral-700 rounded">Enter</kbd> for new line
          </span>
        </div>
      </div>
    </div>
  );
}
