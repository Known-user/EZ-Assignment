# Front-End Developer Test

React + TypeScript implementation of the assignment.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build & preview

```bash
npm run build
npm run preview
```

## Delivered components

### 1. Tree View (`<TreeView />`)

- **Expand / collapse** – Parent nodes toggle; expand icon (▶/▼) reflects state.
- **Add node** – “+” adds a child; inline input for the name.
- **Remove node** – “×” deletes a node (and subtree) with confirmation.
- **Drag & drop** – Reorder within the same level; move between parents; drop as sibling (same level) or as child (green highlight).
- **Lazy loading** – Children for “Videos” load on first expand (simulated API delay).
- **Edit name** – Double-click or edit (✎) for inline editing.
- **Tech** – React + TypeScript, clear data model and state, minimal deps (no extra lib for tree DnD).

### 2. Kanban Board (`<KanbanBoard />`)

- **Columns** – Todo, In Progress, Done.
- **Add / delete cards** – “+” on a column; “×” on a card.
- **Move cards** – Drag and drop between columns; order within a column is preserved.
- **Editable title** – Double-click a card to edit inline.
- **Responsive** – Columns stack vertically on small screens (e.g. &lt; 768px).
- **Tech** – React + TypeScript, @dnd-kit for drag-and-drop, Board → Column → Card structure.

