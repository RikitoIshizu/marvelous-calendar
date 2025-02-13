import { Top } from 'features/Top';
import { dayTextCommmon } from 'shared/calendar';
import { getSchedule } from 'shared/supabase';
import { Suspense } from 'react';

export default async function Index() {
	const year = Number(dayTextCommmon('YYYY'));
	const month = Number(dayTextCommmon('MM'));
	const schedules = await getSchedule(year, month);

	return (
		<Suspense>
			<Top schedules={schedules} />
		</Suspense>
	);
}
