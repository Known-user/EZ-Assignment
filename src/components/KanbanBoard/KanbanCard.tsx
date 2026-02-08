import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from './types';
import './KanbanBoard.css';

type KanbanCardProps = {
  card: CardType;
  onUpdateTitle: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

export function KanbanCard({ card, onUpdateTitle, onDelete }: KanbanCardProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { type: 'card', card },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  const handleSave = () => {
    const t = editValue.trim();
    if (t) onUpdateTitle(card.id, t);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      {editing ? (
        <input
          className="kanban-card-edit"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          onClick={(e) => e.stopPropagation()}
          autoFocus
        />
      ) : (
        <>
          <span className="kanban-card-title" onDoubleClick={() => setEditing(true)}>
            {card.title}
          </span>
          <button
            type="button"
            className="kanban-card-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            title="Delete card"
            aria-label="Delete"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
