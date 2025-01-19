import React from 'react';
import ExcelUploader from './components/ExcelUploader';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Excel Uploader</h1>
      </header>
      <main>
        <ExcelUploader />
      </main>
    </div>
  );
};

export default App;
