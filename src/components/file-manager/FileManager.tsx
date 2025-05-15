
"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { FileSystemNode, FileNode, FolderNode } from '@/types';
import { initialFileSystem } from '@/data/files';
import { FolderItem } from './FolderItem';
import { FileItem } from './FileItem';
import { FileContentDisplay } from './FileContentDisplay';
import { FolderContentView } from './FolderContentView';
import { CreateFolderDialog } from './CreateFolderDialog';
import { CreateFileDialog } from './CreateFileDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FolderPlus, FilePlus, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const fileIsChildOfFolder = (file: FileNode, folder: FolderNode): boolean => {
  return folder.children.some(child => child.id === file.id && child.type === 'file');
};

const findFolderById = (targetId: string, nodes: FileSystemNode[]): FolderNode | null => {
  for (const node of nodes) {
    if (node.type === 'folder') {
      if (node.id === targetId) {
        return node as FolderNode;
      }
      if (node.children) {
        const found = findFolderById(targetId, node.children);
        if (found) return found;
      }
    }
  }
  return null;
};

const buildPathToFolder = (targetId: string, nodes: FileSystemNode[], currentPathStack: FolderNode[] = []): FolderNode[] | null => {
  for (const node of nodes) {
    if (node.type === 'folder') {
      const newPathStack = [...currentPathStack, node as FolderNode];
      if (node.id === targetId) {
        return newPathStack;
      }
      if (node.children) {
        const foundPath = buildPathToFolder(targetId, node.children, newPathStack);
        if (foundPath) {
          return foundPath;
        }
      }
    }
  }
  return null;
};

// Helper to recursively add a node to a parent by ID
const addNodeToParentById = (nodes: FileSystemNode[], parentId: string, newNode: FileSystemNode): FileSystemNode[] => {
  return nodes.map(node => {
    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node,
        children: [...(node.children || []), newNode],
      } as FolderNode;
    }
    if (node.type === 'folder' && node.children) {
      return {
        ...node,
        children: addNodeToParentById(node.children, parentId, newNode),
      } as FolderNode;
    }
    return node;
  });
};


