// src/DataList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hae data API:sta
    axios.get('https://saa-api.onrender.com/saaapi/ennusteet/')
      .then(response => {
        setData(response.data); // Oletetaan, että data on vastausobjektissa
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  // Lajittele data päivämäärän ('pvm') mukaan
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.pvm);
    const dateB = new Date(b.pvm);
    return dateA - dateB; // Pienemmät päivämäärät tulevat ensin
  });

  // Funktio vertailuun ennusteen ja kolme päivää myöhemmin toteutuneen lämpötilan välillä
  const compareTemperatures = (forecastDate, forecastTemp) => {
    // Etsi kolme päivää ennusteen jälkeen toteutunut lämpötila
    const forecastDateObj = new Date(forecastDate);
    const targetDate = new Date(forecastDateObj);
    targetDate.setDate(targetDate.getDate() + 3); // Siirretään päivämäärää kolme päivää eteenpäin

    // Etsi tietokannasta merkintä, joka vastaa kolme päivää myöhempää päivämäärää
    const correspondingDate = sortedData.find(item => {
      const compareDateObj = new Date(item.pvm);
      return compareDateObj.getTime() === targetDate.getTime(); // Vertaa aikaleimoja tarkasti
    });
    
    // Jos löydetään vastaava toteutunut lämpötila, lasketaan ero
    if (correspondingDate) {
      const temperatureDifference = correspondingDate.lampotila_nyt - forecastTemp;
      return temperatureDifference.toFixed(2); // Pyöristetään kahteen desimaaliin
    }
    return null; // Jos ei löydy vastaavaa tietoa
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Lämpötilan vertailu: Ennuste vs Toteutunut (3 päivää myöhemmin)</h2>
          <table>
            <thead>
              <tr>
                <th>Päivämäärä (ennuste)</th>
                <th>Ennuste (3pv) (°C)</th>
                <th>Toteutunut lämpötila (3pv myöhemmin) (°C)</th>
                <th>Ero toteutuneeseen lämpötilaan (°C)</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => {
                const temperatureDifference = compareTemperatures(item.pvm, item.lampotila_3pv);
                return (
                  <tr key={index}>
                    <td>{new Date(item.pvm).toLocaleDateString()}</td>
                    <td>{item.lampotila_3pv} °C</td>
                    {/* Etsi kolme päivää ennusteen jälkeen toteutunut lämpötila ja lasketaan ero */}
                    <td>
                      {temperatureDifference !== null
                        ? sortedData.find(d => new Date(d.pvm).getTime() === new Date(item.pvm).getTime() + 3*24*60*60*1000)?.lampotila_nyt
                        : 'Ei tietoa'}
                    </td>
                    {/* Ero toteutuneeseen lämpötilaan */}
                    <td>
                      {temperatureDifference !== null
                        ? temperatureDifference
                        : 'Ei tietoa'}
                      °C
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DataList;
