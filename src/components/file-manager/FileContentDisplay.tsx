
"use client";

import type { FileNode } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Copy, FileWarning } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileContentDisplayProps {
  selectedFile: FileNode | null;
  onCloseFileView?: () => void;
}

export function FileContentDisplay({ selectedFile, onCloseFileView }: FileContentDisplayProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!selectedFile || !selectedFile.content) return;

    try {
      // Create HTML content for rich text copying
      const htmlContent = `<div><pre style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace;">${selectedFile.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></div>`;
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const plainTextBlob = new Blob([selectedFile.content], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': plainTextBlob,
        }),
      ]);
      toast({
        title: 'Content Copied',
        description: `${selectedFile.name} content copied to clipboard as rich text.`,
      });
    } catch (err) {
      console.error('Failed to copy content: ', err);
      toast({
        title: 'Copy Failed',
        description: 'Could not copy content to clipboard. Your browser might not support this feature or permissions might be denied.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {onCloseFileView && (
              <Button onClick={onCloseFileView} variant="outline" size="icon" aria-label="Back to folder view" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <CardTitle className="text-xl">
                {selectedFile ? selectedFile.name : 'No File Selected'}
              </CardTitle>
              {selectedFile && (
                  <CardDescription>
                      Displaying content of {selectedFile.name}.
                  </CardDescription>
              )}
            </div>
          </div>
          {selectedFile && (
            <Button variant="outline" size="sm" onClick={handleCopy} aria-label={`Copy content of ${selectedFile.name}`}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Content
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {selectedFile ? (
          <ScrollArea className="h-full pr-4">
            <pre className="text-sm whitespace-pre-wrap break-words" style={{ fontFamily: 'monospace' }}>
              {selectedFile.content}
            </pre>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileWarning className="h-16 w-16 mb-4" />
            <p className="text-lg">Select a file to view its content.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
