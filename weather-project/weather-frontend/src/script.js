const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDiv = document.getElementById("weather");
const body = document.body;

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) return alert("Please enter a city!");

    fetch(`http://192.168.107.196:5000/api/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                weatherDiv.innerHTML = `Error: ${data.error.message || data.error}`;
                return;
            }

            const cityName = data.city;
            const country = data.country;
            const current = data.current;
            const temp = current.main.temp.toFixed(1);
            const desc = current.weather[0].description;
            const icon = current.weather[0].icon;
            const mainWeather = current.weather[0].main.toLowerCase();

            // تغيير الخلفية حسب حالة الطقس
            if (mainWeather.includes("clear")) {
                body.style.background = "linear-gradient(to top, #fceabb, #f8b500)";
            } else if (mainWeather.includes("cloud")) {
                body.style.background = "linear-gradient(to top, #bdc3c7, #2c3e50)";
            } else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
                body.style.background = "linear-gradient(to top, #4e54c8, #8f94fb)";
            } else if (mainWeather.includes("snow")) {
                body.style.background = "linear-gradient(to top, #e6e9f0, #eef1f5)";
            } else if (mainWeather.includes("thunderstorm")) {
                body.style.background = "linear-gradient(to top, #0f2027, #203a43, #2c5364)";
            } else {
                body.style.background = "linear-gradient(to top, #2980b9, #6dd5fa)";
            }

            // Forecast
            let forecastHTML = "";
            data.forecast.list.slice(0, 16).forEach(item => {
                const dt = new Date(item.dt * 1000);
                const day = dt.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
                const hours = dt.getHours().toString().padStart(2, '0');
                const tempF = item.main.temp.toFixed(1);
                const iconF = item.weather[0].icon;

                forecastHTML += `
                    <div class="forecast-item">
                        <div class="forecast-date">${day} ${hours}:00</div>
                        <img src="https://openweathermap.org/img/wn/${iconF}@2x.png" alt="${item.weather[0].description}">
                        <div class="forecast-temp">${tempF}°C</div>
                        <div class="forecast-desc">${item.weather[0].description}</div>
                    </div>
                `;
            });

            weatherDiv.innerHTML = `
                <h2>${cityName}, ${country}</h2>
                <div class="current-weather">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
                    <div class="current-temp">${temp}°C</div>
                    <div class="current-desc">${desc}</div>
                </div>
                <div class="forecast">
                    ${forecastHTML}
                </div>
            `;
        })
        .catch(err => {
            weatherDiv.innerHTML = `Error fetching weather`;
            console.error(err);
        });
});
