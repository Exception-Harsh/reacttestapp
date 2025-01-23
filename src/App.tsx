import ExcelUploader from './components/ExcelUploader';
import DBConnection from "./components/DBConnection";
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Excel Uploader</h1>
      </header>
      <main>
        <ExcelUploader />
      </main>
      <main>
        <DBConnection />
      </main>
    </div>
  );
};

export default App;
