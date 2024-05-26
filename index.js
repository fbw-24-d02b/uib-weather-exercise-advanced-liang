window.onload = function () {

  // fill in class .middle-6 with the current date and format it 
  var currentDate = new Date();
  var formattedDate = currentDate.toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  document.querySelector('.middle-6').textContent = formattedDate;
  // over
  // over
  // over 

  // fill in class .middle-5 with the current time and format it 
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

  // Update clock every second
  setInterval(updateClock, 1000);

  // Initial call to display clock immediately
  updateClock();
  // over
  // over
  // over


  // fetch sunrise time, sunset time, current temperature, maxTemperatureand, minTemperature, windSpeed and rainProbability and fill in corrsponding classes

  // fetch position information
  navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;


    console.log(latitude, longitude);
  
    // Call the Sunrise-Sunset API to get the sunrise and sunset times
    var sunriseSunsetUrl = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;
  
    // Fetch sunrise and sunset times
    fetch(sunriseSunsetUrl)
      .then(response => response.json())
      .then(sunriseSunsetData => {
        var sunrise = new Date(sunriseSunsetData.results.sunrise);
        var sunset = new Date(sunriseSunsetData.results.sunset);
        var sunriseTime = sunrise.getHours() + ":" + sunrise.getMinutes();
        var sunsetTime = sunset.getHours() + ":" + sunset.getMinutes();
  
        // Display sunrise and sunset times
        document.getElementById("sunrise-time").textContent = sunriseTime;
        document.getElementById("sunset-time").textContent = sunsetTime;
  
        // Call OpenWeatherMap API to get current weather 
        var openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=8ee0ee1386092cdc507a8269ed0e2b74&units=metric`;

  
        fetch(openWeatherUrl)
          .then(response => response.json())
          .then(weatherData => {
            var temperature = Math.floor(weatherData.main.temp);
            var maxTemperature = Math.floor(weatherData.main.temp_max);
            var minTemperature = Math.floor(weatherData.main.temp_min);
            var windSpeed = Math.floor(weatherData.wind.speed);
            var windSpeedKmh = Math.floor((windSpeed * 3.6).toFixed(2));
            var rainProbability = weatherData.rain ? (weatherData.rain['1h'] ? weatherData.rain['1h'] : 0) : 0;

            console.log(weatherData.main);
  
            // Display current weather information
            document.getElementById("current-temperature").textContent = temperature + "°C";
            document.getElementById("max-temperature").textContent = maxTemperature + "°C";
            document.getElementById("min-temperature").textContent = minTemperature + "°C";
            document.getElementById("wind-speed").textContent = windSpeedKmh + " km/h";
            document.getElementById("rain-probability").textContent = rainProbability + " mm";
          })
          .catch(error => console.error("An error occurred while fetching current weather:", error));
      })
      .catch(error => console.error("An error occurred while fetching sunrise and sunset times:", error));
  }, function(error) {
    console.error("An error occurred while getting the user's location:", error);
  });
  
  

  // over
  // over
  // over
};