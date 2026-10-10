import './App.css'
import { useState } from 'react'

function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function fetchWeather() {
    setLoading(true);
    setError("");
    setWeather(null);
    try {

      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);

      if (!geoRes.ok) {
        throw new Error(`Api error: ${geoRes.status}`);
      }

      const geoData = await geoRes.json();

      const { latitude, longitude, name } = geoData.results[0];

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        tempU: weatherData.current_weather_units.temperature,
        windU: weatherData.current_weather_units.windspeed,
      });

    }
    catch (err) {
      setError("City not found. Try again.")
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Weather App</h1>
      <div className='search-bar'>
        <input placeholder='Enter a city...' value={city} onChange={e => setCity(e.target.value)} />
        <button onClick={fetchWeather}>Search</button>
      </div>
      {loading && <p className="loading">Searching...</p>}
      {error && <p className='error'>{error}</p>}
      {weather && (
        <div className='weather-card'>
          <p className="city-name">{weather.city}</p>
          <p className='temperature'>{weather.temp}{weather.tempU}</p>
          <p className='weather-detail'>💨 Wind: {weather.wind} {weather.windU}</p>
        </div>
      )}
    </div>
  )
}

export default App
