const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const stateInput = document.getElementById('state-input');
const currentWeatherContainer = document.getElementById('current-weather-container');
const forecastContainer = document.getElementById('forecast-container');
const searchHistoryContainer = document.getElementById('search-history-container');

// Loads search history from local storage on page load
const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Displays search history on page load
displaySearchHistory();

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  const state = stateInput.value.trim();

  // Validates city and state inputs
  if (!city || !state) {
    alert('Please enter both city and state.');
    return;
  }

  getWeatherData(city, state);

  // Adds search entry to search history
  addToSearchHistory(city, state);

  // Clears input fields after successful submission
  cityInput.value = '';
  stateInput.value = '';
});

function addToSearchHistory(city, state) {
  const entry = { city, state };

  // Adds entry to search history
  searchHistory.push(entry);

  // Saves search history to local storage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Displays updated search history
  displaySearchHistory();
}

function removeFromSearchHistory(index) {
  // Removes entry at the specified index
  searchHistory.splice(index, 1);

  // Saves search history to local storage
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // Displays updated search history
  displaySearchHistory();
}

function displaySearchHistory() {
  // Clears existing search history
  searchHistoryContainer.innerHTML = '';

  // Displays each search history entry horizontally
  searchHistory.forEach((entry, index) => {
    const entryElement = document.createElement('div');
    entryElement.classList.add('search-history-entry');
    entryElement.textContent = `${entry.city}, ${entry.state}`;

    // Adds click event listener to each entry
    entryElement.addEventListener('click', () => {
      getWeatherData(entry.city, entry.state);
    });

    // Adds close icon to each entry
    const closeIcon = document.createElement('span');
    closeIcon.classList.add('close-icon');
    closeIcon.textContent = '✖'; // You can customize the close icon
    closeIcon.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the entry click event from triggering
      removeFromSearchHistory(index);
    });

    entryElement.appendChild(closeIcon);
    searchHistoryContainer.appendChild(entryElement);
  });
}

function getWeatherData(city, state) {
  const apiKey = '14ec03d561bda5cbf662d09c82f23b1e';

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
  const capitalizedState = state ? state.charAt(0).toUpperCase() + state.slice(1) : '';

  const formattedLocation = capitalizedState ? `${capitalizedCity}, ${capitalizedState}` : capitalizedCity;

  // Makes API calls to retrieve current weather and forecast data for the given city
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      // Updates the currentWeatherContainer with the retrieved data
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
      // Updates the forecastContainer with the retrieved data
      forecastContainer.innerHTML = '';

      const forecasts = data.list;

      // Filters forecasts for every 24 hours for the next 5 days
      const filteredForecasts = forecasts.filter((forecast, index) => index % 8 === 0 && index < 40);

      for (const forecast of filteredForecasts) {
        const date = new Date(forecast.dt * 1000); // Converts timestamp to milliseconds
        const temperature = forecast.main.temp;
        const humidity = forecast.main.humidity;
        const windSpeed = forecast.wind.speed;
        const weatherIcon = forecast.weather[0].icon; // Gets the weather icon code

        forecastContainer.innerHTML += `
          <div class="forecast-item">
            <h3>${date.toLocaleDateString()}</h3>
            <p>Temperature: ${temperature}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
          </div>
        `;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}