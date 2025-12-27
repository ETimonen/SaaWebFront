import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'

// Funktio, joka hakee ennusteen arvon menneeltä päivämäärältä
const getValueFromPastDate = (currentDate, data, dataType, daysToReduce) => {
  const targetDate = new Date(currentDate)
  targetDate.setDate(targetDate.getDate() - daysToReduce) // Poistetaan päivämäärästä daysToReduce (3 tai 10 päivää)

  // Etsi data-objektista päivämäärä, joka vastaa targetDate
  const pastData = data.find(item => {
    const itemDate = new Date(item.pvm)
    return itemDate.toLocaleDateString() === targetDate.toLocaleDateString()
  })

  if (pastData) {
      switch (dataType) {
        case 'temp':  // Lämpötila
          const tempdays = 'lampotila_' + daysToReduce + 'pv'
          return pastData[tempdays] !== null ? pastData[tempdays] : '-'
        case 'cloud':  // Pilvisyys
          const clouddays = 'pilvisyys_' + daysToReduce + 'pv'
          return pastData[clouddays] !== null ? pastData[clouddays] : '-'
        case 'rain':  // Sademäärä
          const raindays = 'sade_' + daysToReduce + 'pv'
          return pastData[raindays] !== null ? pastData[raindays] : '-'
        default:
          return '-'
      }
  }

  return '-'
}

