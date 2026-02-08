import { useDroppable } from '@dnd-kit/core';
import type { Column as ColumnType, Card } from './types';
import { KanbanCard } from './KanbanCard';
import './KanbanBoard.css';

type KanbanColumnProps = {
  column: ColumnType;
  cards: Card[];
  onAddCard: (columnId: string) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
};

export function KanbanColumn({
  column,
  cards,
  onAddCard,
  onUpdateCardTitle,
  onDeleteCard,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column ${isOver ? 'drop-over' : ''}`}
    >
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">{column.title}</h3>
        <button
          type="button"
          className="kanban-column-add"
          onClick={() => onAddCard(column.id)}
          title="Add card"
        >
          +
        </button>
      </div>
      <div className="kanban-column-cards">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            onUpdateTitle={onUpdateCardTitle}
            onDelete={onDeleteCard}
          />
        ))}
      </div>
    </div>
  );
}
