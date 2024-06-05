/* task list */
// --static layout for general weather informaiton-- done
// --fetch weather data from OpenWeatherMap API-- done
// --add an input-submit-form to refresh location and weather data-- done
// --calculate real-time sun position on sunrise-sunset curve-- done
// --add cancel-button to quit input-submit-form-- done
// --Synchronize local time erery second-- done
// --publish weather app via githup or a rented domain--done
// --add function to switch the background-image--done
// --change the image of the weather according to description automaticly-- done
// --add moon curve and update the moon position automaticly-- done
// --add dark mode and light mode-- done
// --switch dark mode during night time in location-- done
// --switch location by clicking on the location icon-- done
// --switch location by dragging the screen--done 
// --call weather Api every 5min-- done
// --to convert all files into react components-- not working
// --add more weather data in--


/* 
*structure of js code
    function triggerAnimation()
    function for draggable element start
    function for draggable element end
    Fetch the weather data for the gived 3 default citys
*   button.ok and #check-lock function start
*     carousel function start
*     carousel function end
*   button.ok and #check-lock function, end 
*   
    function: convert timestamp to time
    Function: convert time (HH:MM) to total minutes
    
*   Fetch und update weather data, start
*     Fetch weather data for the default city and country

*     function: update the clock with the current time in city's local time
*       Get the current timestamp in city's local time
*       caculate the sun's position on the sunrise-sunset curve during daytime
        caculate the moon's position on the moonrise-moonset curve during nighttime
        Hide the sun if it is night time
*       Update the date in the .middle-6 class with the current date formatted in German style

*     function: update the weather data when the form is submitted
*       add a click event listener to the cancel button
*       add a click event listener to the location icon  

*     function: fetch weather data from OpenWeatherMap API
*       Process the fetched weather data
*     --important!!! Get city timezone offset  
*       Calculate sunrise and sunset times in city's local time
*       Display current weather information in corresponding HTML elements
*       Change the weather image based on the weather description
*       Return the city timezone offset, sunset and sunrise timestamps
*   Fetch und update weather data, end
*/


