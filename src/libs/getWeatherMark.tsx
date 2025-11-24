import { FetchCurrentWeather } from '@/types/types';
import ClearSkyIcon from 'assets/svgs/weather/clearSky.svg';
import CloudyIcon from 'assets/svgs/weather/cloudy.svg';
import RainyIcon from 'assets/svgs/weather/rainy.svg';
import SnowyIcon from 'assets/svgs/weather/snowy.svg';
import SunnyIcon from 'assets/svgs/weather/sunny.svg';
import ThunderIcon from 'assets/svgs/weather/thunder.svg';

export const getWeatherMark = (
	weatherCode: FetchCurrentWeather['weatherCode'],
	weatherIconStyles: string | undefined = '!w-[40px] !h-[40px]',
) => {
	if (weatherCode === 0) return <ClearSkyIcon className={weatherIconStyles} />; // 快晴
	if (weatherCode === 3) return <CloudyIcon className={weatherIconStyles} />; // 曇り
	if ([1, 2].includes(weatherCode))
		// 晴れ
		return <SunnyIcon className={weatherIconStyles} />;
	if ([45, 48, 51, 53, 55, 56, 57].includes(weatherCode))
		// 霧
		return <CloudyIcon className={weatherIconStyles} />;
	if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode))
		// 雨
		return <RainyIcon className={weatherIconStyles} />;
	if ([71, 73, 75, 77, 85, 86].includes(weatherCode))
		// 雪
		return <SnowyIcon className={weatherIconStyles} />;
	if ([95, 96, 99].includes(weatherCode))
		// 雷
		return <ThunderIcon className={weatherIconStyles} />;
	return null;
};
