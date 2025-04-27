import { fetchWeatherApi } from 'openmeteo';

const apiUrl = 'https://api.open-meteo.com/v1/forecast';

export const fetchCurrentWeather = async (request: {
	latitude?: number;
	longitude?: number;
}) => {
	try {
		const params = {
			...request,
			current: [
				'temperature_2m',
				'relative_humidity_2m',
				'precipitation',
				'rain',
				'weather_code',
			],
			models: 'jma_seamless',
			forecast_days: 1,
		};
		const responses = await fetchWeatherApi(apiUrl, params);
		const response = responses[0];

		const current = response.current()!;

		// 現在の時間帯の温度やら天候やらの時間帯を取得する
		const currentWeatherData = {
			temperature: current.variables(0)!.value(), // 温度
			relativeHumidity: current.variables(1)!.value(), // 湿度
			precipitation: current.variables(2)!.value(), // 降水量
			rain: current.variables(3)!.value(), // 雨降っているか
			weatherCode: current.variables(4)!.value(), // 天気コード
		};

		return currentWeatherData;
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${JSON.stringify(error)}`);
	}
};
