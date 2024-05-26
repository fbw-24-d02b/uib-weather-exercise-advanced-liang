/*
task list:
--static layout for general weather informaiton-- done
--fetch weather data from OpenWeatherMap API-- done
--calculate real-time sun position on sunrise-sunset curve--
--add input form to refresh location and weather data--
--show weather app via githup or rented domain--
*/



window.onload = function () {

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

  // API Key and URL for fetching weather data
  const apiKey = '8ee0ee1386092cdc507a8269ed0e2b74';
  var city = 'Balingen';
  var country = 'DE'; // Germany's country code

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
      var rainProbability = weatherData.rain ? (weatherData.rain['1h'] ? weatherData.rain['1h'] : 0) : 0;
      var weatherDescription = weatherData.weather[0].description;

      console.log(weatherData);

      // Display current weather information in corresponding HTML elements
      document.getElementById("current-temperature").textContent = temperature + "°C";
      document.getElementById("max-temperature").textContent = maxTemperature + "°C";
      document.getElementById("min-temperature").textContent = minTemperature + "°C";
      document.getElementById("wind-speed").textContent = windSpeedKmh + " km/h";
      document.getElementById("rain-probability").textContent = rainProbability + " mm";
      document.getElementById("weather-description").textContent = weatherDescription;
    })
    .catch(error => console.error("An error occurred while fetching current weather:", error));
};