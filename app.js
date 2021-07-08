let container = document.getElementById('container');
let searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
let timeEl = document.getElementById('time');
let dayEl = document.getElementById('day');
let locationEl = document.getElementById('location');
let descriptionEl = document.getElementById('description');
let tempEl = document.getElementById('temp');
let iconEl = document.getElementById('icon');

// Set time and date
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
  let d = new Date();
  let hour = d.getHours();
  let minute = d.getMinutes();
  let ampm = hour >=12 ? 'PM' : 'AM';
  let hourFormat = hour >=13 ? hour %12 : hour;
  let day = d.getDay();
  let date = d.getDate();
  let month = d.getMonth();

  timeEl.innerHTML = (hour < 10 ? '0'+hour : hour) + ':' + (minute < 10 ? '0'+minute : minute) + `<span id="am-pm">${ampm}</span>`;
  dayEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000);


const API_KEY = 'cfcb7de2195d7a5a1b158f6560eaf532';

// use search bar
searchBtn.addEventListener('click', (e)=> {
  e.preventDefault();
  getWeather(searchInput.value);
  searchInput.value='';
});

const getWeather=async (city)=> {
  try {
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

    const weatherData= await response.json();

    console.log(weatherData);
    let {humidity, pressure} = weatherData.main;
    let {sunrise, sunset} = weatherData.sys;

    descriptionEl.innerHTML = weatherData.weather[0].description;

    tempEl.innerHTML = Math.round(weatherData.main.temp) + '°' + `<span id="deg">C</span>`;

    extraDetails.innerHTML = 
    `
    <p id="humidity">Humidity:&nbsp;<span>${humidity}%</span></p>
    <p id="pressure">Pressure:&nbsp;<span>${pressure}</span></p>
    <p id="sunrise">Sunrise:&nbsp;<span>${window.moment(sunrise*1000).format('HH:mm a')}</span></p>
    <p id="sunset">Sunset:&nbsp;<span>${window.moment(sunset*1000).format('HH:mm a')}</span></p>
    `;

    locationEl.innerHTML = weatherData.name + ', ' + weatherData.sys.country;

    // Set location and add icons and background

    let latitude = coord.lat;
    let longitude = coord.lon;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {

        // console.log(data)
        showLocationData(data);
      });

  }
  catch(error)
  {
      return 'city not found';
  }
}


// Get location
// getLocation();
window.addEventListener("load", () => {

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition((position) => {

      let {latitude, longitude} = position.coords;

      // Get weather details
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,daily&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {

        // console.log(data)
        showWeatherData(data);
      });

      // Set location and add icons and background
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`).then(res => res.json()).then(data => {

        // console.log(data)
        showLocationData(data);
      });

      
    });

  } else {
    alert('Location is not supported by your browser.');
  }
})

let extraDetails = document.getElementById('extra-details');

function showWeatherData(data) {
  let {humidity, pressure, sunrise, sunset} = data.current;
  // let 

  descriptionEl.innerHTML = data.current.weather[0].description;

  tempEl.innerHTML = Math.round(data.current.temp) + '°' + `<span id="deg">C</span>`;

  extraDetails.innerHTML = 
  `
  <p id="humidity">Humidity:&nbsp;<span>${humidity}%</span></p>
  <p id="pressure">Pressure:&nbsp;<span>${pressure}</span></p>
  <p id="sunrise">Sunrise:&nbsp;<span>${window.moment(sunrise*1000).format('HH:mm a')}</span></p>
  <p id="sunset">Sunset:&nbsp;<span>${window.moment(sunset*1000).format('HH:mm a')}</span></p>
  `;

  locationEl.innerHTML = data.timezone;

}

function showLocationData(data) {

  let id = data.weather[0].id;

  if(id <300 && id >=200) {
    iconEl.src = "./svg/thunderstorm.svg"
    container.style.backgroundImage = `url('./img/rain.jpg')`
  } else if(id <400 && id >=300) {
    iconEl.src = "./svg/drizzle.svg"
    container.style.backgroundImage = `url('./img/rain.jpg')`
  } else if(id <600 && id >=500) {
    iconEl.src = "./svg/rain.svg"
    container.style.backgroundImage = `url('./img/rain.jpg')`
  } else if(id <700 && id >=600) {
    iconEl.src = "./svg/snowing.svg"
    container.style.backgroundImage = `url('./img/snow.jpg')`
  } else if(id <800 && id >=700) {
    iconEl.src = "./svg/mist.svg"
    container.style.backgroundImage = `url('./img/mist.jpg')`
  } else if(id == 800) {
    iconEl.src = "./svg/clear.svg"
    container.style.backgroundImage = `url('./img/weather.jpg')`
  } else if(id >800) {
    iconEl.src = "./svg/clouds.svg"
    container.style.backgroundImage = `url('./img/clouds.jpg')`
  }
}