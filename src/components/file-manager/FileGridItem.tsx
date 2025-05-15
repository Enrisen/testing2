
"use client";

import type { FileNode } from '@/types';
import { FileText, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileListItemProps { // Renamed from FileGridItemProps
  node: FileNode;
  onSelect: (file: FileNode) => void;
  isSelected: boolean;
}

export function FileListItem({ node, onSelect, isSelected }: FileListItemProps) { // Renamed from FileGridItem
  const { toast } = useToast();

  const handleCopyFileContent = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation(); 
    if (!node.content) {
        toast({
            title: 'Copy Failed',
            description: 'File content is empty.',
            variant: 'destructive',
        });
        return;
    }

    try {
      const htmlContent = `<div><pre style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace;">${node.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></div>`;
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const plainTextBlob = new Blob([node.content], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': plainTextBlob,
        }),
      ]);
      toast({
        title: 'Content Copied',
        description: `${node.name} content copied to clipboard as rich text.`,
      });
    } catch (err) {
      console.error('Failed to copy content: ', err);
      toast({
        title: 'Copy Failed',
        description: 'Could not copy content to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div // Changed from Card to div for more control over list item layout
      className={cn(
        'flex items-center justify-between w-full p-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md focus-within:ring-1 focus-within:ring-ring',
        isSelected ? 'border-accent ring-1 ring-accent bg-accent/10 dark:bg-accent/20 text-accent-foreground' : 'hover:border-accent/50 focus-within:border-accent border border-transparent', // Added transparent border for consistent height
        'group' // Added group for potential future styling
      )}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(node); }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`File ${node.name}`}
    >
      <div className="flex items-center overflow-hidden"> {/* Group icon and name, allow truncation */}
        <FileText className={cn("h-5 w-5 mr-2 flex-shrink-0", isSelected ? "text-accent-foreground": "text-accent")} />
        <span className="truncate text-sm font-medium">{node.name}</span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="ml-2 h-7 w-7 p-1 text-muted-foreground hover:text-accent-foreground flex-shrink-0" // Ensure button doesn't cause overflow
        onClick={handleCopyFileContent}
        aria-label={`Copy content of ${node.name}`}
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}
