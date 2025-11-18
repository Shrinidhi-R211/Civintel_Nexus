/* eslint-disable react/prop-types */
import cloudy from '../icons/cloudy.svg'
import rain from '../icons/rain.svg'
import sunny from '../icons/sunny.svg'


export default function WeatherCard({weatherData}){
    // console.log(weatherData);

    function formatDay(date) {        
        const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
        const dayName = days[date.getDay()];

        return `${dayName}`;
    }

    const currentDate = new Date(weatherData.dt_txt);
    const formattedDateTime = formatDay(currentDate);
    
    function showWeatherIcons(weather) {
        if (weather === "Rain") {
        return rain;
        } else if (weather === "Clear") {
        return sunny;
        } else if (weather === "Clouds") {
        return cloudy;
        } else {
        return rain; // Default image
        }
    }
    
    return(
        <div className='flex flex-col items-center gap-3'>
            <h3 className=''>{formattedDateTime}</h3>
            <img 
                src={showWeatherIcons(weatherData.weather[weatherData.weather.length - 1].main)} alt="weather icon"
                loading='lazy'
            />
            <h4 className=''>{(weatherData.main.temp - 273.15).toFixed(1)}</h4>
        </div>
    )
}