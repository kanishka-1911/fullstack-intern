const apiKey = '394c9628983e64b5530b10f6122125d0'; 

$(document).ready(function () {
    
    $('#themeToggle').click(function () {
        $('body').toggleClass('dark-theme');
    });

   
    $('#searchBtn').click(function () {
        const city = $('#cityInput').val().trim();
        if (city) {
            fetchWeather(city);
        } else {
            alert('Please enter a valid city name.');
        }
    });

   
    function fetchWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`City not found (status: ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data);
                fetchHourlyForecast(data.coord.lat, data.coord.lon);
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
                alert('Could not fetch weather data. Please check the city name or try again later.');
            });
    }

    
    function updateWeatherUI(data) {
        $('#cityName').text(data.name);
        $('#description').text(data.weather[0].description);
        $('#temperature').text(data.main.temp);
        $('#humidity').text(data.main.humidity);
        $('#wind').text(data.wind.speed);
    }

    
    function fetchHourlyForecast(lat, lon) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const labels = data.list.slice(0, 8).map(item => item.dt_txt.split(' ')[1]); // Next 8 hours
                const temps = data.list.slice(0, 8).map(item => item.main.temp);
                renderForecastChart(labels, temps);
            })
            .catch(error => {
                console.error('Error fetching forecast:', error);
                alert('Could not fetch forecast data.');
            });
    }

    
    function renderForecastChart(labels, temps) {
        const ctx = $('#forecastChart')[0].getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

  
    let isCelsius = true;
    $('#unitToggle').click(function () {
        const currentTemp = parseFloat($('#temperature').text());
        if (isCelsius) {
            const fahrenheit = (currentTemp * 9/5) + 32;
            $('#temperature').text(fahrenheit.toFixed(2));
            $('#unit').text('F');
        } else {
            const celsius = (currentTemp - 32) * 5/9;
            $('#temperature').text(celsius.toFixed(2));
            $('#unit').text('C');
        }
        isCelsius = !isCelsius;
    });

   
    fetchWeather('Salem');
});