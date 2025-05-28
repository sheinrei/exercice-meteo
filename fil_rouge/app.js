const key = "c8a4e675fa901dc728e553a943ff7d88";
let city_array = ["London", "Paris", "Toulouse"];


JSON.stringify(city_array)
localStorage.setItem("city", city_array)

async function geocoding(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${key}`

    const response = await fetch(url);
    const data = await response.json();

    const lon = data[0].lon;
    const lat = data[0].lat;
    return { lon, lat }
}

async function meteoData(emplacement) {
    const coord = await geocoding(emplacement)

    const lon = coord.lon;
    const lat = coord.lat;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

    const response = await fetch(url);
    const data = await response.json();

    const temp_min = convertCelsus(data.main.temp_min)
    const temp_max = convertCelsus(data.main.temp_max)
    const humidity = data.main.humidity + "%";
    const weather = data.weather[0].description;


    const cached_data = {
        temp_min,
        temp_max,
        humidity,
        weather
    }
    return cached_data
}

async function setDom() {

    for (i = 0; i < city_array.length; i++) {

        const data_city = await meteoData(city_array[i])

        const t_min = data_city.temp_min;
        const t_max = data_city.temp_max;
        const weather = data_city.weather;
        const humidity = data_city.humidity;

        const create_html = document.createElement("div");
        create_html.className = "container_meteo";

        create_html.innerHTML = `
        <div class="container_meteo_city">   

            <div id="name_city_${i}" class="name_city">${city_array[i]}</div>
            
            <div class="meteo_city">
                <div class="container_temperature">
                    <p id="temperature_min_city_${i}">Minimum : ${t_min}</p>
                    <p id="temperature_max_city_${i}" class="temperature_max_city">Maximum : ${t_max}</p>
                </div>

                <div class="container_weather">
                    <p id="weather_description_city_${i}">${weather}</p>
                    <p id="humidity_city_${i}">Humidité : ${humidity}</p>
                </div>
                
            </div>
        </div>`

        let element = document.getElementById("container_meteo_city");

        element.parentNode.append(create_html);
       

    }
}


const submit = document.getElementById("submit");
const input_city = document.getElementById("input_city");

submit.addEventListener("click",async function(){
    // desinguer tout le dom en suprimant -> add le tableau de l'input -> repasser le setDom()
    city_array.unshift(input_city.value);
    localStorage.setItem("city", JSON.stringify(city_array))
      
})

const convertCelsus = (number) => (number - 273).toFixed(1) + "°C"



// Init function
setDom()