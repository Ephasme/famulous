import React from 'react';
import './App.css';
import ApiCall from './ApiCall';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ApiCall defaultValue="nothing" />
      </header>
    </div>
  );
}

export default App;
