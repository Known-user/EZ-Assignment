import React, { useState, useCallback } from 'react';
import type { TreeNodeRowProps } from './types';
import {
  generateId,
  removeNodeById,
  addChildToNode,
  updateNodeName,
} from './treeUtils';
import './TreeView.css';

export const TreeNodeRow: React.FC<TreeNodeRowProps> = ({
  node,
  depth,
  path,
  treeData,
  setTreeData,
  onLazyLoad,
  expandedIds,
  toggleExpand,
  loadChildren,
  dragState,
  setDragState,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);
  const [adding, setAdding] = useState(false);
  const [newChildName, setNewChildName] = useState('');

  const hasChildren = node.hasChildren || (node.children && node.children.length > 0);
  const isExpanded = expandedIds.has(node.id);
  const isLoading = hasChildren && !node.childrenLoaded;

  const handleExpand = useCallback(() => {
    if (isLoading) return;
    if (hasChildren && !node.childrenLoaded && onLazyLoad) {
      loadChildren(node.id);
    }
    toggleExpand(node.id);
  }, [hasChildren, node.childrenLoaded, node.id, isLoading, onLazyLoad, loadChildren, toggleExpand]);

  const handleDelete = useCallback(() => {
    if (!window.confirm(`Delete "${node.name}" and all its children?`)) return;
    setTreeData(removeNodeById(treeData, node.id));
  }, [node.id, node.name, treeData, setTreeData]);

  const handleEdit = useCallback(() => {
    setEditing(true);
    setEditValue(node.name);
  }, [node.name]);

  const handleSaveEdit = useCallback(() => {
    const name = editValue.trim();
    if (name) setTreeData(updateNodeName(treeData, node.id, name));
    setEditing(false);
  }, [editValue, node.id, treeData, setTreeData]);

  const handleAddChild = useCallback(() => {
    const name = newChildName.trim();
    if (!name) {
      setAdding(false);
      return;
    }
    const newNode = {
      id: generateId(),
      name,
      children: [],
      childrenLoaded: true,
    };
    setTreeData(addChildToNode(treeData, node.id, newNode));
    setNewChildName('');
    setAdding(false);
  }, [newChildName, node.id, treeData, setTreeData]);

  const isDropTarget = dragState.dropTarget?.id === node.id;
  const dropAsChild = dragState.dropTarget?.asChild ?? false;
  const isDragging = dragState.draggingId === node.id;

  return (
    <>
    <div
      className={`tree-node-row ${isDragging ? 'dragging' : ''} ${isDropTarget ? (dropAsChild ? 'drop-target-child' : 'drop-target-sibling') : ''}`}
      style={{ paddingLeft: depth === 0 ? 0 : 20 }}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', node.id);
        onDragStart(node.id, path);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const rect = e.currentTarget.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const asChild = Boolean(e.clientY > mid && hasChildren);
        onDragOver(e, node.id, asChild);
      }}
      onDrop={(e) => onDrop(e, node.id, dropAsChild)}
      onDragEnd={onDragEnd}
    >
     {hasChildren ? <span className="tree-node-expand" onClick={handleExpand} role="button" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
         {isExpanded ? '▼' : '▶'}
      </span> : ""}
      {editing ? (
        <input
          className="tree-node-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
          autoFocus
        />
      ) : (
        <>
          <span className="tree-node-name" onDoubleClick={handleEdit}>
            {node.name}
          </span>
          <span className="tree-node-actions">
            <button type="button" className="tree-btn tree-btn-edit" onClick={handleEdit} title="Edit">✎</button>
            <button type="button" className="tree-btn tree-btn-add" onClick={() => setAdding(true)} title="Add child">+</button>
            <button type="button" className="tree-btn tree-btn-delete" onClick={handleDelete} title="Delete">×</button>
          </span>
        </>
      )}
      {adding && (
        <span className="tree-node-add-inline">
          <input
            placeholder="New node name"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddChild();
              if (e.key === 'Escape') setAdding(false);
            }}
            autoFocus
          />
          <button type="button" onClick={handleAddChild}>Add</button>
          <button type="button" onClick={() => setAdding(false)}>Cancel</button>
        </span>
      )}
    </div>
      {isExpanded && hasChildren && node.childrenLoaded && node.children && (
        <div className="tree-node-children" style={{ marginLeft: depth * 20 + 9}}>
          {node.children.map((child, idx) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              path={[...path, idx]}
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
      )}
      {isExpanded && isLoading && (
        <div className="tree-node-loading" style={{ paddingLeft: (depth + 1) * 20 }}>
          Loading…
        </div>
      )}
    </>
  );
};
