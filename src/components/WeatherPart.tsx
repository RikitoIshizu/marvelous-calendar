import { useWeatherMark } from '@/libs/getWeatherMark';
import { FetchCurrentWeatherResponse } from '@/types/types';
import { memo, useMemo } from 'react';

export const WeatherPart = memo(function WeatherPart({
	weather,
}: {
	weather: FetchCurrentWeatherResponse;
}) {
	// 現在の気温
	const temperature = useMemo<string | null>(
		() =>
			weather?.temperature != null
				? Number(weather.temperature).toFixed(1) + '℃'
				: null,
		[weather],
	);

	// 現在の湿度
	const humidity = useMemo<string | null>(
		() => weather?.relativeHumidity + '%' || null,
		[weather],
	);

	// 現在の降水確率
	const precipitation = useMemo<string>(() => {
		const precipitation = Math.round(Number(weather?.precipitation) * 100);
		return precipitation + '%';
	}, [weather]);

	const weatherIcon = useWeatherMark(
		weather.weatherCode,
		'!w-[40px] !h-[40px] mr-4',
	);

	return (
		<div className="flex items-center w-1/3">
			{weatherIcon}
			<div>
				<div className="flex items-center">
					<div className="mr-4">気温 {temperature}</div>
					<div>湿度 {humidity}</div>
				</div>
				<div>降水確率: {precipitation}</div>
			</div>
		</div>
	);
});
