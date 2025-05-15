import type { FolderNode, FileSystemNode } from '@/types';

export const initialFileSystem: FolderNode[] = [
  {
    id: 'folder-1',
    name: 'Documents',
    type: 'folder',
    children: [
      {
        id: 'file-1-1',
        name: 'Report.txt',
        type: 'file',
        content: 'This is the annual report for Q4.\n\nKey Highlights:\n- Revenue increased by 15%.\n- New product launch was successful.\n- Market share grew by 2%.',
      },
      {
        id: 'folder-1-2',
        name: 'Presentations',
        type: 'folder',
        children: [
          {
            id: 'file-1-2-1',
            name: 'Q4_Review.txt',
            type: 'file',
            content: 'Presentation notes for the Q4 review meeting.\n\nAgenda:\n1. Financial Performance\n2. Product Updates\n3. Marketing Strategy\n4. Q&A',
          },
        ],
      },
    ],
  },
  {
    id: 'folder-2',
    name: 'Images',
    type: 'folder',
    children: [
      {
        id: 'file-2-1',
        name: 'logo-description.txt',
        type: 'file',
        content: 'Description of the company logo:\nA simple, modern design featuring a stylized sage leaf, representing wisdom and growth. The color palette consists of calming greens and a touch of earthy brown.',
      },
      {
        id: 'file-2-2',
        name: 'banner-specs.txt',
        type: 'file',
        content: 'Banner Specifications:\nDimensions: 1200x300 pixels\nFormat: PNG\nTheme: Nature, Technology',
      },
    ],
  },
  {
    id: 'folder-3',
    name: 'Projects',
    type: 'folder',
    children: [
      {
        id: 'folder-3-1',
        name: 'Project Alpha',
        type: 'folder',
        children: [
          {
            id: 'file-3-1-1',
            name: 'README.txt',
            type: 'file',
            content: 'Project Alpha - Initial Setup Guide\n\n1. Clone the repository.\n2. Install dependencies using npm install.\n3. Run the development server using npm run dev.',
          },
          {
            id: 'file-3-1-2',
            name: 'requirements.txt',
            type: 'file',
            content: 'Core Requirements:\n- User Authentication\n- Data Encryption\n- Responsive Design\n- API Integration',
          },
        ],
      },
      {
        id: 'file-3-2',
        name: 'Timeline.txt',
        type: 'file',
        content: 'General Project Timeline:\nPhase 1: Planning (2 Weeks)\nPhase 2: Development (8 Weeks)\nPhase 3: Testing (3 Weeks)\nPhase 4: Deployment (1 Week)',
      },
    ],
  },
  {
    id: 'file-root-1',
    name: 'Notes.txt',
    type: 'file',
    content: 'Quick Notes:\n- Meeting with marketing at 2 PM.\n- Follow up on Project Beta.\n- Draft email for client.',
  },
];
