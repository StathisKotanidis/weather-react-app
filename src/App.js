import { useEffect } from "react";
import "./App.css";
import { useState } from "react";

const apiKey = "20ff8e16ee4a79b95bc295e19a5bf2d1";

const weatherBackgrounds = {
  Ash: "/assets/clear.gif",
  Clear: "/assets/clear.gif",
  Clouds: "/assets/clouds.gif",
  Drizzle: "/assets/drizzle.gif",
  Fog: "/assets/fog.gif",
  Haze: "/assets/haze.gif",
  Humidity: "/assets/humidity.gif",
  Mist: "/assets/mist.gif",
  Rain: "/assets/rain.gif",
  Sand: "/assets/sand-dust.gif",
  Dust: "/assets/sand-dust.gif",
  Smoke: "/assets/smoke.gif",
  Snow: "/assets/snow.gif",
  Squall: "/assets/squall.gif",
  Tornado: "/assets/tornado.gif",
  Thunderstorm: "/assets/thunderstorm.gif",
};

export default function App() {
  const [toggleUi, setToggleUi] = useState(false);
  const [cityName, setCityName] = useState("");
  const [enableApi, setEnableApi] = useState(false);
  const [apiData, setApiData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const weatherCondition = apiData?.weather?.[0]?.main || "Clear";

  function handleCityName(e) {
    setCityName(e.target.value);
  }

  function handleEnableApi() {
    setEnableApi(true);
  }

  function handleToggleUi() {
    setToggleUi(true);
  }

  function handleSearchIcon() {
    handleEnableApi();
    handleToggleUi();
  }

  useEffect(() => {
    if (!enableApi) return; // only fetch if enable api is true

    async function getWeather() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching the weather");

        const data = await res.json();
        setApiData(data);

        console.log(data);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getWeather();
    setEnableApi(false);
  }, [enableApi, cityName]); // Dependency array to re-trigger on enableApi or cityName change

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${
          weatherBackgrounds[weatherCondition] || "/assets/clear.gif"
        })`,
      }}
    >
      <div className="searchbar-container">
        <SearchBar
          onCityName={handleCityName}
          onSearchIcon={handleSearchIcon}
        />
        <TemperatureConverter />
      </div>
      <LocalTime toggleUi={toggleUi} />
      <CurrentTemperature
        toggleUi={toggleUi}
        apiData={apiData}
        cityName={cityName}
      />
      <div className="wind-humidity-container">
        <Humidity toggleUi={toggleUi} apiData={apiData} />
        <Wind toggleUi={toggleUi} apiData={apiData} />
      </div>
    </div>
  );
}

function SearchBar({ onCityName, onSearchIcon }) {
  return (
    <div className="searchbar-wrapper">
      <input
        onChange={onCityName}
        className="searchbar"
        placeholder="Search for a city.."
      ></input>
      <i onClick={onSearchIcon} className="bx bx-search searchbar-btn"></i>
    </div>
  );
}

function TemperatureConverter() {
  return (
    <p className="temperature-converter-wrapper">
      <span className="celsius">°C</span>
      <span className="separator">|</span>
      <span className="fahrenheit">°F</span>
    </p>
  );
}

function LocalTime({ toggleUi }) {
  return toggleUi ? (
    <p className="local-time">
      Friday, 20 September 2024 | Local time: 15:43 PM
    </p>
  ) : null;
}

function CurrentTemperature({ toggleUi, apiData, cityName }) {
  return toggleUi ? (
    <div className="temperature-container">
      <img
        src={
          apiData?.weather?.[0]?.icon
            ? `http://openweathermap.org/img/wn/${apiData?.weather[0]?.icon}@2x.png`
            : ""
        }
        alt={apiData?.weather?.[0]?.description}
      ></img>
      <span className="current-temperature">
        {apiData?.main?.temp ? Math.round(apiData.main.temp) : 25}
        °C
      </span>
      <span className="city-wrapper">
        <i className="bx bx-current-location"></i>
        <span className="city">{cityName}</span>
      </span>
    </div>
  ) : null;
}

function Wind({ toggleUi, apiData }) {
  return toggleUi ? (
    <div className="wind-wrapper">
      <i className="bx bx-wind wind-icon"></i>
      <span className="wind-speed">
        {apiData?.wind?.speed ? apiData.wind.speed : 0} km/h
      </span>
    </div>
  ) : null;
}

function Humidity({ toggleUi, apiData }) {
  return toggleUi ? (
    <div className="humidity-wrapper">
      <img src="assets/humidity.png" alt="humitiy-icon"></img>
      <span className="humidity-percentage">
        {apiData?.main?.humidity ? apiData.main.humidity : 0}%
      </span>
    </div>
  ) : null;
}

function Loader() {
  return (
    <p>
      <i class="bx bx-loader bx-spin bx-flip-horizontal"></i>
    </p>
  );
}
