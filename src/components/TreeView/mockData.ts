import type { TreeNode } from './types';

export const initialTreeData: TreeNode[] = [
  {
    id: '1',
    name: 'Documents',
    hasChildren: true,
    children: [
      {
        id: '1-1',
        name: 'Work',
        hasChildren: true,
        children: [
          { id: '1-1-1', name: 'Report.pdf' },
          { id: '1-1-2', name: 'Presentation.pptx' },
        ],
        childrenLoaded: true,
      },
      {
        id: '1-2',
        name: 'Personal',
        hasChildren: true,
        children: [],
        childrenLoaded: true,
      },
    ],
    childrenLoaded: true,
  },
  {
    id: '2',
    name: 'Pictures',
    hasChildren: true,
    children: [],
    childrenLoaded: true,
  },
  {
    id: '3',
    name: 'Videos',
    hasChildren: true,
    children: undefined,
    childrenLoaded: true,
  },
];

/** Simulates API call for lazy loading children */
export async function simulateLazyLoad(parentId: string): Promise<TreeNode[]> {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
  const count = 2 + Math.floor(Math.random() * 3);
  return Array.from({ length: count }, (_, i) => ({
    id: `${parentId}-${i + 1}`,
    name: `Item ${i + 1}`,
    hasChildren: Math.random() > 0.6,
    children: undefined,
    childrenLoaded: false,
  }));
}
