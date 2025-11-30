import { getCoordinate } from '@/apis/ipstack';
import { getSchedule } from '@/apis/supabase';
import {
	fetchCurrentWeather,
	fetchHistoryMonthlyWeather,
	fetchMonthlyWeather,
} from '@/apis/weather';
import { Top } from '@/features/Top';
import { getStartAndEndDate } from '@/libs/weather';
import { MonthlyWeatherData, MonthString, SearchParams } from '@/types/types';
import { dayTextCommon } from '@/utils/calendar';
import { FORECAST_DAYS_LIMIT } from '@/utils/constants';
import dayjs from 'dayjs';
import { Suspense } from 'react';

export default async function Index({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { year, month } = await searchParams;

	// 現在の年月(指定されていなければ、現在の年月にする)
	const currentYear = Number(year) || Number(dayTextCommon('YYYY'));
	const currentMonth = Number(month) || Number(dayTextCommon('MM'));

	// 経度と緯度を取得する
	const coordinate = await getCoordinate();

	// 現在と当月の天候情報を取得する
	const [currentMonthSchedules, currentWeather] = await Promise.all([
		getSchedule(currentYear, currentMonth),
		fetchCurrentWeather({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
		}),
	]);

	let monthlyWeather: MonthlyWeatherData = {};

	// 指定された月が現在より過去かどうかを取得する
	const target = dayjs(
		`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`,
	);
	const now = dayjs();
	// 0 -> 現在、 1以上 -> 未来、 -1以下 -> 過去
	const diffMonth = target.startOf('month').diff(now.startOf('month'), 'month');

	// 再来月以降は何かしらの処理をする
	if (diffMonth === 0) {
		const { start_date, end_date } = getStartAndEndDate(
			dayjs().startOf('month').format('YYYY-MM-DD'),
			dayjs().endOf('month').format('YYYY-MM-DD'),
		);

		const weatherData = await fetchMonthlyWeather({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
			start_date,
			end_date,
		});
		monthlyWeather = weatherData;
	} else if (diffMonth === 1) {
		const { start_date } = getStartAndEndDate(
			dayjs().endOf('month').format('YYYY-MM-DD'),
			dayjs().add(FORECAST_DAYS_LIMIT, 'day').format('YYYY-MM-DD'),
		);

		const end_date = dayjs()
			.add(FORECAST_DAYS_LIMIT, 'day')
			.format('YYYY-MM-DD');

		const weatherData = await fetchMonthlyWeather({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
			start_date,
			end_date,
		});
		monthlyWeather = weatherData;
	} else if (diffMonth <= -1) {
		const setDate = () => {
			const setYear = year || dayTextCommon('YYYY');
			const setMonth = month
				? month.toString().padStart(2, '0')
				: dayTextCommon('MM');

			return `${setYear}-${setMonth}-01`;
		};

		const { start_date, end_date } = getStartAndEndDate(
			dayjs(setDate()).startOf('month').format('YYYY-MM-DD'),
			dayjs(setDate()).endOf('month').format('YYYY-MM-DD'),
		);

		const weatherData = await fetchHistoryMonthlyWeather({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
			start_date,
			end_date,
		});

		monthlyWeather = weatherData;
	}

	return (
		<Suspense>
			<Top
				registeredSchedules={currentMonthSchedules}
				currentWeather={currentWeather}
				defaultMonthlyWeather={monthlyWeather}
				coordinate={coordinate}
				currentYear={currentYear.toString()}
				currentMonth={currentMonth.toString().padStart(2, '0') as MonthString}
				diffMonth={diffMonth}
			/>
		</Suspense>
	);
}
