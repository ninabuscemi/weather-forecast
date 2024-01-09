const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const stateInput = document.getElementById('state-input');
const currentWeatherContainer = document.getElementById('current-weather-container');
const forecastContainer = document.getElementById('forecast-container');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;
  const state = stateInput.value;
  getWeatherData(city, state);
  cityInput.value = '';
  stateInput.value = '';
});

function getWeatherData(city, state) {
  const apiKey = '14ec03d561bda5cbf662d09c82f23b1e'; // Replace with your actual API key

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
  const capitalizedState = state ? state.charAt(0).toUpperCase() + state.slice(1) : '';

  const formattedLocation = capitalizedState ? `${capitalizedCity}, ${capitalizedState}` : capitalizedCity;

  // Make API calls to retrieve current weather and forecast data for the given city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Update the currentWeatherContainer with the retrieved data
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      currentWeatherContainer.innerHTML = `
        <h2>${formattedLocation}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
    });

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${state}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Update the forecastContainer with the retrieved data
      forecastContainer.innerHTML = '';

      const forecasts = data.list;

      // Filter forecasts for every 24 hours for the next 5 days
      const filteredForecasts = forecasts.filter((forecast, index) => index % 8 === 0 && index < 40);

      for (const forecast of filteredForecasts) {
        const date = new Date(forecast.dt * 1000); // Convert timestamp to milliseconds
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