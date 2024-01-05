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
  // Update the currentWeatherContainer and forecastContainer with the retrieved data
}