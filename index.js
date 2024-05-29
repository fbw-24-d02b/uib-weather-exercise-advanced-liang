/*
task list:
"general weather informaiton"
    --static layout for general weather informaiton-- done
    --fetch weather data from OpenWeatherMap API-- done
    --add an form to refresh location and weather data-- done
    --to convert all files into react components--
    --change the image for the weather description automaticly-- 
    --add cancel button and esc function to hide the location-input-form-- 
    --switch location by clicking on the location icon-- 
    --switch the background image on changing locations--
    --calculate real-time sun position on sunrise-sunset curve--
    --show weather app via githup or a rented domain--
*/



document.addEventListener("DOMContentLoaded", function () {



  // Update the date in the .middle-6 class with the current date formatted in German style
  var currentDate = new Date();
  var formattedDate = currentDate.toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  document.querySelector('.middle-6').textContent = formattedDate;

  // Update the time in the .middle-5 class with the current time formatted as HH:MM:SS
  function updateClock() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    // Add leading zeros if needed
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;

    var timeString = hours + ":" + minutes + ":" + seconds;
    document.querySelector(".middle-5").textContent = timeString;
  }

  // Update the clock every second
  setInterval(updateClock, 1000);

  // Initial call to display the clock immediately
  updateClock();


  // Fetch weather data for the default city and country
  const apiKey = '8ee0ee1386092cdc507a8269ed0e2b74';
  var city = 'Balingen';
  var country = 'Germany';
  fetchWeatherData(city, country, apiKey);

  // update the weather data when the form is submitted
  document.getElementById('weather-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting normally


    var city = document.getElementById('city').value;
    var country = document.getElementById('country').value;

    document.getElementById('weather-form').style.display = 'none';
    document.getElementById('address').textContent = city + ", " + country;

    fetchWeatherData(city, country, apiKey);
  });

  // add a click event listener to the location icon
  var locationIcon = document.querySelector('.iconfont.icon-location');

  locationIcon.addEventListener('click', function () {
    document.getElementById('weather-form').style.display = 'flex';
    // Clear the input fields
    document.getElementById('city').value = '';
    document.getElementById('country').value = '';
  });

  // to define a function to fetch weather data from OpenWeatherMap API
  function fetchWeatherData(city, country, apiKey) {

    // Build the API request URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

    // Fetch weather data from OpenWeatherMap API
    fetch(apiUrl)
      .then(response => response.json())
      .then(weatherData => {
        // Process the fetched weather data
        var temperature = Math.floor(weatherData.main.temp);
        var maxTemperature = Math.floor(weatherData.main.temp_max);
        var minTemperature = Math.floor(weatherData.main.temp_min);
        var windSpeed = Math.floor(weatherData.wind.speed);
        var windSpeedKmh = Math.floor((windSpeed * 3.6));
        var humidity = weatherData.main.humidity;
        var weatherDescription = weatherData.weather[0].description;

        // Calculate sunrise and sunset times
        var sunriseTimestamp = weatherData.sys.sunrise;
        var sunsetTimestamp = weatherData.sys.sunset;

        var sunriseDate = new Date(sunriseTimestamp * 1000);
        var sunsetDate = new Date(sunsetTimestamp * 1000);

        var sunriseTime = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        var sunsetTime = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Calculate the time differences
        var timeDifference = (sunsetTimestamp - sunriseTimestamp) / 3600;
        var hoursDifference = Math.floor(timeDifference);
        var minutesDifference = Math.round((timeDifference - hoursDifference) * 60);

        // Get current time (local system time)
        var currentTime = new Date();
        var currentTimeDifference = (sunriseDate - currentTime) / 3600;
        var currentHoursDifference = Math.floor(currentTimeDifference);
        var currentMinutesDifference = Math.round((currentTimeDifference - currentHoursDifference) * 60);


        // Display the time differences
        console.log(weatherData);
        console.log(sunriseTime + " " + sunsetTime);


        // Display current weather information in corresponding HTML elements
        document.getElementById("current-temperature").textContent = temperature + "°C";
        document.getElementById("max-temperature").textContent = maxTemperature + "°C";
        document.getElementById("min-temperature").textContent = minTemperature + "°C";
        document.getElementById("wind-speed").textContent = windSpeedKmh + " km/h";
        document.getElementById("humidity").textContent = humidity + "%";
        document.getElementById("weather-description").textContent = weatherDescription;
        document.getElementById("sunrise-time").textContent = sunriseTime;
        document.getElementById("sunset-time").textContent = sunsetTime;
      })
      .catch(error => console.error("An error occurred while fetching current weather:", error));
  }
});