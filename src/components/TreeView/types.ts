export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  /** If true, children are loaded (lazy). If undefined, not yet loaded. */
  childrenLoaded?: boolean;
  /** If true, this node has children (for lazy loading placeholder). */
  hasChildren?: boolean;
}

export type TreeViewProps = {
  initialData?: TreeNode[];
  onLazyLoad?: (nodeId: string) => Promise<TreeNode[]>;
};


export type TreeNodeRowProps = {
  node: TreeNode;
  depth: number;
  path: number[];
  treeData: TreeNode[];
  setTreeData: (data: TreeNode[]) => void;
  onLazyLoad?: (nodeId: string) => Promise<TreeNode[]>;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  loadChildren: (id: string) => Promise<void>;
  dragState: { draggingId: string | null; dropTarget: { id: string; asChild: boolean } | null };
  setDragState: (s: { draggingId: string | null; dropTarget: { id: string; asChild: boolean } | null }) => void;
  onDragStart: (id: string, path: number[]) => void;
  onDragOver: (e: React.DragEvent, id: string, asChild: boolean) => void;
  onDrop: (e: React.DragEvent, targetId: string, asChild: boolean) => void;
  onDragEnd: () => void;
};