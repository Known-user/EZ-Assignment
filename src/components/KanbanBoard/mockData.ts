import type { KanbanState } from './types';

export const initialKanbanState: KanbanState = {
  columns: [
    { id: 'todo', title: 'Todo', cardIds: ['c1', 'c2', 'c3'] },
    { id: 'in-progress', title: 'In Progress', cardIds: ['c4'] },
    { id: 'done', title: 'Done', cardIds: ['c5', 'c6'] },
  ],
  cards: {
    c1: { id: 'c1', title: 'Review design mockups' },
    c2: { id: 'c2', title: 'Implement API integration' },
    c3: { id: 'c3', title: 'Write unit tests' },
    c4: { id: 'c4', title: 'Fix responsive layout' },
    c5: { id: 'c5', title: 'Deploy to staging' },
    c6: { id: 'c6', title: 'Update documentation' },
  },
};
