import './App.css';
import DataList from './DataList';
import axios from 'axios';

function App() {
  return (
    <div className="App">
      <div className="DataList">
      <h1>Espoo</h1>
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
      console.log('Error:', error.request);
    } else {
      console.log('Error:', error.message);
    }
  });

export default App;
