import './App.css'
import DataList from './DataList'
import Footer from './Footer'
import axios from 'axios'

function App() {
  return (
    <div className="App">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <br />
      <h1>Espoo</h1>
      <div className="DataList">
        <DataList /> {}
      </div>
      <br />
      <Footer /> {}
    </div>
  )
}

// Debuggausta varten
axios.get(process.env.REACT_APP_API_URL)
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error('Error:', error)
    if (error.response) {
      console.log(error.response.data)
    } else if (error.request) {
      console.log('Error:', error.request)
    } else {
      console.log('Error:', error.message)
    }
  })

export default App;