function DataList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Päivitä windowWidth, kun ikkunan koko muuttuu
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Taulukon otsikkojen vaihto ruudun koon mukaan
  const getHeaderText = (text) => {
    if (windowWidth < 800) {
      switch (text) {
        case 'Päivämäärä': return 'Pvm'
        case 'Ennuste': return 'Enn'
        case 'Toteutunut': return 'Tot'
        default: return text
      }
    } else {
      switch (text) {
        case 'Pvm': return 'Päivämäärä'
        case 'Enn': return 'Ennuste'
        case 'Tot': return 'Toteutunut'
        default: return text
      }
    }
  }

  const Pvm = getHeaderText('Päivämäärä')
  const Enn = getHeaderText('Ennuste')
  const Tot = getHeaderText('Toteutunut')

  // Päivämäärän muotoilu ruudun koon mukaan
  const getDateText = (date) => {
    if (windowWidth < 800) {
      const options = { day: '2-digit', month: '2-digit' }
      return new Intl.DateTimeFormat('fi-FI', options).format(new Date(date))
    }
    else {
      return new Date(date).toLocaleDateString()
    }
  }

  useEffect(() => {
    // Hae data API:sta
    axios.get('https://saa-api.onrender.com/saaapi/ennusteet/')
      .then(response => {
        setData(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }, [])

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a.pvm) - new Date(b.pvm)
    );
  }, [data]);

  return (
    <div className="data-list-container">
      {loading ? (
        <p className="lataus-text">Ladataan...</p>
      ) : (
        <div>
          <h2>Sään ennusteet ja toteutuneet arvot</h2>
          <div className="forecast-tables">
            {/* 3 päivän ennusteet */}
            <table>
              <thead>
                <tr>
                  <th rowSpan="3">{Pvm}</th>
                  <th colSpan="9" className="group3">3 päivän ennusteet</th>
                </tr>
                <tr>
                  <th colSpan="3" className="group3">Lämpötila (°C)</th>
                  <th colSpan="3" className="group3">Sademäärä (mm)</th>
                  <th colSpan="3" className="group3">Pilvisyys (%)</th>
                </tr>
                <tr>
                  <th className="group3">{Enn}</th>
                  <th className="group3">{Tot}</th>
                  <th className="group3">Ero</th>
                  <th className="group3">{Enn}</th>
                  <th className="group3">{Tot}</th>
                  <th className="group3">Ero</th>
                  <th className="group3">{Enn}</th>
                  <th className="group3">{Tot}</th>
                  <th className="group3">Ero</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map(item => {
                  // Muuttujien alustus
                  const tempPast3 = getValueFromPastDate(item.pvm, sortedData, 'temp', 3)
                  const tempDiff3 = tempPast3 !== '-' ? item.lampotila_nyt - tempPast3 : '-'
                  const rainPast3 = getValueFromPastDate(item.pvm, sortedData, 'rain', 3)
                  const rainDiff3 = rainPast3 !== '-' ? item.sade_nyt - rainPast3 : '-'
                  let cloudPast3
                  if (!isNaN(getValueFromPastDate(item.pvm, sortedData, 'cloud', 3))) {
                    cloudPast3 = (Number(getValueFromPastDate(item.pvm, sortedData, 'cloud', 3))).toFixed(0)
                  } 
                  else {
                    cloudPast3 = '-'
                  }
                  const cloudDiff3 = cloudPast3 !== '-' ? ((Number(item.pilvisyys_nyt)).toFixed(0)) - cloudPast3 : '-'

                  return (
                    <tr key={item.pvm}>
                      <td>{getDateText(item.pvm)}</td>

                      <td className="group3">{tempPast3 !== '-' ? tempPast3 : '-'}</td>
                      <td className="group3">{item.lampotila_nyt !== null ? item.lampotila_nyt : '-'}</td>
                      <td className="group3">{tempDiff3 !== '-' ? tempDiff3.toFixed(2) : '-'}</td>

                      <td className="group3">{rainPast3 !== '-' ? rainPast3 : '-'}</td>
                      <td className="group3">{item.sade_nyt !== null ? item.sade_nyt : '-'}</td>
                      <td className="group3">{rainDiff3 !== '-' ? rainDiff3.toFixed(2) : '-'}</td>

                      <td className="group3">{cloudPast3 !== '-' ? cloudPast3 : '-'}</td>
                      <td className="group3">{item.pilvisyys_nyt !== null ? (Number(item.pilvisyys_nyt)).toFixed(0) : '-'}</td>
                      <td className="group3">{cloudDiff3}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 10 päivän ennusteet */}
            <table>
              <thead>
                <tr>
                  <th rowSpan="3">{Pvm}</th>
                  <th colSpan="9" className="group10">10 päivän ennusteet</th>
                </tr>
                <tr>
                  <th colSpan="3" className="group10">Lämpötila (°C)</th>
                  <th colSpan="3" className="group10">Sademäärä (mm)</th>
                  <th colSpan="3" className="group10">Pilvisyys (%)</th>
                </tr>
                <tr>
                  <th className="group10">{Enn}</th>
                  <th className="group10">{Tot}</th>
                  <th className="group10">Ero</th>
                  <th className="group10">{Enn}</th>
                  <th className="group10">{Tot}</th>
                  <th className="group10">Ero</th>
                  <th className="group10">{Enn}</th>
                  <th className="group10">{Tot}</th>
                  <th className="group10">Ero</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map(item => {
                  // Muuttujien alustus
                  const tempPast10 = getValueFromPastDate(item.pvm, sortedData, 'temp', 10)
                  const tempDiff10 = tempPast10 !== '-' ? item.lampotila_nyt - tempPast10 : '-'
                  const rainPast10 = getValueFromPastDate(item.pvm, sortedData, 'rain', 10)
                  const rainDiff10 = rainPast10 !== '-' ? item.sade_nyt - rainPast10 : '-'
                  let cloudPast10
                  if (!isNaN(getValueFromPastDate(item.pvm, sortedData, 'cloud', 10))) {
                    cloudPast10 = (Number(getValueFromPastDate(item.pvm, sortedData, 'cloud', 10))).toFixed(0)
                  } 
                  else {
                    cloudPast10 = '-'
                  }
                  const cloudDiff10 = cloudPast10 !== '-' ? ((Number(item.pilvisyys_nyt)).toFixed(0)) - cloudPast10 : '-'

                  return (
                    <tr key={item.pvm}>
                      <td>{getDateText(item.pvm)}</td>

                      <td className="group10">{tempPast10 !== '-' ? tempPast10 : '-'}</td>
                      <td className="group10">{item.lampotila_nyt !== null ? item.lampotila_nyt : '-'}</td>
                      <td className="group10">{tempDiff10 !== '-' ? tempDiff10.toFixed(2) : '-'}</td>

                      <td className="group10">{rainPast10 !== '-' ? rainPast10 : '-'}</td>
                      <td className="group10">{item.sade_nyt !== null ? item.sade_nyt : '-'}</td>
                      <td className="group10">{rainDiff10 !== '-' ? rainDiff10.toFixed(2) : '-'}</td>

                      <td className="group10">{cloudPast10 !== '-' ? cloudPast10 : '-'}</td>
                      <td className="group10">{item.pilvisyys_nyt !== null ? (Number(item.pilvisyys_nyt)).toFixed(0) : '-'}</td>
                      <td className="group10">{cloudDiff10}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataList
