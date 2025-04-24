import { fetchWeatherApi } from 'openmeteo';

const params = {
	latitude: 52.52,
	longitude: 13.41,
};
const apiUrl = 'https://api.open-meteo.com/v1/forecast';

// ?import { DefaultApi } from "./../apis/"

// const apiClient = new DefaultApi();

export const fetchWeather = async () => {
	try {
		const response = await fetchWeatherApi(apiUrl, params);
		// const response = await apiClient.v1ForecastGet({
		//   latitude: 35.6895,  // 東京の緯度
		//   longitude: 139.6917, // 東京の経度
		// })

		return response;
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${JSON.stringify(error)}`);
	}
};
