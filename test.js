document.addEventListener("DOMContentLoaded", async function () {
  var cityTimezoneOffsetInHours;
  const apiKey = '8ee0ee1386092cdc507a8269ed0e2b74';

  // 定义 updateClock 函数
  function updateClock(TimezoneOffset) {
      var systemTime = new Date();
      var hours = systemTime.getUTCHours() + TimezoneOffset;
      if (hours >= 24) {
          hours = hours - 24;
      } else if (hours < 0) {
          hours = hours + 24;
      }
      var minutes = systemTime.getUTCMinutes();
      var seconds = systemTime.getUTCSeconds();

      hours = (hours < 10 ? "0" : "") + hours;
      minutes = (minutes < 10 ? "0" : "") + minutes;
      seconds = (seconds < 10 ? "0" : "") + seconds;

      var timeString = hours + ":" + minutes + ":" + seconds;
      document.querySelector(".middle-5").textContent = timeString;
  }

  setInterval(function() {
    updateClock(cityTimezoneOffsetInHours);
}, 1000);
updateClock(cityTimezoneOffsetInHours); // 初始调用，立即显示时间

  // 获取天气数据并更新时钟
  document.getElementById('weather-form').addEventListener('submit', async function (event) {
      event.preventDefault(); // 防止表单正常提交

      var city = document.getElementById('city').value;
      var country = document.getElementById('country').value;

      document.getElementById('weather-form').style.display = 'none';
      document.getElementById('address').textContent = city + ", " + country;

      cityTimezoneOffsetInHours = await fetchWeatherData(city, country, apiKey);

      // 调用 updateClock 函数并设置间隔
      setInterval(function() {
          updateClock(cityTimezoneOffsetInHours);
      }, 1000);
      updateClock(cityTimezoneOffsetInHours); // 初始调用，立即显示时间
  });

  // 定义 fetchWeatherData 函数
  async function fetchWeatherData(city, country, apiKey) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;
      try {
          const response = await fetch(apiUrl);
          const weatherData = await response.json();
          const timezoneOffset = weatherData.timezone / 3600; // 转换为小时
          return timezoneOffset;
      } catch (error) {
          console.error("An error occurred while fetching current weather:", error);
          return 0;
      }
  }
});