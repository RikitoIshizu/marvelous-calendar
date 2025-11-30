import { getCoordinate } from '@/apis/ipstack';
import { getQuote } from '@/apis/meigen';
import { getScheduleDetail } from '@/apis/supabase';
import { fetchHistoryMonthlyWeather } from '@/apis/weather';
import { DateDetail } from '@/features/DateDetail';
import { dayTextCommon } from '@/utils/calendar';
import { FORECAST_DAYS_LIMIT, LIMIT_DATE_STRING } from '@/utils/constants';
import dayjs from 'dayjs';
import { Suspense } from 'react';

export default async function Date({
	params,
}: {
	params: Promise<{ date: string }>;
}) {
	const { date } = await params;
	const [registeredSchedule, quotes, coordinate] = await Promise.all([
		getScheduleDetail(date),
		getQuote(5),
		getCoordinate(),
	]);

	let weather = undefined;

	const settingDate = dayTextCommon('YYYY-MM-DD', date);
	const todayDate = dayTextCommon('YYYY-MM-DD');

	const setWeather = async () => {
		const weatherData = await fetchHistoryMonthlyWeather({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude,
			start_date: settingDate,
			end_date: settingDate,
		});

		weather = weatherData[settingDate];
	};

	// 見ようとしているページが当日より後の日付のページの場合
	if (dayjs(settingDate).isAfter(dayjs(todayDate))) {
		// 未来の日付が14日以内であれば、未来の天気を取得する
		const differenceOfDays = dayjs(settingDate).diff(dayjs(todayDate), 'day');

		if (differenceOfDays <= FORECAST_DAYS_LIMIT) await setWeather();
	} else if (!dayjs(settingDate).isBefore(dayjs(LIMIT_DATE_STRING))) {
		// 過去の日付がAPIで取得可能な最古の日付以降であれば取得する
		await setWeather();
	}

	return (
		<Suspense>
			<DateDetail
				registeredSchedules={registeredSchedule}
				date={date}
				quotes={quotes}
				weather={weather}
			/>
		</Suspense>
	);
}
