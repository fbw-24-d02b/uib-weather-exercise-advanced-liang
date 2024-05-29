document.addEventListener("DOMContentLoaded", async function () {
  var cityTimezoneOffsetInHours;

  // Fetch weather data for the default city and country
  const apiKey = '8ee0ee1386092cdc507a8269ed0e2b74';
  var city = 'Balingen';
  var country = 'Germany';
  cityTimezoneOffsetInHours = await fetchWeatherData(city, country, apiKey);

  // define a function to update the clock with the current time in city's local time
  function updateClock(TimezoneOffset) {
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
  }

  updateClock(cityTimezoneOffsetInHours);
  setInterval(function () { updateClock(cityTimezoneOffsetInHours) }, 1000);

  // update the weather data when the form is submitted
  document.getElementById('weather-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    var city = document.getElementById('city').value;
    var country = document.getElementById('country').value;

    document.getElementById('weather-form').style.display = 'none';
    document.getElementById('address').textContent = city + ", " + country;

    cityTimezoneOffsetInHours = await fetchWeatherData(city, country, apiKey);
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
      var cityTimezoneOffsetInHours = cityTimezoneOffset / 3600;

      // Calculate sunrise and sunset times in city's local time
      var currentTimeStamp = weatherData.dt + cityTimezoneOffset;
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

      // Get current local time from API response
      // Convert seconds to milliseconds
      var currentDateTime = new Date(currentTimeStamp * 1000);
      var currentTimeString = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Calculate the time differences
      var timeDifferenceOfSunriseSunset = (sunsetTimestamp - sunriseTimestamp) / 3600;
      var timeDifferenceOfCurrentSunrise = (currentTimeStamp - sunriseTimestamp) / 3600;

      // Get the sun position on the sunrise-sunset curve on loading the page
      var rotationAngle = (timeDifferenceOfCurrentSunrise / timeDifferenceOfSunriseSunset) * 180;
      var element = document.querySelector('.position-aspect-ratio-1.rotatable');

      if (currentTimeStamp <= sunriseTimestamp || currentTimeStamp >= sunsetTimestamp) {
        rotationAngle = 0;
      }

      element.style.transform = 'rotate(' + rotationAngle + 'deg)';

      // Display current weather information in corresponding HTML elements
      document.getElementById("current-temperature").textContent = temperature + "°C";
      document.getElementById("max-temperature").textContent = maxTemperature + "°C";
      document.getElementById("min-temperature").textContent = minTemperature + "°C";
      document.getElementById("wind-speed").textContent = windSpeedKmh + " km/h";
      document.getElementById("humidity").textContent = humidity + "%";
      document.getElementById("weather-description").textContent = weatherDescription;
      document.getElementById("sunrise-time").textContent = sunriseTime;
      document.getElementById("sunset-time").textContent = sunsetTime;

      // Update the date in the .middle-6 class with the current date formatted in German style
      var currentDateTime = new Date(currentTimeStamp * 1000);
      var currentDateFormatted = currentDateTime.toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

      document.querySelector('.middle-6').textContent = currentDateFormatted;

      // Update the time in the .middle-5 class with the current time in city's local time


      return cityTimezoneOffsetInHours;
    } catch (error) {
      console.error("An error occurred while fetching current weather:", error);
      return null;
    }
  }
});
