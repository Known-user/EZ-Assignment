export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Card {
  id: string;
  title: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  cardIds: string[];
}

export interface KanbanState {
  columns: Column[];
  cards: Record<string, Card>;
}

export type KanbanBoardProps = {
  initialState: KanbanState;
};