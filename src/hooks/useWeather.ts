import { fetchHistoryMonthlyWeather, fetchMonthlyWeather } from 'apis/weather';
import { useLocation } from 'context/LocationContext';
import dayjs from 'dayjs';
import { getStartAndEndDate } from 'libs/weather';
import { useCallback, useState } from 'react';
import { FetchCurrentWeather, FetchMonthlyWeather } from 'types/types';

// 定数定義
const FORECAST_DAYS_LIMIT = 14; // API仕様上、現在から14日先までしか取得できない

type UseWeatherProps = {
	defaultCurrentWeather?: FetchCurrentWeather;
	defaultMonthlyWeather?: FetchMonthlyWeather;
};

export const useWeather = ({
	defaultCurrentWeather,
	defaultMonthlyWeather,
}: UseWeatherProps) => {
	const { latitude, longitude } = useLocation();

	const [currentWeather, setCurrentWeather] =
		useState<FetchCurrentWeather | null>(defaultCurrentWeather ?? null);
	const [monthlyWeather, setMonthlyWeather] =
		useState<FetchMonthlyWeather | null>(defaultMonthlyWeather ?? null);

	const getMonthlyWeatherData = useCallback(
		async ({
			start_date,
			end_date,
		}: Pick<
			Parameters<typeof fetchMonthlyWeather>['0'],
			'start_date' | 'end_date'
		>) => {
			if (latitude == null || longitude == null) {
				throw new Error(`位置情報が取得できていません`);
			}

			const monthlyWeatherData = await fetchMonthlyWeather({
				latitude,
				longitude,
				start_date,
				end_date,
			});

			setMonthlyWeather(monthlyWeatherData);
		},
		[latitude, longitude],
	);

	const getHistoryMonthlyWeatherData = useCallback(
		async (count: number) => {
			if (latitude == null || longitude == null) {
				throw new Error(`位置情報が取得できていません。`);
			}

			const targetMonth = dayjs().add(count, 'month');
			const startDate = targetMonth.startOf('month').format('YYYY-MM-DD');
			const endDate = targetMonth.endOf('month').format('YYYY-MM-DD');

			const { start_date, end_date } = getStartAndEndDate(startDate, endDate);

			const monthlyWeatherData = await fetchHistoryMonthlyWeather({
				latitude,
				longitude,
				start_date,
				end_date,
			});

			setMonthlyWeather(monthlyWeatherData);
		},
		[latitude, longitude],
	);

	const getThisMonthWeatherData = useCallback(async () => {
		const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
		const end_date = dayjs()
			.add(FORECAST_DAYS_LIMIT, 'day')
			.format('YYYY-MM-DD');

		const { start_date } = getStartAndEndDate(startDate, end_date);

		await getMonthlyWeatherData({ start_date, end_date });
	}, [getMonthlyWeatherData]);

	const getWeatherData = useCallback(
		async (count: number) => {
			try {
				if (count < 0) {
					// 過去の月の天気データを取得
					await getHistoryMonthlyWeatherData(count);
				} else if (count === 0) {
					// 今月の天気データを取得
					await getThisMonthWeatherData();
				} else {
					throw new Error(`14日以降の天気予報は取得できません。`);
				}
			} catch (error) {
				throw new Error(
					`予期せぬエラーが発生しました。${error instanceof Error ? error.message : JSON.stringify(error)}`,
					{ cause: error },
				);
			}
		},
		[getHistoryMonthlyWeatherData, getThisMonthWeatherData],
	);

	return {
		currentWeather,
		monthlyWeather,
		setCurrentWeather,
		setMonthlyWeather,
		getWeatherData,
	};
};
