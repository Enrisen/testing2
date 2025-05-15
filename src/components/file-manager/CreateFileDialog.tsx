
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, content: string) => void;
  parentFolderName?: string | null;
}

export function CreateFileDialog({ isOpen, onClose, onCreate, parentFolderName }: CreateFileDialogProps) {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFileName(''); // Reset when dialog opens
      setFileContent('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onCreate(fileName, fileContent);
    // No need to reset here, useEffect handles it on next open
    // onClose(); // onCreate should handle closing
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>
            Enter a name and initial content for your new file.
            {parentFolderName ? ` It will be created inside "${parentFolderName}".` : ' It will be created at the root level.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-name" className="text-right">
              Name
            </Label>
            <Input
              id="file-name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., my-document.txt"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && fileName.trim()) {
                  // Optionally move focus to content or submit
                }
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="file-content" className="text-right pt-2">
              Content
            </Label>
            <Textarea
              id="file-content"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder="Initial content for the file..."
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!fileName.trim()}>Create File</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
