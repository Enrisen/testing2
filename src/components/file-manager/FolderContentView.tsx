
"use client";

import type { FileNode, FolderNode, FileSystemNode } from '@/types';
import { FileListItem } from './FileListItem';
import { FolderListItem } from './FolderListItem';
import { BreadcrumbNav } from './BreadcrumbNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FolderOpen, FolderPlus, FilePlus } from 'lucide-react';

interface FolderContentViewProps {
  folder: FolderNode;
  currentPath: FolderNode[];
  onFileSelect: (file: FileNode) => void;
  onFolderSelect: (folder: FolderNode) => void;
  onPathNavigate: (folderId: string) => void;
  selectedFileIdInFolder: string | null;
  onOpenCreateFolderDialog: () => void;
  onOpenCreateFileDialog: () => void;
}

export function FolderContentView({ 
  folder, 
  currentPath, 
  onFileSelect, 
  onFolderSelect, 
  onPathNavigate, 
  selectedFileIdInFolder,
  onOpenCreateFolderDialog,
  onOpenCreateFileDialog
}: FolderContentViewProps) {
  if (!folder) { 
    return (
      <Card className="h-full flex flex-col items-center justify-center shadow-lg">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>No folder data provided.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader className="flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <div> {/* Container for breadcrumb, title, description */}
            <BreadcrumbNav path={currentPath} onNavigate={onPathNavigate} />
            <CardTitle className="text-xl pt-1">
              {folder.name} 
            </CardTitle>
            <CardDescription>
              {folder.children.length} item(s)
            </CardDescription>
          </div>
          <div className="flex space-x-2 flex-shrink-0 pt-1"> {/* Container for buttons */}
            <Button variant="outline" size="sm" onClick={onOpenCreateFolderDialog}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button variant="outline" size="sm" onClick={onOpenCreateFileDialog}>
              <FilePlus className="h-4 w-4 mr-2" />
              New File
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full p-1">
          {folder.children.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground pt-10">
              <FolderOpen className="h-16 w-16 mb-4 text-accent" />
              <p className="text-lg">This folder is empty.</p>
              <p className="text-sm mt-1">You can add items using the buttons above.</p>
            </div>
          ) : (
            <div className="space-y-1 p-1">
              {folder.children.map((node: FileSystemNode) => (
                node.type === 'folder' ? (
                  <FolderListItem
                    key={node.id}
                    node={node as FolderNode}
                    onSelect={() => onFolderSelect(node as FolderNode)}
                  />
                ) : (
                  <FileListItem
                    key={node.id}
                    node={node as FileNode}
                    onSelect={() => onFileSelect(node as FileNode)}
                    isSelected={selectedFileIdInFolder === node.id}
                  />
                )
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