export function FileManager() {
  const [fileSystemData, setFileSystemData] = useState<(FolderNode | FileNode)[]>([...initialFileSystem]);
  const { toast } = useToast();

  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showCreateFileDialog, setShowCreateFileDialog] = useState(false);
  const [creationParentFolderId, setCreationParentFolderId] = useState<string | null>(null);
  const [creationParentFolderName, setCreationParentFolderName] = useState<string | null>(null);


  const getPathForFolder = useCallback((folderId: string | null, fsDataToSearch: FileSystemNode[]): FolderNode[] => {
    if (!folderId) return [];
    // Search within the current fileSystemData state
    return buildPathToFolder(folderId, fsDataToSearch) || [];
  }, []); // Removed fileSystemData from deps as it's used from state

  const initialActiveFolder = useMemo(() => {
    // Use a fresh copy from the potentially modified initialFileSystem if needed, or ensure fileSystemData is used.
    // For simplicity, assuming initialFileSystem structure is stable for determining the *initial* active folder.
    const rootFolders = fileSystemData.filter(node => node.type === 'folder') as FolderNode[];
    if (rootFolders.length > 0) {
      return rootFolders[0];
    }
    return null;
  }, [fileSystemData]); // Depend on fileSystemData if it can change in a way that affects initial active folder logic
  
  const [activeFolder, setActiveFolder] = useState<FolderNode | null>(initialActiveFolder);
  
  const [currentPath, setCurrentPath] = useState<FolderNode[]>(() => 
    initialActiveFolder ? getPathForFolder(initialActiveFolder.id, fileSystemData) : []
  );

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>();
    if (initialActiveFolder) {
      initialExpanded.add(initialActiveFolder.id);
      const pathNodes = getPathForFolder(initialActiveFolder.id, fileSystemData);
      pathNodes.forEach(pNode => initialExpanded.add(pNode.id));
    }
    return initialExpanded;
  });

  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  
  // Effect to update activeFolder and currentPath if fileSystemData changes
  // and activeFolderId still exists. This is important after adding/deleting items.
  useEffect(() => {
    if (activeFolder?.id) {
      const refreshedActiveFolder = findFolderById(activeFolder.id, fileSystemData);
      setActiveFolder(refreshedActiveFolder); // This might be null if folder was deleted
      if (refreshedActiveFolder) {
        setCurrentPath(getPathForFolder(refreshedActiveFolder.id, fileSystemData));
      } else {
        // Active folder was deleted, reset relevant states
        setCurrentPath([]);
        // Optionally, select a default or parent folder
      }
    }
  }, [fileSystemData, activeFolder?.id, getPathForFolder]);


  const expandAllParents = useCallback((folderId: string, fsData: FileSystemNode[], currentExpanded: Set<string>): Set<string> => {
    const pathNodes = getPathForFolder(folderId, fsData); // Use getPathForFolder which depends on current fileSystemData
    const newExpanded = new Set(currentExpanded);
    pathNodes.forEach(pNode => newExpanded.add(pNode.id));
    return newExpanded;
  }, [getPathForFolder]);


  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return newExpanded;
    });
  }, []);

  const handleFolderSelectLogic = useCallback((folder: FolderNode) => {
    setActiveFolder(folder);
    setCurrentPath(getPathForFolder(folder.id, fileSystemData));
    setSelectedFile(null);
    setExpandedFolders(prev => expandAllParents(folder.id, fileSystemData, prev));
    if (!expandedFolders.has(folder.id)) {
        toggleFolder(folder.id);
    }
  }, [fileSystemData, getPathForFolder, expandAllParents, expandedFolders, toggleFolder]);


  const handleFolderTreeSelect = useCallback((folder: FolderNode) => {
    handleFolderSelectLogic(folder);
  }, [handleFolderSelectLogic]);

  const handleRootFileTreeSelect = useCallback((file: FileNode) => {
    setSelectedFile(file);
    setActiveFolder(null);
    setCurrentPath([]);
  }, []);

  const handleContentFileSelect = useCallback((file: FileNode) => {
    setSelectedFile(file);
  }, []);

  const handleContentFolderSelect = useCallback((folder: FolderNode) => {
     handleFolderSelectLogic(folder);
  }, [handleFolderSelectLogic]);

  const handleCloseFileView = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleBreadcrumbNavigate = useCallback((folderId: string) => {
    const folderToNavigate = findFolderById(folderId, fileSystemData);
    if (folderToNavigate) {
      handleFolderSelectLogic(folderToNavigate);
    }
  }, [fileSystemData, handleFolderSelectLogic]);

  // --- Create Folder/File Logic ---
  const openCreateFolderDialog = (parentId: string | null) => {
    setCreationParentFolderId(parentId);
    const parent = parentId ? findFolderById(parentId, fileSystemData) : null;
    setCreationParentFolderName(parent ? parent.name : null);
    setShowCreateFolderDialog(true);
  };

  const closeCreateFolderDialog = () => setShowCreateFolderDialog(false);

  const handleCreateFolder = (name: string) => {
    if (!name.trim()) {
      toast({ title: "Error", description: "Folder name cannot be empty.", variant: "destructive" });
      return;
    }
    const newFolder: FolderNode = {
      id: `folder-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      type: 'folder',
      children: [],
    };

    let newFsData;
    if (creationParentFolderId) {
      newFsData = addNodeToParentById([...fileSystemData], creationParentFolderId, newFolder);
    } else {
      newFsData = [...fileSystemData, newFolder];
    }
    setFileSystemData(newFsData);
    
    // If the folder was created inside the currently active folder, refresh activeFolder state
    if (activeFolder && creationParentFolderId === activeFolder.id) {
        const updatedParent = findFolderById(creationParentFolderId, newFsData);
        setActiveFolder(updatedParent);
    }

    closeCreateFolderDialog();
    toast({ title: "Success", description: `Folder "${name}" created.` });
  };

  const openCreateFileDialog = (parentId: string | null) => {
    setCreationParentFolderId(parentId);
    const parent = parentId ? findFolderById(parentId, fileSystemData) : null;
    setCreationParentFolderName(parent ? parent.name : null);
    setShowCreateFileDialog(true);
  };

  const closeCreateFileDialog = () => setShowCreateFileDialog(false);

  const handleCreateFile = (name: string, content: string) => {
    if (!name.trim()) {
      toast({ title: "Error", description: "File name cannot be empty.", variant: "destructive" });
      return;
    }
    const newFile: FileNode = {
      id: `file-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      type: 'file',
      content,
    };

    let newFsData;
    if (creationParentFolderId) {
      newFsData = addNodeToParentById([...fileSystemData], creationParentFolderId, newFile);
    } else {
      newFsData = [...fileSystemData, newFile];
    }
    setFileSystemData(newFsData);

    if (activeFolder && creationParentFolderId === activeFolder.id) {
        const updatedParent = findFolderById(creationParentFolderId, newFsData);
        setActiveFolder(updatedParent);
    }
    
    closeCreateFileDialog();
    toast({ title: "Success", description: `File "${name}" created.` });
  };


  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)] p-4 md:p-6">
        {/* Left Pane: Folder Tree & Root Files */}
        <Card className="w-full md:w-1/3 lg:w-1/4 shadow-lg flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex justify-between items-center">
              <CardTitle>File Explorer</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openCreateFolderDialog(null)} aria-label="Create Root Folder">
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openCreateFileDialog(null)} aria-label="Create Root File">
                  <FilePlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-2">
              {fileSystemData.map((node) =>
                node.type === 'folder' ? (
                  <FolderItem
                    key={node.id}
                    node={node as FolderNode}
                    level={0}
                    onFolderSelect={handleFolderTreeSelect}
                    activeFolderId={activeFolder?.id || null}
                    expandedFolders={expandedFolders}
                    toggleFolder={toggleFolder}
                  />
                ) : (
                  <FileItem
                    key={node.id}
                    node={node as FileNode}
                    level={0}
                    onSelect={handleRootFileTreeSelect}
                    isSelected={selectedFile?.id === node.id && !activeFolder}
                  />
                )
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Pane: Content Area */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {selectedFile ? (
            <FileContentDisplay selectedFile={selectedFile} onCloseFileView={handleCloseFileView} />
          ) : activeFolder ? (
            <FolderContentView
              folder={activeFolder}
              currentPath={currentPath}
              onFileSelect={handleContentFileSelect}
              onFolderSelect={handleContentFolderSelect}
              onPathNavigate={handleBreadcrumbNavigate}
              selectedFileIdInFolder={activeFolder && selectedFile && fileIsChildOfFolder(selectedFile, activeFolder) ? selectedFile.id : null}
              onOpenCreateFolderDialog={() => openCreateFolderDialog(activeFolder.id)}
              onOpenCreateFileDialog={() => openCreateFileDialog(activeFolder.id)}
            />
          ) : (
            <Card className="h-full flex flex-col items-center justify-center shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Welcome to FileSage</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Inbox className="h-16 w-16 mb-4 text-accent" />
                <p className="text-lg">Select a folder to view its contents, or a file to see details.</p>
                <p className="text-sm mt-2">You can also create new folders or files using the <FolderPlus className="inline h-4 w-4"/> or <FilePlus className="inline h-4 w-4"/> buttons.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <CreateFolderDialog 
        isOpen={showCreateFolderDialog} 
        onClose={closeCreateFolderDialog} 
        onCreate={handleCreateFolder}
        parentFolderName={creationParentFolderName}
      />
      <CreateFileDialog 
        isOpen={showCreateFileDialog} 
        onClose={closeCreateFileDialog} 
        onCreate={handleCreateFile} 
        parentFolderName={creationParentFolderName}
      />
    </>
  );
}

