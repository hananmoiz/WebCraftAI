import { useState } from "react";
import { Website } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, 
  Pencil, 
  Trash2,
  Calendar,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WebsiteCardProps {
  website: Website;
  onSelect: () => void;
  onDelete: () => void;
}

export function WebsiteCard({ website, onSelect, onDelete }: WebsiteCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  // Format the date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Extract HTML preview (attempt to get title or first heading)
  const extractPreviewTitle = (html: string): string => {
    // Try to extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) return titleMatch[1];
    
    // Try to extract first h1
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) return h1Match[1];
    
    // Try to extract first heading of any level
    const headingMatch = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    if (headingMatch && headingMatch[1]) return headingMatch[1];
    
    // Default to website name
    return website.name;
  };

  // Function to generate a preview background from the CSS
  const extractPreviewColor = (css: string): string => {
    // Try to find a background color or gradient from the CSS
    const bgColorMatch = css.match(/background(-color)?:\s*(#[a-f0-9]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|[a-z]+)/i);
    if (bgColorMatch && bgColorMatch[2]) return bgColorMatch[2];
    
    // Try to find a gradient
    const gradientMatch = css.match(/background(-image)?:\s*(linear-gradient\([^)]+\))/i);
    if (gradientMatch && gradientMatch[2]) return gradientMatch[2];
    
    // Default gradient based on website id for variety
    const colors = ['#00FFFF', '#FF00FF', '#7C3AED'];
    const color1 = colors[website.id % 3];
    const color2 = colors[(website.id + 1) % 3];
    return `linear-gradient(45deg, ${color1}33, ${color2}33)`;
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md bg-primary-800 border-neutral-700">
      {/* Preview section with generated background */}
      <div 
        className="h-32 relative"
        style={{ background: extractPreviewColor(website.cssContent) }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/90 flex items-end p-3">
          <h3 className="font-medium text-white truncate">
            {extractPreviewTitle(website.htmlContent)}
          </h3>
        </div>
        
        {/* Options menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-primary-900/50 text-white hover:bg-primary-900/80">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-primary-800 border-neutral-700">
              <DropdownMenuItem onClick={onSelect} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem 
                onClick={() => setShowDeleteAlert(true)}
                className="cursor-pointer text-red-500 focus:text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg text-white mb-2 truncate">{website.name}</h3>
        <p className="text-sm text-neutral-400 mb-2 line-clamp-2">
          {website.description || "No description provided"}
        </p>
        <div className="flex items-center text-xs text-neutral-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Created {formatDate(website.createdAt)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onSelect}
          className="w-full border-neutral-700 hover:border-accent-cyan hover:text-accent-cyan"
        >
          Open Website
        </Button>
      </CardFooter>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-primary-800 border-neutral-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-white">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Delete Website
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{website.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-primary-700 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
