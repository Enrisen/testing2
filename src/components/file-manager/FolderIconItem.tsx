
"use client";

import type { FolderNode } from '@/types';
import { Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderListItemProps { // Renamed from FolderIconItemProps
  node: FolderNode;
  onSelect: (folder: FolderNode) => void;
}

export function FolderListItem({ node, onSelect }: FolderListItemProps) { // Renamed from FolderIconItem
  return (
    <div // Changed from Card to div
      className={cn(
        'flex items-center w-full p-2 rounded-md cursor-pointer transition-all duration-150 ease-in-out hover:shadow-md focus-within:ring-1 focus-within:ring-ring hover:border-accent/50 focus-within:border-accent border border-transparent', // Added transparent border
        'group'
      )}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(node); }}
      tabIndex={0}
      role="button"
      aria-label={`Folder ${node.name}, press to open`}
    >
      <Folder className="h-5 w-5 mr-2 text-accent flex-shrink-0" />
      <span className="truncate text-sm font-medium flex-grow">{node.name}</span>
      {/* Folders typically don't have a copy button in this context, but one could be added here if needed */}
    </div>
  );
}
