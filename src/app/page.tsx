import { Top } from 'features/Top';
import { Suspense } from 'react';
import { dayTextCommmon } from 'shared/calendar';
import { getSchedule } from '../api/apis/supabase';

export default async function Index() {
	const year = Number(dayTextCommmon('YYYY'));
	const month = Number(dayTextCommmon('MM'));
	const [allSchedules, currentMonthSchedules] = await Promise.all([
		getSchedule(),
		getSchedule(year, month),
	]);

	return (
		<Suspense>
			<Top
				registeredSchedules={currentMonthSchedules}
				allSchedules={allSchedules}
			/>
		</Suspense>
	);
}
