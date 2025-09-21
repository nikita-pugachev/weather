const cityName = document.querySelector('.city');
const dateNow = document.querySelector('.date');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.description');
const weatherIcon = document.querySelector('.weather-image');
const windSpeed = document.querySelector('.wind-speed');
const humidityPercent = document.querySelector('.humidity-percent');
const pressureValue = document.querySelector('.pressure-bar');
const cityNameInput = document.querySelector('.search-form__textfield');

const weatherCodeDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm"
};

export function getWeatherIconPath(code) {
    if ([0, 1].includes(code)) return 'svg/Sunny.svg';
    if ([2, 3].includes(code)) return 'svg/Cloudy.svg';
    if ([45, 48].includes(code)) return 'svg/Fog.svg';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'svg/Rain.svg';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'svg/Snow.svg';
    if ([95, 96, 99].includes(code)) return 'svg/surface1.svg';
}

export async function getWeather() {
    let latitude = 52.52;
    let longitude = 13.41;

    const city = cityNameInput.value.trim();

    if (city) {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
            latitude = geoData.results[0].latitude;
            longitude = geoData.results[0].longitude;
            cityName.textContent = geoData.results[0].name;
        } else {
            throw new Error("Город не найден");
        }
    }

    const api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability,surface_pressure,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max&timezone=auto`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            dateNow.textContent = data.current_weather.time.split('T')[0];
            temperature.textContent = `${data.current_weather.temperature}°C`
            const code = data.current_weather.weathercode;
            weatherDescription.textContent = weatherCodeDescriptions[code] || "Unknown";
            windSpeed.textContent = `${Math.round(data.current_weather.windspeed / 3.6)} m/s`;
            humidityPercent.textContent = `${data.daily.precipitation_probability_max[0]}%`;
            pressureValue.textContent = `${Math.round(data.hourly.surface_pressure[0] * 0.75006375541921)}`;

            const mainCode = data.current_weather.weathercode;
            weatherIcon.src = getWeatherIconPath(mainCode);

            const weatherListItems = document.querySelectorAll('.weather-list-item');
            const dailyDates = data.daily.time;
            const dailyTemps = data.daily.temperature_2m_max;
            const dailyCodes = data.daily.weathercode; // добавлено получение кодов

            weatherListItems.forEach((item, i) => {
                const dayIndex = i + 1;
                if (
                    dailyDates[dayIndex] &&
                    dailyTemps[dayIndex] !== undefined &&
                    dailyCodes[dayIndex] !== undefined
                ) {
                    const titleDay = item.querySelector('.title-day');
                    const temperatureDay = item.querySelector('.temperature-day');
                    const imageDay = item.querySelector('.weather-image-list'); // исправлено получение img

                    titleDay.textContent = dailyDates[dayIndex];
                    temperatureDay.textContent = `${Math.round(dailyTemps[dayIndex])}°C`;
                    imageDay.src = getWeatherIconPath(dailyCodes[dayIndex]); // добавлено изменение src
                    imageDay.alt = weatherCodeDescriptions[dailyCodes[dayIndex]] || "weather icon"; // для доступности
                }
            });
        })
        .catch((err) => {
            throw err;
        });
}
