// ==========================================
// ELEMENTS
// ==========================================

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const locationBtn =
    document.getElementById("locationBtn");

const loading =
    document.getElementById("loading");

const errorBox =
    document.getElementById("errorBox");

const errorText =
    document.getElementById("errorText");

const weatherContainer =
    document.getElementById("weatherContainer");


// ==========================================
// WEATHER CODES
// ==========================================

function getWeatherInfo(code) {

    const weather = {

        0: {
            description: "Clear Sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Fog",
            icon: "🌫️"
        },

        48: {
            description: "Rime Fog",
            icon: "🌫️"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Heavy Drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Light Rain",
            icon: "🌦️"
        },

        63: {
            description: "Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            description: "Light Snow",
            icon: "🌨️"
        },

        73: {
            description: "Snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            description: "Rain Showers",
            icon: "🌦️"
        },

        81: {
            description: "Rain Showers",
            icon: "🌧️"
        },

        82: {
            description: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm + Hail",
            icon: "⛈️"
        },

        99: {
            description: "Heavy Thunderstorm",
            icon: "⛈️"
        }

    };


    return weather[code] || {

        description: "Unknown Weather",

        icon: "🌡️"

    };

}


// ==========================================
// SHOW LOADING
// ==========================================

function showLoading() {

    loading.style.display = "flex";

    errorBox.style.display = "none";

}


// ==========================================
// HIDE LOADING
// ==========================================

function hideLoading() {

    loading.style.display = "none";

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    hideLoading();

    errorText.textContent = message;

    errorBox.style.display = "block";

    weatherContainer.style.display = "none";

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(time) {

    const date = new Date(time);

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ==========================================
// FORMAT DAY
// ==========================================

function formatDay(date) {

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );

}


// ==========================================
// GET WEATHER
// ==========================================

async function getWeather(
    latitude,
    longitude,
    city = "Your Location",
    country = ""
) {

    try {

        showLoading();


        /*
         Open-Meteo Forecast API

         Current weather:
         temperature
         humidity
         apparent temperature
         precipitation
         weather code
         wind speed
         cloud cover

         Daily:
         maximum/minimum temperature
         sunrise
         sunset
        */

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset` +
            `&timezone=auto` +
            `&forecast_days=5`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch weather data."
            );

        }


        const data =
            await response.json();


        displayWeather(
            data,
            city,
            country
        );


        hideLoading();


        weatherContainer.style.display =
            "block";


        errorBox.style.display =
            "none";


    }

    catch (error) {

        console.error(error);

        showError(
            "Unable to load weather. Please check your internet connection and try again."
        );

    }

}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(
    data,
    city,
    country
) {

    const current =
        data.current;


    const daily =
        data.daily;


    // --------------------------------------
    // Location
    // --------------------------------------

    document.getElementById(
        "cityName"
    ).textContent = city;


    document.getElementById(
        "countryName"
    ).textContent = country;


    // --------------------------------------
    // Weather information
    // --------------------------------------

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    document.getElementById(
        "weatherIcon"
    ).textContent =
        weatherInfo.icon;


    document.getElementById(
        "weatherDescription"
    ).textContent =
        weatherInfo.description;


    document.getElementById(
        "temperature"
    ).textContent =
        Math.round(
            current.temperature_2m
        ) + "°";


    document.getElementById(
        "feelsLike"
    ).textContent =
        Math.round(
            current.apparent_temperature
        ) + "°";


    // --------------------------------------
    // Details
    // --------------------------------------

    document.getElementById(
        "humidity"
    ).textContent =
        current.relative_humidity_2m + "%";


    document.getElementById(
        "wind"
    ).textContent =
        Math.round(
            current.wind_speed_10m
        ) + " km/h";


    document.getElementById(
        "precipitation"
    ).textContent =
        current.precipitation + " mm";


    document.getElementById(
        "cloud"
    ).textContent =
        current.cloud_cover + "%";


    // --------------------------------------
    // Sunrise / Sunset
    // --------------------------------------

    document.getElementById(
        "sunrise"
    ).textContent =
        formatTime(
            daily.sunrise[0]
        );


    document.getElementById(
        "sunset"
    ).textContent =
        formatTime(
            daily.sunset[0]
        );


    // --------------------------------------
    // Forecast
    // --------------------------------------

    const forecastContainer =
        document.getElementById(
            "forecast"
        );


    forecastContainer.innerHTML = "";


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const forecastWeather =
            getWeatherInfo(
                daily.weather_code[i]
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <div class="forecast-day">

                ${i === 0
                    ? "Today"
                    : formatDay(
                        daily.time[i]
                    )
                }

            </div>


            <div class="forecast-icon">

                ${forecastWeather.icon}

            </div>


            <div class="forecast-temp">

                ${Math.round(
                    daily.temperature_2m_max[i]
                )}°

            </div>


            <div class="forecast-low">

                ${Math.round(
                    daily.temperature_2m_min[i]
                )}°

            </div>

        `;


        forecastContainer.appendChild(
            card
        );

    }

}


// ==========================================
// SEARCH CITY
// ==========================================

async function searchCity() {

    const city =
        cityInput.value.trim();


    if (!city) {

        showError(
            "Please enter a city name."
        );

        return;

    }


    try {

        showLoading();


        /*
         Open-Meteo Geocoding API
         converts city name -> latitude/longitude
        */

        const url =
            `https://geocoding-api.open-meteo.com/v1/search` +
            `?name=${encodeURIComponent(city)}` +
            `&count=1` +
            `&language=en` +
            `&format=json`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Location search failed."
            );

        }


        const data =
            await response.json();


        if (
            !data.results ||
            data.results.length === 0
        ) {

            showError(
                "City not found. Please enter a valid city name."
            );

            return;

        }


        const location =
            data.results[0];


        await getWeather(

            location.latitude,

            location.longitude,

            location.name,

            location.country

        );

    }

    catch (error) {

        console.error(error);

        showError(
            "Could not find this location."
        );

    }

}


// ==========================================
// CURRENT LOCATION
// ==========================================

function getCurrentLocation() {

    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;

    }


    showLoading();


    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            try {

                /*
                 Reverse geocoding using
                 Open-Meteo search is not ideal,
                 so weather is displayed using
                 coordinates when location name
                 isn't available.
                */

                await getWeather(

                    latitude,

                    longitude,

                    "Your Location",

                    "Current Position"

                );

            }

            catch (error) {

                showError(
                    "Unable to get weather for your location."
                );

            }

        },


        function (error) {

            hideLoading();


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                showError(
                    "Location permission was denied. Please allow location access."
                );

            }

            else {

                showError(
                    "Unable to access your location."
                );

            }

        }

    );

}


// ==========================================
// EVENTS
// ==========================================

searchBtn.addEventListener(
    "click",
    searchCity
);


locationBtn.addEventListener(
    "click",
    getCurrentLocation
);


// Search using ENTER

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            searchCity();

        }

    }
);


// ==========================================
// DEFAULT WEATHER
// ==========================================

// Default location: Dehradun

getWeather(

    30.3165,

    78.0322,

    "Dehradun",

    "India"

);