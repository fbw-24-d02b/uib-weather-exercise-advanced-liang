// 替换成你自己的API密钥
const apiKey = '8ee0ee1386092cdc507a8269ed0e2b74';
const city = 'Balingen';
const country = 'DE'; // Germany's country code

// 构建API请求URL
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

// 使用fetch API发送请求
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // 处理并显示天气数据
        const weatherDiv = document.getElementById('weather');
        const temperature = Math.floor(data.main.temp);
        const weatherDescription = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = Math.floor(data.wind.speed);
        const windSpeedKmh = Math.floor((windSpeed * 3.6).toFixed(2));

        // 获取降雨信息
        const rain = data.rain ? (data.rain['1h'] ? data.rain['1h'] : (data.rain['3h'] ? data.rain['3h'] : 0)) : 0;
        
        // 创建天气信息的HTML内容
        const weatherInfo = `
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weatherDescription}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s (${windSpeedKmh} km/h)</p>
            <p>Rain: ${rain} mm</p>
        `;
        weatherDiv.innerHTML = weatherInfo;
    })
    .catch(error => {
        console.error('An error occurred while fetching the weather data:', error);
        document.getElementById('weather').textContent = 'Failed to fetch weather data.';
    });
