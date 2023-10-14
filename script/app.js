const apiKey = "KEY";

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	const date = new Date(timestamp * 1000);

	const hours = '0' + date.getHours();
	const minutes = '0' + date.getMinutes();

	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const updateSun = (percent,sun) => {
	percent = Math.max(0, Math.min(100, percent));

	const left = percent;

	const bottom = Math.sin((percent / 100) * Math.PI) * 100;

	sun.style = `bottom: ${bottom}%; left: ${left}%;`;
}

let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	const sun = document.querySelector(".js-sun");
	const resterende = document.querySelector(".js-time-left");

	const now = new Date().getTime() / 1000;
	let sunminutes = now - sunrise;

	const daypercent = (sunminutes / totalMinutes) * 100;
	sun.dataset.time = _parseMillisecondsIntoReadableTime(now);
	updateSun(daypercent,sun);

	document.body.classList.add("is-loaded");

	const resterend = totalMinutes - sunminutes;
	resterende.innerHTML = _parseMillisecondsIntoReadableTime(resterend);

	const updateSunEveryminute = () => {
		if (sunminutes >= totalMinutes) {
			document.querySelector("html").classList.add("is-night");
		} else {
			document.querySelector("html").classList.remove("is-night");
			const now2 = new Date().getTime() / 1000;
			let sunminutes2 = now2 - sunrise;
			const daypercent2 = (sunminutes2 / totalMinutes) * 100;
			sun.dataset.time = _parseMillisecondsIntoReadableTime(now2);
			updateSun(daypercent2,sun);
			const resterend2 = totalMinutes - sunminutes2;
			resterende.innerHTML = _parseMillisecondsIntoReadableTime(resterend2);
		}
	}

	setInterval(updateSunEveryminute, 60000);
};

let showResult = queryResponse => {
	document.querySelector(".js-location").innerHTML = queryResponse.city.name + ', ' + queryResponse.city.country;

	const sunrise = queryResponse.city.sunrise;
	const sunset = queryResponse.city.sunset;
	document.querySelector(".js-sunrise").innerHTML = _parseMillisecondsIntoReadableTime(sunrise);
	document.querySelector(".js-sunset").innerHTML = _parseMillisecondsIntoReadableTime(sunset);

	const totaltime = sunset - sunrise;

	placeSunAndStartMoving(totaltime,sunrise);
};

let getAPI = async (lat, lon) => {
	const weatherInfo = await fetch(
		`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=nl&cnt=1`,
	).then((response) => response.json())

	showResult(weatherInfo);
};

document.addEventListener('DOMContentLoaded', function() {
	getAPI(50.8027841, 3.2097454);
});
