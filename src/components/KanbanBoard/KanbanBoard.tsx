import { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Column, ColumnId, KanbanBoardProps, KanbanState } from './types';
import { KanbanColumn } from './KanbanColumn';

let cardIdCounter = 0;
function generateCardId(): string {
  return `card-${Date.now()}-${++cardIdCounter}`;
}

export function KanbanBoard({ initialState }: KanbanBoardProps) {
  const [state, setState] = useState<KanbanState>(initialState );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const moveCard = useCallback((cardId: string, toColumnId: ColumnId, toIndex: number) => {
    setState((prev) => {
      const columns = prev.columns.map((col) => ({ ...col, cardIds: [...col.cardIds] }));
      const cards = { ...prev.cards };

      let fromColumn: Column | undefined;
      let fromIndex = -1;
      for (const col of columns) {
        const idx = col.cardIds.indexOf(cardId);
        if (idx >= 0) {
          fromColumn = col;
          fromIndex = idx;
          break;
        }
      }
      if (!fromColumn) return prev;

      fromColumn.cardIds.splice(fromIndex, 1);
      const toCol = columns.find((c) => c.id === toColumnId);
      if (!toCol) return prev;
      toCol.cardIds.splice(Math.min(toIndex, toCol.cardIds.length), 0, cardId);
      return { columns, cards };
    });
  }, []);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      const cardId = String(active.id);
      const overId = String(over.id);

      const columnIds = state.columns.map((c) => c.id);
      const overIsColumn = columnIds.includes(overId as ColumnId);
      if (overIsColumn) {
        moveCard(cardId, overId as ColumnId, 0);
        return;
      }

      for (const col of state.columns) {
        const idx = col.cardIds.indexOf(overId);
        if (idx >= 0) {
          const fromCol = state.columns.find((c) => c.cardIds.includes(cardId));
          const insertIndex = fromCol?.id === col.id && col.cardIds.indexOf(cardId) < idx ? idx - 1 : idx;
          moveCard(cardId, col.id, insertIndex);
          return;
        }
      }
    },
    [state.columns, moveCard]
  );

  const addCard = useCallback((columnId: string) => {
    const id = generateCardId();
    setState((prev) => {
      const columns = prev.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      );
      const cards = { ...prev.cards, [id]: { id, title: 'New card' } };
      return { columns, cards };
    });
  }, []);

  const updateCardTitle = useCallback((cardId: string, title: string) => {
    setState((prev) => ({
      ...prev,
      cards: { ...prev.cards, [cardId]: { ...prev.cards[cardId], title } },
    }));
  }, []);

  const deleteCard = useCallback((cardId: string) => {
    setState((prev) => ({
      columns: prev.columns.map((col) => ({
        ...col,
        cardIds: col.cardIds.filter((id) => id !== cardId),
      })),
      cards: Object.fromEntries(Object.entries(prev.cards).filter(([id]) => id !== cardId)),
    }));
  }, []);

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {state.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={column.cardIds.map((id) => state.cards[id]).filter(Boolean)}
            onAddCard={addCard}
            onUpdateCardTitle={updateCardTitle}
            onDeleteCard={deleteCard}
          />
        ))}
      </div>
    </DndContext>
  );
}
