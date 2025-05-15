export interface FileNode {
  id: string;
  name: string;
  type: 'file';
  content: string;
}

export interface FolderNode {
  id:string;
  name: string;
  type: 'folder';
  children: FileSystemNode[];
}

export type FileSystemNode = FileNode | FolderNode;
