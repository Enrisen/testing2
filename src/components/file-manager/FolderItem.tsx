"use client";

import type { FolderNode } from '@/types';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderItemProps {
  node: FolderNode;
  level: number;
  onFolderSelect: (folder: FolderNode) => void;
  activeFolderId: string | null;
  expandedFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
}

export function FolderItem({
  node,
  level,
  onFolderSelect,
  activeFolderId,
  expandedFolders,
  toggleFolder,
}: FolderItemProps) {
  const isExpanded = expandedFolders.has(node.id);
  const isActive = activeFolderId === node.id;

  return (
    <div>
      <div
        className={cn(
          'flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-150 ease-in-out',
          isActive ? 'bg-accent/80 text-accent-foreground' : 'hover:bg-secondary/50 dark:hover:bg-secondary/30',
          'focus:outline-none focus:ring-2 focus:ring-ring'
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => {
          onFolderSelect(node);
          // Optionally, always toggle on click, or let onFolderSelect handle conditional toggle
          // For simplicity and direct user feedback, always toggle.
          toggleFolder(node.id);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onFolderSelect(node);
            toggleFolder(node.id);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-current={isActive ? "page" : undefined}
        aria-label={`Folder ${node.name}, ${isExpanded ? 'expanded' : 'collapsed'}${isActive ? ', current' : ''}`}
      >
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
        <Folder className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-accent-foreground" : "text-accent")} />
        <span className="truncate text-sm font-medium">{node.name}</span>
      </div>
      {isExpanded && (
        <div className="mt-1">
          {node.children.map((childNode) =>
            childNode.type === 'folder' ? ( // Only render sub-folders for the tree
              <FolderItem
                key={childNode.id}
                node={childNode as FolderNode}
                level={level + 1}
                onFolderSelect={onFolderSelect}
                activeFolderId={activeFolderId}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            ) : null // Files are not rendered in the left tree under folders
          )}
        </div>
      )}
    </div>
  );
}