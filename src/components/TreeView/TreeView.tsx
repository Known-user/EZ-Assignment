import React, { useState, useCallback } from 'react';
import type { TreeNode, TreeViewProps } from './types';
import { TreeNodeRow } from './TreeNodeRow';
import { getNodePath, moveNode, setNodeChildren } from './treeUtils';
import './TreeView.css';

export function TreeView({ initialData = [], onLazyLoad }: TreeViewProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [dragState, setDragState] = useState<{
    draggingId: string | null;
    dropTarget: { id: string; asChild: boolean } | null;
  }>({ draggingId: null, dropTarget: null });
  const [draggedPath, setDraggedPath] = useState<number[] | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const loadChildren = useCallback(
    async (nodeId: string) => {
      if (!onLazyLoad || loadingIds.has(nodeId)) return;
      setLoadingIds((prev) => new Set(prev).add(nodeId));
      try {
        const children = await onLazyLoad(nodeId);
        setTreeData((prev) => setNodeChildren(prev, nodeId, children));
        setExpandedIds((prev) => new Set(prev).add(nodeId));
      } finally {
        setLoadingIds((prev) => {
          const n = new Set(prev);
          n.delete(nodeId);
          return n;
        });
      }
    },
    [onLazyLoad, loadingIds]
  );

  const onDragStart = useCallback((id: string, path: number[]) => {
    setDraggedPath(path);
    setDragState({ draggingId: id, dropTarget: null });
  }, []);

  const onDragOver = useCallback((_e: React.DragEvent, id: string, asChild: boolean) => {
    setDragState((prev) =>
      prev.draggingId === id ? prev : { ...prev, dropTarget: { id, asChild } }
    );
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent, targetId: string, asChild: boolean) => {
      e.preventDefault();
      const fromId = e.dataTransfer.getData('text/plain');
      if (!fromId || !draggedPath) {
        setDragState({ draggingId: null, dropTarget: null });
        setDraggedPath(null);
        return;
      }
      const fromPath = draggedPath;
      const toPath = getNodePath(treeData, targetId);
      if (!toPath) {
        setDragState({ draggingId: null, dropTarget: null });
        setDraggedPath(null);
        return;
      }
      if (fromPath.join(',') === toPath.join(',') && !asChild) {
        setDragState({ draggingId: null, dropTarget: null });
        setDraggedPath(null);
        return;
      }
      if (asChild) {
        setTreeData((prev) => moveNode(prev, fromPath, toPath, 0));
      } else {
        const parentPath = toPath.slice(0, -1);
        const toIndex = toPath[toPath.length - 1] + 1;
        setTreeData((prev) => moveNode(prev, fromPath, parentPath.length ? parentPath : [], toIndex));
      }
      setDragState({ draggingId: null, dropTarget: null });
      setDraggedPath(null);
    },
    [treeData, draggedPath]
  );

  const onDragEnd = useCallback(() => {
    setDragState({ draggingId: null, dropTarget: null });
    setDraggedPath(null);
  }, []);

  console.log('treeData', treeData);
  return (
    <div className="tree-view">
      <div className="tree-view-header">Tree View</div>
      {treeData.map((node, idx) => (
        <TreeNodeRow
          key={node.id}
          node={node}
          depth={0}
          path={[idx]}
          treeData={treeData}
          setTreeData={setTreeData}
          onLazyLoad={onLazyLoad}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          loadChildren={loadChildren}
          dragState={dragState}
          setDragState={setDragState}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}
