
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

interface CreateFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  parentFolderName?: string | null;
}

export function CreateFolderDialog({ isOpen, onClose, onCreate, parentFolderName }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFolderName(''); // Reset when dialog opens
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onCreate(folderName);
    // No need to reset folderName here, useEffect handles it on next open
    // onClose(); // onCreate should handle closing via state update in parent
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
            {parentFolderName ? ` It will be created inside "${parentFolderName}".` : ' It will be created at the root level.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="folder-name" className="text-right">
              Name
            </Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., My Project"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && folderName.trim()) {
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={!folderName.trim()}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
