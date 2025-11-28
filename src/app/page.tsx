import { getCoordinate } from '@/apis/ipstack';
import { getSchedule } from '@/apis/supabase';
import {
	fetchCurrentWeather,
	fetchHistoryMonthlyWeather,
	fetchMonthlyWeather,
} from '@/apis/weather';
import { Top } from '@/features/Top';
import { getStartAndEndDate } from '@/libs/weather';
import { MonthString, SearchParams } from '@/types/types';
import { dayTextCommon } from '@/utils/calendar';
import { FORECAST_DAYS_LIMIT } from '@/utils/constants';
import dayjs from 'dayjs';
import { Suspense } from 'react';

const setDate = (
	year?: SearchParams['year'],
	month?: SearchParams['month'],
) => {
	// 年月が指定されていない場合、はじまりは現在月の初日、終わりは現在日から予報可能な最大日数(14日)の日付とする
	if (!year && !month)
		return {
			start: dayjs().startOf('month').format('YYYY-MM-DD'),
			end: dayjs().add(FORECAST_DAYS_LIMIT, 'day').format('YYYY-MM-DD'),
		};

	// 年または月のどちらか一方が指定されていない場合、指定されている方に合わせてもう一方を現在の年月とする
	const setDate = () => {
		const setYear = year || dayTextCommon('YYYY');
		const setMonth = month
			? month.toString().padStart(2, '0')
			: dayTextCommon('MM');

		return `${setYear}-${setMonth}-01`;
	};

	return {
		start: dayjs(setDate()).startOf('month').format('YYYY-MM-DD'),
		end: dayjs(setDate()).endOf('month').format('YYYY-MM-DD'),
	};
};

export default async function Index({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const { year, month } = await searchParams;

	const currentYear = Number(year) || Number(dayTextCommon('YYYY'));
	const currentMonth = Number(month) || Number(dayTextCommon('MM'));

	const startAndEndDate = setDate(year, month);

	const { start_date, end_date } = getStartAndEndDate(
		startAndEndDate.start,
		startAndEndDate.end,
	);

	// 経度と緯度を取得する
	const coordinate = await getCoordinate();

	// 指定された月が現在より過去かどうかをチェック
	const targetMonth = dayjs(
		`${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
	);
	const currentMonthDate = dayjs().startOf('month');
	const isPastMonth = targetMonth.isBefore(currentMonthDate);

	// 現在と当月の天候情報を取得する
	const [currentMonthSchedules, currentWeather, monthlyWeather] =
		await Promise.all([
			getSchedule(currentYear, currentMonth),
			fetchCurrentWeather({
				latitude: coordinate.latitude,
				longitude: coordinate.longitude,
			}),
			isPastMonth
				? fetchHistoryMonthlyWeather({
						latitude: coordinate.latitude,
						longitude: coordinate.longitude,
						start_date,
						end_date,
					})
				: fetchMonthlyWeather({
						latitude: coordinate.latitude,
						longitude: coordinate.longitude,
						start_date,
						end_date,
					}),
		]);

	return (
		<Suspense>
			<Top
				registeredSchedules={currentMonthSchedules}
				currentWeather={currentWeather}
				defaultMonthlyWeather={monthlyWeather}
				coordinate={coordinate}
				currentYear={currentYear.toString()}
				currentMonth={currentMonth.toString().padStart(2, '0') as MonthString}
			/>
		</Suspense>
	);
}
