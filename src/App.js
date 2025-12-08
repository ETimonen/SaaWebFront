import logo from './logo.svg';
import './App.css';
import DataList from './DataList';
import axios from 'axios';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
      <div className="DataList">
      <h1>Data List Sorted by Date</h1>
      <DataList /> {}
      </div>
    </div>
  );
}

axios.get('https://saa-api.onrender.com/saaapi/ennusteet/')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
    if (error.response) {
      console.log(error.response.data);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
  });

export default App;
