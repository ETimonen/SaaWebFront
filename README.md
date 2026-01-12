# SaaWebFront

SaaWebFront on React-pohjainen verkkosovellus, joka hakee säätiedot rajapinnasta (API), esittää ne taulukkomuodossa ja visualisoi sääennusteiden ja toteutuneiden arvojen välisiä eroja kaavioina.

## Yleiskuvaus

Sovellus hakee ajantasaiset ja ennustetut säätiedot rajapinnan kautta ja:
- näyttää säätiedot selkeässä taulukossa
- laskee ennusteen ja toteutuneen sääarvon erotukset
- visualisoi erotukset ja kehityksen kaavioiden avulla

## Ominaisuudet

- Säätietojen haku API-rajapinnasta
- Säätietojen esitys taulukkona
- Ennusteen ja toteutuneen arvon erotusten laskenta
- Kaaviotietojen visualisointi
- Responsiivinen käyttöliittymä

## Teknologiat

- React
- Axios (API-kutsut)
- Recharts (kaaviot)

### Vaatimukset

- Node.js
- npm
- API säätiedoilla esimerkiksi: https://github.com/ETimonen/saa-api

### Asennusohjeet

```bash
git clone https://github.com/ETimonen/SaaWebFront
cd SaaWebFront
npm install
```

### Käyttöönotto

Kun sovellus on esiasennettu ja API on käytettävissä:
- Määritellään API_URL paikalliseksi muuttujaksi: process.env.REACT_APP_API_URL -> "SINUN_APIN_URL_OSOITE"
- Määritellään muuttujat vastaamaan APIn tietorakennetta:
    pvm -> päivämäärä
    lampotila_nyt -> tämänhetkinen lämpötila
    lampotila_3pv -> kolmen päivän ennuste lämpötilasta
    lampotila_10pv -> kymmenen päivän ennuste lämpötilasta
    sade_nyt -> tämänhetkinen sademäärä
    sade_3pv -> kolmen päivän ennuste sademäärästä
    sade_10pv -> kymmenen päivän ennuste sademäärästä
    pilvisyys_nyt -> tämänhetkinen pilvisyysprosentti
    pilvisyys_3pv -> kolmen päivän ennuste pilvisyysprosentista
    pilvisyys_10pv -> kymmenen päivän ennuste pilvisyysprosentista
- Serverin käynnistäminen (varmista että api on käytettävissä):
``` bash
npm start
```

