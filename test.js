document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('weather-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting normally

        var city = document.getElementById('city').value;
        var country = document.getElementById('country').value;
        var apiKey = '8ee0ee1386092cdc507a8269ed0e2b74'; 

        var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

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

                // Display current weather information in corresponding HTML elements
                document.getElementById("temperature").textContent = temperature + "°C";
                document.getElementById("max-temperature").textContent = maxTemperature + "°C";
                document.getElementById("min-temperature").textContent = minTemperature + "°C";
                document.getElementById("wind-speed").textContent = windSpeedKmh + " km/h";
                document.getElementById("rain-probability").textContent = rainProbability + " mm";
                document.getElementById("weather-description").textContent = weatherDescription;
            })
            .catch(error => console.error("An error occurred while fetching current weather:", error));
    });
});