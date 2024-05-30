
// --static layout for general weather informaiton-- done
// --fetch weather data from OpenWeatherMap API-- done
// --add an form to refresh location and weather data-- done
// --to convert all files into react components--
// --calculate real-time sun position on sunrise-sunset curve-- done
// --update location time-- done
// --add function to switch the background--
// --change the image for the weather description automaticly-- 
// --add cancel button and esc function to hide the location-input-form-- 
// --save and deltete location--
// --switch location by clicking on the location icon-- 
// --switch the background image on changing locations--
// --calculate real-time sun position on sunrise-sunset curve--
// --switch location by dragging the screen--
// --show weather app via githup or a rented domain--
// --to convert all files into react components--


document.addEventListener("DOMContentLoaded", async function () {
  var cityTimezoneOffsetInHours;
  var sunsetTimestamp;
  var sunriseTimestamp;

  // Fetch weather data for the default city and country
  const apiKey = '8ee0ee1386092cdc507a8269ed0e2b74';
  var city = 'Balingen';
  var country = 'Germany';
  let weatherData = await fetchWeatherData(city, country, apiKey);
  if (weatherData) {
    cityTimezoneOffsetInHours = weatherData.cityTimezoneOffsetInHours;
    sunsetTimestamp = weatherData.sunsetTimestamp;
    sunriseTimestamp = weatherData.sunriseTimestamp;
  }

  // define a function to update the clock with the current time in city's local time
  function updateClockAndSunPosition(TimezoneOffset, sunsetTimestamp, sunriseTimestamp) {
    var systemTime = new Date();
    var hours = systemTime.getHours() + TimezoneOffset;
    if (hours >= 24) {
      hours = hours - 24;
    } else if (hours < 0) {
      hours = hours + 24;
    }

    var minutes = systemTime.getMinutes();
    var seconds = systemTime.getSeconds();

    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    var timeString = hours + ":" + minutes + ":" + seconds;
    document.querySelector(".middle-5").textContent = timeString;

    // Get the current timestamp

    var currentTimeStamp = Math.floor(Date.now() / 1000) + TimezoneOffset * 3600;

    // Calculate the time differences
    var daytime = (sunsetTimestamp - sunriseTimestamp) / 3600;
    var runningTime = (currentTimeStamp - sunriseTimestamp) / 3600;

    // Get the sun position on the sunrise-sunset curve on loading the page
    var rotationAngle = (runningTime / daytime) * 180;
    var rotatingElement = document.querySelector('.position-aspect-ratio-1.rotatable');
    var sun = document.querySelector('.moving-sun');

    // Hide the sun if it is night time
    if (currentTimeStamp <= sunriseTimestamp || currentTimeStamp >= sunsetTimestamp) {
      rotationAngle = 0;
      sun.style.display = 'none';
    } else {
      sun.style.display = 'block';
    }

    rotatingElement.style.transform = 'rotate(' + rotationAngle + 'deg)';

    // Update the date in the .middle-6 class with the current date formatted in German style
    var currentDateTime = new Date(currentTimeStamp * 1000);
    var currentDateFormatted = currentDateTime.toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    document.querySelector('.middle-6').textContent = currentDateFormatted;
  }

  updateClockAndSunPosition(cityTimezoneOffsetInHours, sunsetTimestamp, sunriseTimestamp);
  setInterval(function () { updateClockAndSunPosition(cityTimezoneOffsetInHours, sunsetTimestamp, sunriseTimestamp) }, 1000);

  // update the weather data when the form is submitted
  document.getElementById('weather-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    var city = document.getElementById('city').value;
    var country = document.getElementById('country').value;

    document.getElementById('weather-form').style.display = 'none';
    document.getElementById('address').textContent = city + ", " + country;

    let weatherData = await fetchWeatherData(city, country, apiKey);
    if (weatherData) {
      cityTimezoneOffsetInHours = weatherData.cityTimezoneOffsetInHours;
      sunsetTimestamp = weatherData.sunsetTimestamp;
      sunriseTimestamp = weatherData.sunriseTimestamp;
    }
  });

  // add a click event listener to the location icon
  var locationIcon = document.querySelector('.iconfont.icon-location');

  locationIcon.addEventListener('click', function () {
    document.getElementById('weather-form').style.display = 'flex';
    // Clear the input fields
    document.getElementById('city').value = '';
    document.getElementById('country').value = '';
  });

  // define a function to fetch weather data from OpenWeatherMap API
  async function fetchWeatherData(city, country, apiKey) {

    // Build the API request URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const weatherData = await response.json();

      // Process the fetched weather data
      var temperature = Math.floor(weatherData.main.temp);
      var maxTemperature = Math.floor(weatherData.main.temp_max);
      var minTemperature = Math.floor(weatherData.main.temp_min);
      var windSpeed = Math.floor(weatherData.wind.speed);
      var windSpeedKmh = Math.floor((windSpeed * 3.6));
      var humidity = weatherData.main.humidity;
      var weatherDescription = weatherData.weather[0].description;

      // Get city timezone offset
      var cityTimezoneOffset = weatherData.timezone - 7200;
      var cityTimezoneOffsetInHours = cityTimezoneOffset / 3600 ;

      // Calculate sunrise and sunset times in city's local time
      var sunriseTimestamp = weatherData.sys.sunrise + cityTimezoneOffset;
      var sunsetTimestamp = weatherData.sys.sunset + cityTimezoneOffset;


      var sunriseDate = new Date(sunriseTimestamp * 1000);
      var sunsetDate = new Date(sunsetTimestamp * 1000);

      var sunriseHours = sunriseDate.getHours().toString().padStart(2, '0');
      var sunriseMinutes = sunriseDate.getMinutes().toString().padStart(2, '0');
      var sunriseTime = sunriseHours + ":" + sunriseMinutes;

      var sunsetHours = sunsetDate.getHours().toString().padStart(2, '0');
      var sunsetMinutes = sunsetDate.getMinutes().toString().padStart(2, '0');
      var sunsetTime = sunsetHours + ":" + sunsetMinutes;

      console.log(sunriseTime, sunsetTime);

      // Display current weather information in corresponding HTML elements
      document.getElementById("current-temperature").textContent = temperature + "°C";
      document.getElementById("max-temperature").textContent = maxTemperature + "°C";
      document.getElementById("min-temperature").textContent = minTemperature + "°C";
      document.getElementById("wind-speed").textContent = windSpeedKmh + " km/h";
      document.getElementById("humidity").textContent = humidity + "%";
      document.getElementById("weather-description").textContent = weatherDescription;
      document.getElementById("sunrise-time").textContent = sunriseTime;
      document.getElementById("sunset-time").textContent = sunsetTime;

      return {
        cityTimezoneOffsetInHours,
        sunsetTimestamp,
        sunriseTimestamp
      };
    } catch (error) {
      console.error("An error occurred while fetching current weather:", error);
      return null;
    }
  }
});
