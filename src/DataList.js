import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Funktio, joka hakee arvon tulevalta päivämäärältä
const getValueFromFutureDate = (currentDate, data, dataType, daysToAdd) => {
  const targetDate = new Date(currentDate);
  targetDate.setDate(targetDate.getDate() + daysToAdd); // Lisätään päivämäärään daysToAdd (esim. 3 tai 10 päivää)

  // Etsi data-objektista päivämäärä, joka vastaa targetDate
  const futureData = data.find(item => {
    const itemDate = new Date(item.pvm);
    return itemDate.toLocaleDateString() === targetDate.toLocaleDateString();
  });

  if (futureData) {
    switch (dataType) {
      case 'temp':  // Lämpötila
        return futureData.lampotila_nyt !== null ? futureData.lampotila_nyt : '-';
      case 'cloud':  // Pilvisyys
        const parsedCloud = parseFloat(futureData.pilvisyys_nyt)
        return parsedCloud.toFixed(1) !== null ? parseFloat(futureData.pilvisyys_nyt).toFixed(1) : '-';
      case 'rain':  // Sademäärä
        return futureData.sade_nyt !== null ? futureData.sade_nyt : '-';
      default:
        return '-';
    }
  }

  return '-';
};


function DataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hae data API:sta
    axios.get('https://saa-api.onrender.com/saaapi/ennusteet/')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const sortedData = useMemo(() => {
    return data.sort((a, b) => new Date(a.pvm) - new Date(b.pvm));
  }, [data]);

  return (
    <div className="data-list-container">
      {loading ? (
        <p>Ladataan...</p>
      ) : (
        <div>
          <h2>Sään ennusteet ja toteutuneet arvot</h2>
          <table>
            <thead>
              {/* Yläotsikot */}
              <tr>
                <th rowSpan="3">Päivämäärä (ennuste)</th>
                <th colSpan="9" className="group3">3 päivän ennuste</th>
                <th colSpan="9" className="group10">10 päivän ennuste</th>
              </tr>

              {/* Ryhmäotsikot */}
              <tr>
                <th colSpan="3" className="group3">Lämpötila (°C)</th>
                <th colSpan="3" className="group3">Sademäärä (mm)</th>
                <th colSpan="3" className="group3">Pilvisyys (%)</th>

                <th colSpan="3" className="group10">Lämpötila (°C)</th>
                <th colSpan="3" className="group10">Sademäärä (mm)</th>
                <th colSpan="3" className="group10">Pilvisyys (%)</th>
              </tr>

              {/* Sarakkeiden nimet */}
              <tr>
                {/* 3pv */}
                <th className="group3">Ennuste</th>
                <th className="group3">Toteutunut</th>
                <th className="group3">Ero</th>
                <th className="group3">Ennuste</th>
                <th className="group3">Toteutunut</th>
                <th className="group3">Ero</th>
                <th className="group3">Ennuste</th>
                <th className="group3">Toteutunut</th>
                <th className="group3">Ero</th>

                {/* 10pv */}
                <th className="group10">Ennuste</th>
                <th className="group10">Toteutunut</th>
                <th className="group10">Ero</th>
                <th className="group10">Ennuste</th>
                <th className="group10">Toteutunut</th>
                <th className="group10">Ero</th>
                <th className="group10">Ennuste</th>
                <th className="group10">Toteutunut</th>
                <th className="group10">Ero</th>
              </tr>
            </thead>

            <tbody>
              {sortedData.map((item, index) => {
                // 3 päivän ennusteet
                const tempDiff3 = getValueFromFutureDate(item.pvm, sortedData, 'temp', 3) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'temp', 3) - item.lampotila_nyt : '-';
                const rainDiff3 = getValueFromFutureDate(item.pvm, sortedData, 'rain', 3) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'rain', 3) - item.sade_nyt : '-';
                const cloudDiff3 = (item.pilvisyys_3pv !== null && item.pilvisyys_nyt !== null) ? (parseFloat(item.pilvisyys_3pv) - parseFloat(item.pilvisyys_nyt)) : '-';
                // 10 päivän ennusteet
                const tempDiff10 = getValueFromFutureDate(item.pvm, sortedData, 'temp', 10) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'temp', 10) - item.lampotila_nyt : '-';
                const rainDiff10 = getValueFromFutureDate(item.pvm, sortedData, 'rain', 10) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'rain', 10) - item.sade_nyt : '-';
                const cloudDiff10 = getValueFromFutureDate(item.pvm, sortedData, 'cloud', 10) !== '-' ? (parseFloat(getValueFromFutureDate(item.pvm, sortedData, 'cloud', 10)) - parseFloat(item.pilvisyys_nyt)) : '-';

                return (
                  <tr key={index}>
                    <td>{new Date(item.pvm).toLocaleDateString()}</td>

                    {/* Lämpötila 3pv */}
                    <td className="group3">{item.lampotila_3pv !== null ? item.lampotila_3pv + "°C" : '-'}</td>
                    <td className="group3">{getValueFromFutureDate(item.pvm, sortedData, 'temp', 3) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'temp', 3) + "°C" : '-'}</td>
                    <td className="group3">{tempDiff3 !== '-' ? tempDiff3.toFixed(2) : '-'}</td>

                    {/* Sademäärä 3pv */}
                    <td className="group3">{item.sade_3pv !== null ? item.sade_3pv + " mm" : '-'}</td>
                    <td className="group3">{getValueFromFutureDate(item.pvm, sortedData, 'rain', 3) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'rain', 3) + " mm" : '-'}</td>
                    <td className="group3">{rainDiff3 !== '-' ? rainDiff3.toFixed(2) : '-'}</td>

                    {/* Pilvisyys 3pv */}
                    <td className="group3">{item.pilvisyys_3pv !== null ? item.pilvisyys_3pv + " %" : '-'}</td>
                    <td className="group3">{getValueFromFutureDate(item.pvm, sortedData, 'cloud', 3) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'cloud', 3) + " %" : '-'}</td>
                    <td className="group3">{cloudDiff3 !== '-' ? cloudDiff3.toFixed(1) : '-'}</td>

                    {/* Lämpötila 10pv */}
                    <td className="group10">{item.lampotila_10pv !== null ? item.lampotila_10pv + "°C" : '-'}</td>
                    <td className="group10">{getValueFromFutureDate(item.pvm, sortedData, 'temp', 10) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'temp', 10) + "°C" : '-'}</td>
                    <td className="group10">{tempDiff10 !== '-' ? tempDiff10.toFixed(2) : '-'}</td>

                    {/* Sademäärä 10pv */}
                    <td className="group10">{item.sade_10pv !== null ? item.sade_10pv + " mm" : '-'}</td>
                    <td className="group10">{getValueFromFutureDate(item.pvm, sortedData, 'rain', 10) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'rain', 10) + " mm" : '-'}</td>
                    <td className="group10">{rainDiff10 !== '-' ? rainDiff10.toFixed(2) : '-'}</td>

                    {/* Pilvisyys 10pv */}
                    <td className="group10">{item.pilvisyys_10pv !== null ? item.pilvisyys_10pv + " %" : '-'}</td>
                    <td className="group10">{getValueFromFutureDate(item.pvm, sortedData, 'cloud', 10) !== '-' ? getValueFromFutureDate(item.pvm, sortedData, 'cloud', 10) + " %" : '-'}</td>
                    <td className="group10">{cloudDiff10 !== '-' ? cloudDiff10.toFixed(2) : '-'}</td>
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
