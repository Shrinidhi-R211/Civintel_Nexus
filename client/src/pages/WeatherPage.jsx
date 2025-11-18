import { useState, useEffect } from 'react';
import rainy from '../photos/rainy.jpg';
import sunny from '../photos/sunny.jpg';
import cloudy from '../photos/cloudy.jpg';
import thunder from '../photos/thunderstorm.jpg';
import windy from '../photos/windmill.jpg';
import cloudIcon from '../icons/cloudy.svg';
import rainIcon from '../icons/rain.svg';
import sunnyIcon from '../icons/sunny.svg';


import { RiSearch2Line } from "react-icons/ri";
import useDebounce from '../customhooks/useDebounce';
import WeatherCard from '../components/basicWeather.jsx';
// import ToggleSwitch from '../component/toggleButton';

function ToggleSwitch({isOn, setIsOn}) {
  // const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`w-12 h-6 mr-4 flex items-center bg-gray-500 rounded-full p-1 cursor-pointer transition duration-300 ${isOn ? 'bg-green-500' : 'bg-gray-500'}`} 
        onClick={handleToggle}
      >
        <div className='flex gap-4 w-full'>
          <span>C</span>
          <span className='text-green-500'>F</span>
        </div>
        {/* The circle */}
        <div 
          className={`absolute bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${isOn ? 'translate-x-6' : ''}`}
        ></div>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  const [place, setPlace] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [todaysForecast, setTodaysForecast] = useState(null);
  const [futureForecast, setFutureForecasts] = useState(null);
  const [error, setError] = useState(null); // To handle errors
  const [isOn, setIsOn] = useState(false); // to handle the toggle Button
  const debounceSearch = useDebounce(place,500)

  function formatDateTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);

    return `${hours}:${minutes} - ${dayName} ${day} ${monthName} ${year}`;
  }

  const currentDate = new Date();
  const formattedDateTime = formatDateTime(currentDate);

  function showWeatherImages(weather) {
    if (weather === "Rain") {
      return rainy;
    } else if (weather === "Clear") {
      return sunny;
    } else if (weather === "Clouds") {
      return cloudy;
    } else if (weather === "thunder") {
      return thunder;
    } else if (weather === "wind") {
      return windy;
    } else {
      return rainy; // Default image
    }
  }

  function showWeatherIcons(weather) {
    if (weather === "Rain") {
    return rainIcon;
    } else if (weather === "Clear") {
    return sunnyIcon;
    } else if (weather === "Clouds") {
    return cloudIcon;
    } else {
    return rainIcon; // Default image
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (place.trim()) {
      setError(null); // Reset error if there's valid input
    } else {
      setError("Please enter a valid location."); // Set error for empty input
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${debounceSearch}&appid=bec289f063d8686cec8fb82776adc1a6`
        );
        if (!response.ok) {
          throw new Error("City not found");
        }        
        const finalResponse = await response.json();

        setWeatherData(finalResponse);
        setError(null)
      } catch (error) {
        setError(error.message);
        setWeatherData(null); // Reset weather data on error
      }
    };
    if (debounceSearch) {
      fetchData();
    }
  }, [debounceSearch]);

  useEffect(() => {
  if (weatherData && weatherData.list) {
    const currentDateTime = new Date();

    // Get today's forecast up to the current time
    const todaysForecastData = weatherData.list.filter((data) => {
      const forecastDateTime = new Date(data.dt_txt);
      return (
        forecastDateTime.getDate() === currentDateTime.getDate() &&
        forecastDateTime.getMonth() === currentDateTime.getMonth() &&
        forecastDateTime.getFullYear() === currentDateTime.getFullYear() &&
        forecastDateTime <= currentDateTime
      );
    });

    const recent = todaysForecastData[todaysForecastData.length - 1];
    setTodaysForecast(recent || null);

    // Group forecast data by day for future dates
    const groupedForecasts = weatherData.list.reduce((acc, data) => {
      const forecastDateTime = new Date(data.dt_txt);
      const day = forecastDateTime.toISOString().split('T')[0]; // YYYY-MM-DD

      if (forecastDateTime > currentDateTime) { // Only consider future forecasts
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(data);
      }

      return acc;
    }, {});

    // Get the most relevant forecast for each future day
    const filteredForecasts = Object.keys(groupedForecasts).map((day) => {
      const forecasts = groupedForecasts[day];
      return forecasts[forecasts.length - 1]; // Most recent forecast for the day
    });

    // console.log(filteredForecasts); // Check the filtered future forecasts
    setFutureForecasts(filteredForecasts); // Update state with filtered future forecasts
  }
}, [weatherData]);


  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row">
      {/* Background Image Section */}
      <div>
        <img
          src={showWeatherImages(todaysForecast && todaysForecast.weather[todaysForecast.weather.length - 1].main)}
          alt="Weather background"
          className="absolute inset-0 h-full w-full object-cover"
          loading='lazy'
        />

        {/* Text Overlay */}
        <div className="absolute top-14 md:top-auto md:bottom-14 left-16 right-16 text-white flex flex-col md:flex-row gap-6">
          <h1 className='font-medium text-5xl md:text-7xl flex items-start'>
            {todaysForecast && todaysForecast.main ? 
              isOn ? 
                `${(((todaysForecast.main.temp - 273.15) * 9/5) + 32).toFixed(1)}°F` : 
                `${(todaysForecast.main.temp - 273.15).toFixed(1)}°C` : 
              "N/A"}
          </h1>

          <div className=' flex flex-col justify-end'>
            <span className='font-semibold text-lg md:text-2xl flex items-center gap-5 '>
              {weatherData && weatherData.city ? weatherData.city.name : "Search location"}
              <img 
                src={showWeatherIcons(todaysForecast && todaysForecast.weather[todaysForecast.weather.length - 1].main)} 
                alt="weather-icon" 
                className='w-7 stroke-[6px]'
                loading='lazy'
              />
            </span>
            <span className='text-sm md:text-base'>{formattedDateTime}</span>
          </div>
          <div className='pb-0.5 flex flex-col justify-end'>
            <span>{todaysForecast && todaysForecast.weather[todaysForecast.weather.length - 1].main}</span>
          </div>
        </div>
      </div>

      {/* Blurry Transparent Section */}
      <div className="relative md:absolute md:inset-y-0 md:right-0 md:w-2/5 bg-black bg-opacity-30 backdrop-blur-md p-8 mt-auto md:mt-0 h-2/4 md:h-full overflow-y-auto">
        
        {/* Search Input */}
        <form onSubmit={handleSubmit} className='flex justify-center items-center mb-4'>
          <input 
            type="text"
            value={place || ''}
            name="searchCity" 
            placeholder='Search Location'
            onChange={(e) => setPlace(e.target.value)}
            className='w-full p-3 border-b-2 border-gray-400 bg-transparent focus:outline-none focus:ring-0 placeholder-gray-300 text-lime-400'
          />
          <button type='submit' className='ml-2'>
            <RiSearch2Line className='w-6 h-auto text-lime-400 cursor-pointer' />
          </button>
        </form>

        {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}

        {/* Suggested Locations */}
        <div className='text-white flex flex-col gap-3 mt-8 ml-5 cursor-pointer'>
          <span onClick={() => setPlace("Delhi")}>New Delhi</span>
          <span onClick={() => setPlace("Guwahati")}>Guwahati</span>
          <span onClick={() => setPlace("Bengaluru")}>Bengaluru</span>
          <span onClick={() => setPlace("Chennai")}>Chennai</span>
        </div>

        <hr className='my-10 bg-gray-500 border-none h-0.5' />

        {/* Weather Description */}
        <div className='text-white'>
          <div className='mb-10 flex justify-between items-center'>
            <h1 className='text-2xl'>Weather Details</h1>
            <ToggleSwitch isOn={isOn} setIsOn={setIsOn}/>
          </div>
          <div className='flex flex-col gap-4 mx-5'>
            <div className='flex justify-between items-center'>
              <h4 className='text-lg'>Min temp</h4>
              <span className='flex gap-1 text-lime-400 text-sm'>
                {todaysForecast && todaysForecast.main ? 
                  isOn ? 
                    `${(((todaysForecast.main.temp_min - 273.15) * 9/5) + 32).toFixed(1)}°F` : 
                    `${(todaysForecast.main.temp_min - 273.15).toFixed(1)}°C` : 
                  "N/A"}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <h4 className='text-lg'>Max temp</h4>
              <span className='flex gap-1 text-lime-400 text-sm'>
                {todaysForecast && todaysForecast.main ? 
                  isOn ? 
                    `${(((todaysForecast.main.temp_max - 273.15) * 9/5) + 32).toFixed(1)}°F` : 
                    `${(todaysForecast.main.temp_max - 273.15).toFixed(1)}°C` : 
                  "N/A"}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <h4 className='text-lg'>Humidity</h4>
              <span className='text-lime-400 text-sm'>{todaysForecast && todaysForecast.main ? `${todaysForecast.main.humidity}%` : "N/A"}</span>
            </div>

            <div className='flex justify-between items-center'>
              <h4 className='text-lg'>Wind</h4>
              <span className='text-lime-400 text-sm'>{todaysForecast && todaysForecast.wind ? `${todaysForecast.wind.speed} km/h` : "N/A"}</span>
            </div>
          </div>
        </div>

        <hr className='my-10 bg-gray-500 border-none h-0.5' />

        {/* 5-days forecast */}
        <div className='text-white'>
          <h1 className='text-2xl mb-10'>5-days forecast</h1>
          <div className='flex justify-evenly flex-wrap'>
          {
            futureForecast && 
            futureForecast.slice(0,5).map((data, index) => (
              <WeatherCard key={index} weatherData={data}/>
            ))
          }
          </div>
          
        </div>
      </div>
    </div>
  )}