document.addEventListener("DOMContentLoaded", async function () {
  // function for draggable element start
  const draggable = document.querySelector('.draggable');
  const movingPoint = document.querySelector('.moving-point');

  
  let index = 0; // Initialize index outside to maintain state between events
  let isMoving = false; // Flag to check if moving is allowed
  const cityList = document.querySelectorAll('.city-name');
  const countryList = document.querySelectorAll('.country-name');
  const citys = [];
  const countrys = [];
  var city, country;


  const apiKey = '8ee0ee1386092cdc507a8269ed0e2b74';
  cityList.forEach(city => {
    citys.push(city.textContent);
  });
  countryList.forEach(country => {
    countrys.push(country.textContent);
  });
  var cityEx = "";
  async function getWeather(city, country, apiKey) {

    document.getElementById('address').textContent = city + ", " + country;

    let weatherData = await fetchWeatherData(city, country, apiKey);
    if (weatherData) {
      cityTimezoneOffsetInHours = weatherData.cityTimezoneOffsetInHours;
      sunsetTimestamp = weatherData.sunsetTimestamp;
      sunriseTimestamp = weatherData.sunriseTimestamp;
    }
    if (cityEx !== city) { triggerAnimation(); }
    cityEx = city;
  }

  function triggerAnimation() {
    draggable.classList.add('animate');
    draggable.addEventListener('animationend', () => {
      draggable.classList.remove('animate');
    }, { once: true });
  }



  // Add mousedown event listener to the draggable element
  draggable.addEventListener('mousedown', startDrag);
  draggable.addEventListener('touchstart', startDrag);

  function startDrag(e) {
    let initialX;
    let offsetX;

    // Prevent default behavior to avoid scrolling on touch devices
    e.preventDefault();

    // to select the initialX value from the event object
    if (e.type === 'mousedown') {
      initialX = e.clientX;
    } else if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX;
    }

    offsetX = draggable.getBoundingClientRect().left;
    offsetX = 0;
    isMoving = true; // Enable moving on mousedown

    // Add event listeners for mousemove, touchmove, mouseup, and touchend ！！！
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);

    function onMouseMove(e) {
      if (!isMoving) return; // Exit if moving is not allowed

      let newX;
      if (e.type === 'mousemove') {
        newX = e.clientX;
      } else if (e.type === 'touchmove') {
        newX = e.touches[0].clientX;
      }

      const distanceX = newX - initialX;
      const percent = (Math.abs(distanceX)) / draggable.offsetWidth;

      // Update the position of .draggable element
      draggable.style.left = `${distanceX + offsetX}px`;
      if (distanceX < 0) {
        movingPoint.style.transform = `translate(${(index + percent) * 200}%, 0)`;
      } else {
        movingPoint.style.transform = `translate(${(index - percent) * 200}%, 0)`;
      }

      // Check if resetting is needed
      if (percent > 0.5) {
        index = checkReset(index, percent, distanceX);
        isMoving = false; // Disable moving when percent > 0.5
      }
    }


    // Function to check if resetting is needed
    function checkReset(index, percent, distanceX) {
      if (percent > 0.5) {
        // Reset if distanceX exceeds half of its own width
        draggable.style.left = `${offsetX}px`;

        if (distanceX < 0) {
          index++;
          if (index >= 2) {
            index = 2;
          }
          checkWeatherData(index);

          movingPoint.style.transform = `translate(${index * 200}%, 0)`;

        }
        else {
          index--;
          if (index <= 0) {
            index = 0;
          }
          checkWeatherData(index);
          movingPoint.style.transform = `translate(${index * 200}%, 0)`;
        }
      }
      return index;
    }

    // Function to check the weather data for the selected city
    async function checkWeatherData(index) {
      console.log(index);
      city = citys[index];
      country = countrys[index];
      getWeather(city, country, apiKey);
    }


    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);

      // Reset .draggable to initial position when mouse is released
      draggable.style.left = `${offsetX}px`;
      movingPoint.style.transform = `translate(${index * 200}%, 0)`; // Reset moving point

    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // function for draggable element end




  // Fetch the weather data for the gived 3 default citys
  const listItems = document.querySelectorAll('.points li');


  listItems.forEach(item => {
    item.addEventListener('click', async function () {
      const city = item.querySelector('.city-name').textContent;
      const country = item.querySelector('.country-name').textContent;

      if (city === 'Beijing') {
        movingPoint.style.transform = 'translate(200%, 0)';
      } else if (city === 'New York') {
        movingPoint.style.transform = 'translate(400%, 0)';
      } else {
        movingPoint.style.transform = 'translate(0, 0)';
      }

      getWeather(city, country, apiKey);
    });
  });

  // button.ok and #check-lock function, start
  const okButton = document.querySelector('.ok');
  const wallpaperWrap = document.querySelector('.wallpaper-wrap');
  const checkLock = document.getElementById('check-lock');
  const carousel = document.querySelector('.carousel');
  const buttonA = document.querySelector('.arrow-up');
  const buttonB = document.querySelector('.arrow-down');
  const totalSlides = document.querySelectorAll('.carousel-item').length;
  const carouselItems = document.querySelectorAll('.carousel-item img');
  const background = document.querySelector('.background');
  const backgroundArray = [];
  const size800Value = 4;

  carouselItems.forEach(item => {
    backgroundArray.push(item.src);
  });

  okButton.addEventListener('click', function () {
    wallpaperWrap.style.display = 'none';
    checkLock.checked = false;

    const selectedImage = backgroundArray[currentSlideIndex];
    background.style.backgroundImage = `linear-gradient(var(--bgc-current), var(--bgc-current)), url('${selectedImage}')`;
  });

  function updateWallpaperWrap() {
    if (checkLock.checked) {
      wallpaperWrap.style.display = 'flex';
    } else {
      wallpaperWrap.style.display = 'none';
    }
  }

  // Initial check when the page loads
  updateWallpaperWrap();

  // Listen for changes on the checkbox
  checkLock.addEventListener('change', function () {
    updateWallpaperWrap();
  });





  // carousel function start

  let currentTranslateY = 0;
  let currentSlideIndex = 0;

  function updateCarousel() {
    carousel.style.transform = `translateY(${currentTranslateY}rem)`;
  }

  function updateButtons() {
    buttonA.disabled = currentSlideIndex === 0;
    buttonB.disabled = currentSlideIndex === totalSlides - 1;
  }

  buttonA.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      currentTranslateY += size800Value;
      updateCarousel();
      updateButtons();
    }
  });

  buttonB.addEventListener('click', () => {
    if (currentSlideIndex < totalSlides - 1) {
      currentSlideIndex++;
      currentTranslateY -= size800Value;
      updateCarousel();
      updateButtons();
    }
  });

  updateButtons();
  // carousel function end
  // button.ok and #check-lock function, end



  // function: convert timestamp to time
  function convertTimestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ":" + minutes;
  }

  // Function: convert time (HH:MM) to total minutes 
  function convertTimeToMinutes(time) {
    var [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }



  // Fetch und update weather data, start
  var cityTimezoneOffsetInHours;
  var sunsetTimestamp;
  var sunriseTimestamp;

  // Fetch weather data for the default city and country

  city = 'Balingen';
  country = 'Germany';
  getWeather(city, country, apiKey);
  setInterval(function () { getWeather(city, country, apiKey) }, 300000);


  // function: update the clock with the current time in city's local time
  function updateClockAndSunPosition(TimezoneOffset, sunsetTimestamp, sunriseTimestamp) {
    // Get the current timestamp in city's local time
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



    // caculate the sun's position on the sunrise-sunset curve during daytime
    // caculate the moon's position on the moonrise-moonset curve during nighttime
    // change the background image to dark-mode during nighttime
    var movingOrbitSun = document.querySelector('.moving-orbit-sun');
    var movingOrbitMoon = document.querySelector('.moving-orbit-moon');
    var currentTimeStamp = Math.floor(Date.now() / 1000) + TimezoneOffset * 3600;
    const currentTime = convertTimestampToTime(currentTimeStamp);
    const sunriseTime = convertTimestampToTime(sunriseTimestamp);
    const sunsetTime = convertTimestampToTime(sunsetTimestamp);

    const sunriseMinutes = convertTimeToMinutes(sunriseTime);
    const sunsetMinutes = convertTimeToMinutes(sunsetTime);
    const currentMinutes = convertTimeToMinutes(currentTime);

    function setCSSVariable(variable, value) {
      document.documentElement.style.setProperty(variable, value);
    }

    if (currentMinutes > sunriseMinutes && currentMinutes < sunsetMinutes) {
      // daytime mode
      var dayTime = (sunsetMinutes - sunriseMinutes) / 60;
      var runningTime = (currentMinutes - sunriseMinutes) / 60;
      var rotationAngle = (runningTime / dayTime) * 180;
      movingOrbitSun.style.transform = 'rotate(' + rotationAngle + 'deg)';
      document.querySelector(".sun-orbit").style.display = 'block';
      document.querySelector('.icons-sun').style.display = 'flex';
      document.querySelector(".moon-orbit").style.display = 'none';
      document.querySelector('.icons-moon').style.display = 'none';
      setCSSVariable('--bgc-current', 'var(--bgc-transparent)');
    }
    else {
      // nighttime mode
      var nightTime = (1440 - (sunsetMinutes - sunriseMinutes)) / 60; // 1440 minutes in a day
      var runningTime = (currentMinutes > sunsetMinutes ? currentMinutes - sunsetMinutes : 1440 + currentMinutes - sunsetMinutes) / 60;
      var rotationAngle = (runningTime / nightTime) * 180;
      movingOrbitMoon.style.transform = 'rotate(' + rotationAngle + 'deg)';
      document.querySelector(".sun-orbit").style.display = 'none';
      document.querySelector('.icons-sun').style.display = 'none';
      document.querySelector(".moon-orbit").style.display = 'block';
      document.querySelector('.icons-moon').style.display = 'flex';
      setCSSVariable('--bgc-current', 'var(--bgc-dark-mode)');
    }


    // Update the date in the .middle-6 class with the current date formatted in German style
    var currentDateTime = new Date(currentTimeStamp * 1000);
    var currentDateFormatted = currentDateTime.toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    document.querySelector('.middle-6').textContent = currentDateFormatted;
  }

  updateClockAndSunPosition(cityTimezoneOffsetInHours, sunsetTimestamp, sunriseTimestamp);
  setInterval(function () { updateClockAndSunPosition(cityTimezoneOffsetInHours, sunsetTimestamp, sunriseTimestamp) }, 1000);


  // function: update the weather data when the form is submitted
  document.getElementById('weather-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    var city = document.getElementById('city').value;
    var country = document.getElementById('country').value;

    document.getElementById('weather-form').style.display = 'none';

    getWeather(city, country, apiKey);

  });

  // add a click event listener to the cancel button
  document.getElementById('cancel-button').addEventListener('click', function () {
    document.getElementById('weather-form').style.display = 'none';
  });

  // add a click event listener to the location icon
  var locationIcon = document.querySelector('.iconfont.icon-location');

  locationIcon.addEventListener('click', function () {
    document.getElementById('weather-form').style.display = 'flex';
    // Clear the input fields
    document.getElementById('city').value = '';
    document.getElementById('country').value = '';
  });

  // function: fetch weather data from OpenWeatherMap API
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
      var sunriseTimestamp = weatherData.sys.sunrise + cityTimezoneOffset;
      var sunsetTimestamp = weatherData.sys.sunset + cityTimezoneOffset;
      const currentTimestamp = weatherData.dt + cityTimezoneOffset;

      var sunriseTime = convertTimestampToTime(sunriseTimestamp);
      var sunsetTime = convertTimestampToTime(sunsetTimestamp);
      var currentTime = convertTimestampToTime(currentTimestamp);

      console.log(sunriseTime, sunsetTime, currentTime);

      // Display current weather information in corresponding HTML elements
      document.getElementById("current-temperature").textContent = temperature + "°C";
      document.getElementById("max-temperature").textContent = maxTemperature + "°C";
      document.getElementById("min-temperature").textContent = minTemperature + "°C";
      document.getElementById("wind-speed").textContent = windSpeedKmh + " km/h";
      document.getElementById("humidity").textContent = humidity + "%";
      document.getElementById("weather-description").textContent = weatherDescription;

      if (currentTimestamp > sunriseTimestamp && currentTimestamp < sunsetTimestamp) {
        document.getElementById("sunrise-time").textContent = sunriseTime;
        document.getElementById("sunset-time").textContent = sunsetTime;
      } else {
        document.getElementById("moonset-time").textContent = sunriseTime;
        document.getElementById("moonrise-time").textContent = sunsetTime;
      }


      // Change the weather image based on the weather description
      if (weatherDescription.includes('rain')) {
        document.getElementById('weather-image').src = "./images/light-rain.svg";
      } else if (weatherDescription.includes('cloud')) {
        document.getElementById('weather-image').src = "./images/cloud.svg";
      } else if (weatherDescription.includes('clear')) {
        document.getElementById('weather-image').src = "./images/clear.svg";
      } else {
        document.getElementById('weather-image').src = "./images/cloud.svg";
      }

      // Return the city timezone offset, sunset and sunrise timestamps
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
  // Fetch und update weather data, end



});
