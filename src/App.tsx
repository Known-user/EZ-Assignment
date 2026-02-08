import { TreeView } from './components/TreeView';
import { initialTreeData, simulateLazyLoad } from './components/TreeView/mockData';
import { KanbanBoard } from './components/KanbanBoard';
import { initialKanbanState } from './components/KanbanBoard/mockData';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Front-End Developer Test</h1>
      </header>
      <main className="app-main">
        <section className="app-section">
          <h2>1. Tree View Component</h2>
          <TreeView
            initialData={initialTreeData}
            onLazyLoad={simulateLazyLoad}
          />
        </section>
        <section className="app-section">
          <h2>2. Kanban Board Component</h2>
          <KanbanBoard initialState={initialKanbanState} />
        </section>
      </main>
    </div>
  );
}

export default App;
