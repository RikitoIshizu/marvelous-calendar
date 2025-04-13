import { DateDetail } from 'features/DateDetail';
import { Suspense } from 'react';
import { getScheduleDetail } from 'shared/supabase';

export default async function Date({
	params,
}: {
	params: Promise<{ date: string }>;
}) {
	const date = (await params).date;
	const registeredSchedule = await getScheduleDetail(date);

	return (
		<Suspense>
			<DateDetail registeredSchedules={registeredSchedule} date={date} />
		</Suspense>
	);
}
