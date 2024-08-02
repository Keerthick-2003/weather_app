import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import cloud from './assets/cloud.png';
import drizzle from './assets/drizzle.png';
import humidityIcon from './assets/humidityIcon.png';
import rain from './assets/rain.png';
import searchIcon from './assets/searchIcon.png';
//import smoke from './assets/smoke.png';
import snow from './assets/snow.png';
import sun from './assets/sun.png';
import windIcon from './assets/windIcon.png';

const WeatherDetails = ({sunny, temp, city, country, lat, log, humidity, wind})=>{
  return (
    <>
    <div className='image'>
      <img src={sunny} alt='sun'/>
    </div>
    <div className='temp'>{temp}° C</div>
    <div className='location'>{city}</div>
    <div className='country'>{country}</div>
    <div className="cord">
      <div>
        <span className="lot">lat</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="log">log</span>
        <span>{log}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt='humidity' className='humidityIcon'/>
        <div className="data">
          <div className="humidity-percent">{humidity} %</div>
          <div className="text">Humidity</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt='wind' className='windIcon'/>
        <div className="data">
          <div className="wind-percent">{wind} km/h</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </div>
    </>
  )
}

WeatherDetails.propTypes = {
  icon : PropTypes.string.isRequired,
  temp : PropTypes.number.isRequired,
  city : PropTypes.string.isRequired,
  country : PropTypes.string.isRequired,
  humidity : PropTypes.number.isRequired,
  wind : PropTypes.number.isRequired,
  lat : PropTypes.number.isRequired,
  log : PropTypes.number.isRequired
}

function App() {

  let api_key = "92d210505f1257c7baf93d3907e02dbf";

  const [text, setText] = useState("Chennai");
  const [sunny, setSunny] = useState(sun);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("Chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d" : sun,
    "01n" : sun,
    "02d" : cloud,
    "02n" : cloud,
    "03d" : drizzle,
    "03n" : drizzle,
    "04d" : drizzle,
    "04n" : drizzle,
    "09d" : rain,
    "09n" : rain,
    "010d" : rain,
    "010n" : rain,
    "013d" : snow,
    "013n" : snow,
  }

  const Search = async ()=>{
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
     setLoading(true)
     const res = await fetch(URL);
     let data = await res.json();
    // console.log(data)
    if(data.cod==="404") {
      console.log("City not found")
      setCityNotFound(true)
      setLoading(false)
      return;
    }

    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp))
    setCity(data.name)
    setCountry(data.sys.country)
    setLat(data.coord.lat)
    setLog(data.coord.lon)
    const weatherIconCode = data.weather[0].icon;
    setSunny(weatherIconMap[weatherIconCode] || sun)
    setCityNotFound(false)
   } catch(err) {
      console.error("An Error Occured", err.message);
      setError("Error ocuured while fetching weather data.")
    } finally{
       setLoading(false)
    }
  };

    const handleCity = (e)=>{
      setText(e.target.value)
    }

    const handleKeyDown = (e)=>{
      if(e.key==="Enter") {
        Search();
      }
    }

    useEffect(()=>{
      Search();
    }, [])

  return (
    <>
    <div className="container">
      <div className="input-container">
        <input type="text"
        className='cityInput'
        placeholder="Search City"
        onChange={handleCity}
        value={text}
        onKeyDown={handleKeyDown}/>
        <div className="search-icon" onClick={()=>Search()}>
        <img src={searchIcon} alt='search' className='searchIcon'/>
        </div>
      </div>
  
      {loading && <div className="loading-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}
      {cityNotFound && <div className="city-not-found">City not found</div>}

      {!loading && !cityNotFound && !error && <WeatherDetails
        sunny={sunny}
        temp={temp}
        city={city}
        country={country}
        lat={lat}
        log={log}
        humidity={humidity}
        wind={wind}
      />}

      {/* <p className="copyright">
        &copy; Designed by <span>Me</span>
      </p> */}
    </div>
    </>
  )
}

export default App