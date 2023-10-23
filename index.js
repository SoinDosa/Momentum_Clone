const imageURL = "https://picsum.photos/1280/720";
const key = "YOUR KEY!"

async function setRenderBackground() {
    const result = await axios.get(imageURL, { responseType: "blob" });

    const domURL = URL.createObjectURL(result.data);
    const body = document.querySelector("body");
    body.style.backgroundImage = `url(${domURL})`;
}

function setTime() {
    const timer = document.querySelector(".timer");
    setInterval(() => {
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        if (hours < 10) {
            hours = "0" + hours;
        }

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        timer.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function setMemo() {
    memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", (e) => {
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value);
            getMemo();
            memoInput.value = "";
        }
    })
}

function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

function deleteMemo() {
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("memo")) {
            localStorage.removeItem("todo");
            e.target.textContent = "";
        }
    })
}

function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

async function renderWeather() {
    try {
        const position = await getPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const weatherResponse = await getWeather(latitude, longitude);
        const weatherData = weatherResponse.data;
        const weatherList = weatherData.list.reduce((acc, cur) => {
            if (cur.dt_txt.indexOf("18:00:00") > 0) {
                acc.push(cur);
            }
            return acc;
        }, []);
        console.log(weatherList);
    
        const modalBody = document.querySelector(".modal-body");
        modalBody.innerHTML = weatherList.map(e => weatherWrapperComponent(e).join(""));
    }
    catch(error) {
        alert(error);
    }
}

async function getWeather(latitude, longitude) {
    if (latitude && longitude) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`);
        return data;
    }
    const data = await axios.get(`api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=${key}&units=metric`)
    return data;
}

function weatherWrapperComponent(e) {
    console.log(e);
    return `
    <div class="card bg-transparent text-white flex-grow-1 m-2">
        <div class="card-header text-center">
            ${e.dt_txt.split(" ")[0]}
        </div>
        <div class="card-body d-flex">
            <div class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                <h5 class="card-title">${e.weather[0].main}</h5>
                <img class="weather-img" src="${matchIcon(e.weather[0].main)}">
                <p class="card-text">${e.main.temp}℃</p>
            </div>
        </div>
    </div>`
}

function matchIcon(weahterData) {
    if (weahterData == "Clear") {
        return "./images/039-sun.png";
    }
    if (weahterData == "Clouds") {
        return "./images/001-cloud.png";
    }
    if (weahterData == "Rain") {
        return "./images/003-rainy.png";
    }
    if (weahterData == "Snow") {
        return "./images/006-snowy.png";
    }
    if (weahterData == "Thunderstorm") {
        return "./images/008-storm.png";
    }
    if (weahterData == "Drizzle") {
        return "./images/031-snowflake.png";
    }
    if (weahterData == "Atmosphere") {
        return "./images/033-hurricane.png";
    }
}

(function () {
    setRenderBackground();
    setTime();
    setMemo();
    getMemo();
    deleteMemo();
    renderWeather();

    setInterval(() => {
        setRenderBackground()
    }, 5000);
})();
// 즉시 실행 함수(IIFE)