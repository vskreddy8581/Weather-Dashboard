const date = document.querySelector(".today-date");
const today = new Date();
date.textContent = today.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
});
function getRainStatus(pop) {
    const chance = pop * 100;
    if (chance === 0) return "No Rain";
    if (chance <= 20) return "Slight Chance of Rain";
    if (chance <= 50) return "Light Rain Expected";
    if (chance <= 80) return "Rain Likely";
    return "Heavy Rain Expected";
}
function getCloudStatus(cloudiness) {
    if (cloudiness <= 10) return "Clear Sky ☀️";
    if (cloudiness <= 30) return "Mostly Clear 🌤️";
    if (cloudiness <= 60) return "Partly Cloudy ⛅";
    if (cloudiness <= 85) return "Mostly Cloudy 🌥️";
    return "Overcast ☁️";
}
function getVisibilityStatus(visibility) {
    const km = visibility / 1000;
    if (km >= 10) return "Clear Visibility";
    if (km >= 7) return "Very Good Visibility";
    if (km >= 5) return "Good Visibility";
    if (km >= 2) return "Moderate Visibility";
    if (km >= 1) return "Poor Visibility";
    return "Very Poor Visibility";
}
function getWeatherSummary(data) {
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].description;
    const humidity = data.main.humidity;
    const wind = (data.wind.speed * 3.6).toFixed(1);
    return `Currently ${condition} with a temperature of ${temp}°C. Humidity is ${humidity}% and winds are blowing at ${wind} km/h.`;
}
const cityInput = document.getElementById("cityInput");
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", async () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  const apiKey = "a04f6e33094ae3c77e88fddb8b8202a9";
  const url1 = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const url2 = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [res1, res2] = await Promise.all([
      fetch(url1),
      fetch(url2)
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();

    if (data1.cod != 200) {
      alert("City not found");
      return;
    }
    if (data2.cod != 200) {
      alert("City not found");
      return;
    }
    document.getElementById("cityName").innerText = data1.name;
    document.getElementById("countryName").innerText = data1.sys.country;
    document.getElementById("weatherCondition").innerText = data1.weather[0].main;
    document.getElementById("temperature").innerText = Math.round(data1.main.temp);
    document.getElementById("feelsLike").innerText = `Feels Like ${Math.round(data1.main.feels_like)}°C`;
    document.getElementById("maxTemp").innerText = `${Math.round(data1.main.temp_max)}°C`;
    document.getElementById("minTemp").innerText = `${Math.round(data1.main.temp_min)}°C`;
    document.getElementById("humidity").innerText = data1.main.humidity + "%";
    document.getElementById("wind").innerText = (data1.wind.speed * 3.6).toFixed(0) + " km/h";
    document.getElementById("rain").innerText = `${Math.round(data2.list[0].pop * 100)}%`;
    document.getElementById("rainstatus").innerText = `${getRainStatus(data2.list[0].pop)}`;

    //sunrise and sunset

    const sunrise = new Date(data1.sys.sunrise * 1000);
    const sunset = new Date(data1.sys.sunset * 1000);
    document.getElementById("sunrise").innerText =
      sunrise.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    document.getElementById("sunset").innerText =
      sunset.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    document.getElementById("pressure").innerText = data1.main.pressure + "hPa";
    document.getElementById("visibility").innerText = `${Math.round(data1.visibility / 1000)}` + "km";
    document.getElementById("visibilitystatus").innerText = `${getVisibilityStatus(data1.visibility)}`
    document.getElementById("clouds").innerText = data1.clouds.all + "%"
    document.getElementById("cloudStatus").innerText = getCloudStatus(data1.clouds.all)
    document.getElementById("weatherSummary").textContent =getWeatherSummary(data1);
  } catch (error) {
    console.log(error);
    alert("Something went wrong.");

  }

});
