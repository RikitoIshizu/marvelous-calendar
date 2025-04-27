import { getCoordinate } from 'apis/ipstack';
import { fetchCurrentWeather } from 'apis/whethers';
import { Top } from 'features/Top';
import { Suspense } from 'react';
import { dayTextCommmon } from 'shared/calendar';
import { getSchedule } from '../apis/supabase';

export default async function Index() {
	const year = Number(dayTextCommmon('YYYY'));
	const month = Number(dayTextCommmon('MM'));
	const [allSchedules, currentMonthSchedules, coordinate] = await Promise.all([
		getSchedule(),
		getSchedule(year, month),
		getCoordinate(),
	]);

	// 天候情報を取得する
	const wheather = await fetchCurrentWeather({
		latitude: coordinate.latitude,
		longitude: coordinate.longitude,
	});

	return (
		<Suspense>
			<Top
				registeredSchedules={currentMonthSchedules}
				allSchedules={allSchedules}
				wheather={wheather}
			/>
		</Suspense>
	);
}
