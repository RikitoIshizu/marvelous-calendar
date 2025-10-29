import { getCoordinate } from 'apis/ipstack';
import { getSchedule } from 'apis/supabase';
import { fetchCurrentWeather, fetchMonthlyWeather } from 'apis/weather';
import dayjs from 'dayjs';
import { Top } from 'features/Top';
import { getStartAndEndDate } from 'libs/weather';
import { Suspense } from 'react';
import { dayTextCommon } from 'shared/calendar';
import { YEARS_TO_SHOW } from 'utils/constants';

export default async function Index() {
	const year = Number(dayTextCommon('YYYY'));
	const month = Number(dayTextCommon('MM'));

	const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
	const end_date = dayjs().add(YEARS_TO_SHOW, 'day').format('YYYY-MM-DD');

	const { start_date } = getStartAndEndDate(startDate, end_date);

	const [currentMonthSchedules, coordinate] = await Promise.all([
		getSchedule(year, month),
		getCoordinate(),
	]);

	// 現在と当月の天候情報を取得する
	const [currentWeather, monthlyWeather] = await Promise.all([
		fetchCurrentWeather({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
		}),
		fetchMonthlyWeather({
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
				defaultCurrentWeather={currentWeather}
				defaultMonthlyWeather={monthlyWeather}
				coordinate={coordinate}
			/>
		</Suspense>
	);
}
