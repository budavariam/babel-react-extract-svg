import React from 'react';
import './App.css';
import { logo as Logo } from "./assets/icons/logo" // BEFORE
//import { logo as Logo } from './assets/generated-icons/logo.js'; // AFTER

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
