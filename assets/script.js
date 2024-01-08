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
  fetch(`https://api.tomorrow.io/v4/timelines?location=${city}&fields=temperature_2m,humidity_2m,windspeed_10m&apikey=xw91YMX9d3ni9Uqdi3TaPGyIATNGZwsg`)
    .then(response => response.json())
    .then(data => {
      // Update the currentWeatherContainer with the retrieved data
      const timeline = data.data.timelines[0];
      const temperature = timeline.intervals[0].values.temperature_2m;
      const humidity = timeline.intervals[0].values.humidity_2m;
      const windSpeed = timeline.intervals[0].values.windspeed_10m;

      currentWeatherContainer.innerHTML = `
        <h2>${city}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // Make another API call to retrieve forecast data for the given city
  fetch(`https://api.tomorrow.io/v4/timelines?location=${city}&fields=temperature_2m,humidity_2m,windspeed_10m&apikey=xw91YMX9d3ni9Uqdi3TaPGyIATNGZwsg`)
    .then(response => response.json())
    .then(data => {
      // Update the forecastContainer with the retrieved data
      forecastContainer.innerHTML = '';

      const timeline = data.data.timelines[0];
      const intervals = timeline.intervals;

      for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        const date = new Date(interval.startTime);
        const temperature = interval.values.temperature_2m;
        const humidity = interval.values.humidity_2m;
        const windSpeed = interval.values.windspeed_10m;

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