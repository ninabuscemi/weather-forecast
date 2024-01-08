// script.js

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const currentWeatherContainer = document.getElementById('current-weather-container');
const forecastContainer = document.getElementById('forecast-container');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = searchInput.value;
  getWeatherData(city);
  searchInput.value = '';
});

function getWeatherData(city) {
  // Make an API call to retrieve weather data for the given city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=14ec03d561bda5cbf662d09c82f23b1e
  `)
    .then(response => response.json())
    .then(data => {
      // Update the currentWeatherContainer with the retrieved data
      currentWeatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Make another API call to retrieve forecast data for the given city
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=14ec03d561bda5cbf662d09c82f23b1e
  `)
    .then(response => response.json())
    .then(data => {
      // Update the forecastContainer with the retrieved data
      forecastContainer.innerHTML = '';

      for (let i = 0; i < data.list.length; i++) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000);
        const temperature = forecast.main.temp;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;

        forecastContainer.innerHTML += `
          <div class="forecast-item">
            <h3>${date.toLocaleDateString()}</h3>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
          </div>
        `;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}