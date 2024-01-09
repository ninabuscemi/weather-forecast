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
  const apiKey = '14ec03d561bda5cbf662d09c82f23b1e'; // Replace with your actual API key

  const [cityPart, statePart] = city.split(',').map(part => part.trim());
  const capitalizedCity = cityPart.charAt(0).toUpperCase() + cityPart.slice(1);
  const capitalizedState = statePart ? statePart.charAt(0).toUpperCase() + statePart.slice(1) : '';
  const formattedLocation = capitalizedState ? `${capitalizedCity}, ${capitalizedState}` : capitalizedCity;

  // Make an API call to retrieve current weather data for the given city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
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

  // Make another API call to retrieve forecast data for the given city
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
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