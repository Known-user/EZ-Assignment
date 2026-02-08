import type { TreeNode } from './types';

let idCounter = 0;
export function generateId(): string {
  return `node-${Date.now()}-${++idCounter}`;
}

export function findNodeById(root: TreeNode[], id: string): { node: TreeNode; parent: TreeNode[]; index: number } | null {
  for (let i = 0; i < root.length; i++) {
    if (root[i].id === id) return { node: root[i], parent: root, index: i };
    const child = root[i].children;
    if (child) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

export function cloneTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((n) => ({
    ...n,
    children: n.children ? cloneTree(n.children) : undefined,
  }));
}

export function removeNodeById(root: TreeNode[], id: string): TreeNode[] {
  const next = cloneTree(root);
  const found = findNodeById(next, id);
  if (!found) return root;
  found.parent.splice(found.index, 1);
  return next;
}

export function addChildToNode(root: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] {
  const next = cloneTree(root);
  const found = findNodeById(next, parentId);
  if (!found) return root;
  const node = found.node;
  if (!node.children) node.children = [];
  node.children.push(newNode);
  node.childrenLoaded = true;
  return next;
}

export function updateNodeName(root: TreeNode[], id: string, name: string): TreeNode[] {
  const next = cloneTree(root);
  const found = findNodeById(next, id);
  if (!found) return root;
  found.node.name = name;
  return next;
}

/** Get path of indices from root to node id */
export function getNodePath(root: TreeNode[], id: string): number[] | null {
  for (let i = 0; i < root.length; i++) {
    if (root[i].id === id) return [i];
    const child = root[i].children;
    if (child) {
      const sub = getNodePath(child, id);
      if (sub) return [i, ...sub];
    }
  }
  return null;
}

export function getNodeAtPath(root: TreeNode[], path: number[]): { node: TreeNode; parent: TreeNode[]; index: number } | null {
  let current: TreeNode[] = root;
  for (let i = 0; i < path.length - 1; i++) {
    const idx = path[i];
    if (idx < 0 || idx >= current.length) return null;
    const node = current[idx];
    if (!node.children) return null;
    current = node.children;
  }
  const idx = path[path.length - 1];
  if (idx < 0 || idx >= current.length) return null;
  return { node: current[idx], parent: current, index: idx };
}

/**
 * Move node from fromPath to a new position.
 * @param toParentPath Path to the parent node whose children we insert into ([] = root).
 * @param toIndex Index within that parent's children to insert at.
 */
export function moveNode(
  root: TreeNode[],
  fromPath: number[],
  toParentPath: number[],
  toIndex: number
): TreeNode[] {
  const next = cloneTree(root);
  const from = getNodeAtPath(next, fromPath);
  if (!from) return root;
  const nodeToMove = from.node;

  const fromParent = from.parent;
  const fromIdx = from.index;
  fromParent.splice(fromIdx, 1);

  let targetParent: TreeNode[];
  if (toParentPath.length === 0) {
    targetParent = next;
  } else {
    const toParent = getNodeAtPath(next, toParentPath);
    if (!toParent) return root;
    if (!toParent.node.children) toParent.node.children = [];
    targetParent = toParent.node.children;
  }
  targetParent.splice(Math.min(toIndex, targetParent.length), 0, nodeToMove);
  return next;
}

export function getSiblingPath(path: number[], delta: number): number[] | null {
  const p = [...path];
  const last = p.length - 1;
  p[last] += delta;
  if (p[last] < 0) return null;
  return p;
}

/** Set children for a node by id (immutable). Used for lazy load. */
export function setNodeChildren(root: TreeNode[], nodeId: string, children: TreeNode[]): TreeNode[] {
  const next = cloneTree(root);
  const found = findNodeById(next, nodeId);
  if (!found) return root;
  found.node.children = children;
  found.node.childrenLoaded = true;
  return next;
}
