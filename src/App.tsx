import React from 'react';
import './App.css';
import TaskTable from './components/TaskTable';

function App() {
  return (
    <div className="App">
      <div style={{ padding: '20px' }}>
        <h1>Task Management</h1>
        <TaskTable />
      </div>
    </div>
  );
}

export default App;
