const lat = document.getElementById("latitude");
const long = document.getElementById("longtitude");
const locationState = document.getElementById("location");
const windSpeed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const timeZone = document.getElementById("time-zone");
const pressure = document.getElementById("pressure");
const windDirection = document.getElementById("wind-direction");
const uvIndex = document.getElementById("uv-index");
const feelsLike = document.getElementById("feels-like");
const loading = document.querySelector(".load-page");
const gmap = document.querySelector(".g-map-spinner");
const apiKey = "ca2a0249ff909610d768dadbddf86808";

const weatherapikey = "7b492a6bf1b548bd970182132240509";
let currLatitude = null;
let currLongtitude = null;

loading.style.display = "flex";

function getLocation() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      currLatitude = position.coords.latitude;
      currLongtitude = position.coords.longitude;
      lat.innerText = `Lat: ${currLatitude}`;
      long.innerText = `Long: ${currLongtitude}`;
      console.log(currLatitude, currLongtitude);

      weatherapi();
      loading.style.display = "none";
      gmap.style.display = "flex";

      const mapIFrame = document.getElementById("google-map");
      mapIFrame.src = `https://maps.google.com/maps?q=${currLatitude}, ${currLongtitude}&z=15&output=embed`;
      mapIFrame.addEventListener("load", () => {
        gmap.style.display = "none";
      });
      mapIFrame.frameBorder = "0";
      mapIFrame.style.border = "0";
    },
    (error) => {
      console.error("Error retrieving location: ", error);
      alert("Unable to retrieve location. Please enable location services.");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

async function weatherapi() {
  try {
    const weatherDataResponse = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${weatherapikey}&q=${currLatitude},${currLongtitude}`
    );
    if (!weatherDataResponse.ok) {
      throw new Error(`HTTP error! Status: ${weatherDataResponse.status}`);
    }

    const weatherData = await weatherDataResponse.json();

    if (!weatherData || !weatherData.location || !weatherData.current) {
      throw new Error("Incomplete weather data received from API");
    }

    locationState.innerText = `Location: ${weatherData.location.region}`;
    windSpeed.innerText = `Wind speed: ${weatherData.current.wind_kph} kmph`;
    humidity.innerText = `Humidity: ${weatherData.current.humidity}`;
    timeZone.innerText = `Time zone: ${weatherData.location.tz_id}`;
    pressure.innerText = `Pressure: ${weatherData.current.pressure_in}`;
    windDirection.innerText = `Wind Direction: ${weatherData.current.wind_dir}`;
    uvIndex.innerText = `UV Index: ${weatherData.current.uv}`;
    feelsLike.innerText = `Feels Like: ${weatherData.current.feelslike_c}°`;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Failed to retrieve weather data. Please try again later.");
  }
}

document.addEventListener("DOMContentLoaded", getLocation);
