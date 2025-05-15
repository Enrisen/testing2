"use client";

import type { FileNode } from '@/types';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItemProps {
  node: FileNode;
  level: number;
  onSelect: (file: FileNode) => void;
  isSelected: boolean;
}

export function FileItem({ node, level, onSelect, isSelected }: FileItemProps) {
  return (
    <div
      className={cn(
        'flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors duration-150 ease-in-out',
        isSelected ? 'bg-accent/20 dark:bg-accent/30 text-accent-foreground' : 'hover:bg-secondary/50 dark:hover:bg-secondary/30',
        'focus:outline-none focus:ring-2 focus:ring-ring'
      )}
      style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(node); }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`File ${node.name}`}
    >
      <FileText className={cn("h-5 w-5 flex-shrink-0", isSelected ? "text-accent-foreground" : "text-accent")} />
      <span className="truncate text-sm">{node.name}</span>
    </div>
  );
}