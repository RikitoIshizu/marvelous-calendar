import dayjs from 'dayjs';
import { fetchWeatherApi } from 'openmeteo';
import { MonthlyWeatherData } from 'types/types';
import { SATURDAY, SUNDAY } from 'utils/constants';

export const getStartAndEndDate = (startDate: string, endDate: string) => {
	let start_date = startDate;
	let end_date = endDate;

	const dayOfWeekCodeOfStart = dayjs(startDate).day();
	const dayOfWeekCodeOfEnd = dayjs(endDate).day();

	const isTheDaySunday = dayOfWeekCodeOfStart === SUNDAY;
	const isTheDaySaturday = dayOfWeekCodeOfEnd === SATURDAY;

	if (!isTheDaySunday) {
		start_date = dayjs(start_date)
			.add(-dayOfWeekCodeOfStart, 'day')
			.format('YYYY-MM-DD');
	}

	if (!isTheDaySaturday) {
		const lackOfDay = SATURDAY - dayOfWeekCodeOfEnd;
		end_date = dayjs(end_date).add(lackOfDay, 'day').format('YYYY-MM-DD');
	}

	return {
		start_date,
		end_date,
	};
};

export const adjustFetchWeatherData = (
	response: Awaited<ReturnType<typeof fetchWeatherApi>>,
): MonthlyWeatherData => {
	const weatherData: MonthlyWeatherData = {};

	if (!response.length) return weatherData;

	const res = response[0];

	const utcOffsetSeconds = res.utcOffsetSeconds();
	const daily = res.daily()!;

	[
		...Array(
			(Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
		),
	].forEach((_, i) => {
		const date = new Date(
			(Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000,
		);

		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');

		const dateText = `${year}-${month}-${day}`;

		weatherData[dateText] = {
			weatherCode: daily.variables(0)!.valuesArray()![i],
			temperatureMax: daily.variables(1)!.valuesArray()![i],
			temperatureMin: daily.variables(2)!.valuesArray()![i],
		};
	});

	return weatherData;
};
