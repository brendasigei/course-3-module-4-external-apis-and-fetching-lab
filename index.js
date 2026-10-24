// Select DOM elements
const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");
const loading = document.getElementById("loading");

// Fetch weather alerts for a state from the National Weather Service API
function fetchWeatherAlerts(state) {
  showLoading();

  return fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      clearError();
      displayAlerts(data);
      return data;
    })
    .catch((error) => {
      console.log(error.message);
      alertsDisplay.innerHTML = ""; // don't leave stale results next to an error
      showError(error.message);
    })
    .finally(() => {
      hideLoading();
    });
}

// Update the DOM with the summary and the list of headlines
function displayAlerts(data) {
  alertsDisplay.innerHTML = "";

  const summary = document.createElement("p");
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  const list = document.createElement("ul");
  data.features.forEach((alert) => {
    const item = document.createElement("li");
    item.textContent = alert.properties.headline;
    list.appendChild(item);
  });
  alertsDisplay.appendChild(list);
}

// Error helpers (styled through the "error" class)
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("error");
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.remove("error");
  errorMessage.classList.add("hidden");
}

// Loading helpers (also disable the button so users can't double-submit)
function showLoading() {
  loading.classList.remove("hidden");
  fetchButton.disabled = true;
}

function hideLoading() {
  loading.classList.add("hidden");
  fetchButton.disabled = false;
}

// Input validation: exactly two capital letters
function isValidState(state) {
  return /^[A-Z]{2}$/.test(state);
}

// Call it when the button is clicked
fetchButton.addEventListener("click", () => {
  const state = stateInput.value.trim().toUpperCase();

  // Clear the input field after reading it
  stateInput.value = "";

  if (!state) {
    showError("Please enter a state abbreviation.");
    return;
  }

  if (!isValidState(state)) {
    showError("Invalid input. Please enter exactly two letters (e.g. CA).");
    return;
  }

  fetchWeatherAlerts(state);
});