// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import TaksList from './components/TaksList';

function App() {
  return (
    <div className="App">
      <TaksList />  {/* Carga el componente TaskList */}
    </div>
  );
}

export default App;