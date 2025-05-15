
"use client";

import * as React from 'react';
import type { FolderNode } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbNavProps {
  path: FolderNode[];
  onNavigate: (folderId: string) => void;
}

export function BreadcrumbNav({ path, onNavigate }: BreadcrumbNavProps) {
  if (!path || path.length === 0) {
    return (
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center space-x-1 text-sm text-muted-foreground h-[28px]">
        {/* Placeholder for height consistency or could show "Root" */}
      </nav>
    ); 
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-2 flex items-center flex-wrap space-x-1 text-sm text-muted-foreground min-h-[28px]">
      {path.map((folder, index) => (
        <React.Fragment key={folder.id}>
          {index > 0 && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
          {index < path.length - 1 ? (
            <Button
              variant="link"
              className="p-0 h-auto text-sm font-normal text-muted-foreground hover:text-accent-foreground hover:no-underline"
              onClick={() => onNavigate(folder.id)}
            >
              {folder.name}
            </Button>
          ) : (
            <span className="font-medium text-foreground text-sm">{folder.name}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
