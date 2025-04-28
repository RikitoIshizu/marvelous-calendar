import { fetchHistoryMonthlyWeather, fetchMonthlyWeather } from 'apis/weather';
import { useLocation } from 'context/LocationContext';
import dayjs from 'dayjs';
import { getStartAndEndDate } from 'libs/weather';
import { useCallback, useState } from 'react';
import { FetchCurrentWeather, FetchMonthlyWeather } from 'types/types';

type UseCalendar = {
	defaultCurrentWeather: FetchCurrentWeather;
	defaultMonthlyWeather: FetchMonthlyWeather;
};

export const useWeather = ({
	defaultCurrentWeather,
	defaultMonthlyWeather,
}: UseCalendar) => {
	const { latitude, longitude } = useLocation();

	const [currentWeather, setCurrentWeather] = useState<FetchCurrentWeather>(
		defaultCurrentWeather,
	);
	const [monthlyWeather, setMonthlyWeather] = useState<FetchMonthlyWeather>(
		defaultMonthlyWeather,
	);

	const getMonthlyWeatherData = useCallback(
		async ({
			start_date,
			end_date,
		}: Pick<
			Parameters<typeof fetchMonthlyWeather>['0'],
			'start_date' | 'end_date'
		>) => {
			const currentMonthlyWeather = await fetchMonthlyWeather({
				latitude: latitude!,
				longitude: longitude!,
				start_date,
				end_date,
			});

			setMonthlyWeather(currentMonthlyWeather);
		},
		[latitude, longitude],
	);

	const getHistoryMonthlyWeatherData = useCallback(
		async (count: number) => {
			const startDate = dayjs()
				.add(count, 'month')
				.startOf('month')
				.format('YYYY-MM-DD');
			const endDate = dayjs()
				.add(count, 'month')
				.endOf('month')
				.format('YYYY-MM-DD');

			const { start_date, end_date } = getStartAndEndDate(startDate, endDate);

			const currentMonthlyWeather = await fetchHistoryMonthlyWeather({
				latitude: latitude!,
				longitude: longitude!,
				start_date,
				end_date,
			});

			setMonthlyWeather(currentMonthlyWeather);
		},
		[latitude, longitude],
	);

	// 未来の天気予報は15日先までしか取れない
	const getMonthlyWeatherDataUntil15days = useCallback(
		async (count: number) => {
			const startDate = dayjs()
				.add(count, 'month')
				.startOf('month')
				.format('YYYY-MM-DD');
			const end_date = dayjs().add(15, 'day').format('YYYY-MM-DD');

			const { start_date } = getStartAndEndDate(startDate, end_date);

			await getMonthlyWeatherData({ start_date, end_date });
		},
		[getMonthlyWeatherData],
	);

	const getThisMonthWeatherData = useCallback(async () => {
		const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
		const endDate = dayjs().endOf('month').format('YYYY-MM-DD');

		const { start_date, end_date } = getStartAndEndDate(startDate, endDate);

		await getMonthlyWeatherData({ start_date, end_date });
	}, [getMonthlyWeatherData]);

	const changeYearAndMonth = useCallback(
		async (count: number) => {
			if (count < 0) await getHistoryMonthlyWeatherData(count);
			if (count === 0) await getThisMonthWeatherData();
			if (count > 0) await getMonthlyWeatherDataUntil15days(count);
		},
		[
			getHistoryMonthlyWeatherData,
			getThisMonthWeatherData,
			getMonthlyWeatherDataUntil15days,
		],
	);

	return {
		currentWeather,
		monthlyWeather,
		setCurrentWeather,
		setMonthlyWeather,
		changeYearAndMonth,
	};
};
