import { Suspense } from 'react';
import { DateDetail } from 'features/DateDetail';
import { getScheduleDetail } from 'shared/supabase';

export default async function Date({
	params,
}: {
	params: Promise<{ date: string }>;
}) {
	const date = (await params).date;
	const schedule = await getScheduleDetail(date);

	return (
		<Suspense>
			<DateDetail initSchedules={schedule} date={date} />
		</Suspense>
	);
}
