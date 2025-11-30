'use client';
import { useLocation } from '@/context/LocationContext';
import { ScheduleRegister } from '@/features/ScheduleRegister';
import { CalendarBody } from '@/features/Top/Components/CalendarBody';
import { CalendarHead } from '@/features/Top/Components/CalendarHead';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { useCalendar } from '@/hooks/useCalendar';
import { useWeather } from '@/hooks/useWeather';
import {
	FetchCurrentWeatherResponse,
	GetCoordinate,
	MonthlyWeatherData,
	MonthString,
	Schedule,
} from '@/types/types';
import { dayTextCommon } from '@/utils/calendar';
import { LIMIT_YEAR } from '@/utils/constants';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export const Top = ({
	registeredSchedules,
	currentWeather,
	defaultMonthlyWeather,
	coordinate,
	currentYear,
	currentMonth,
	diffMonth,
}: {
	registeredSchedules: Schedule[];
	currentWeather: FetchCurrentWeatherResponse;
	defaultMonthlyWeather: MonthlyWeatherData;
	coordinate: GetCoordinate;
	currentYear?: string;
	currentMonth?: MonthString;
	diffMonth: number;
}) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// 外部APIを使用して経度と緯度を取得するため、useEffectを使用する
	const { setLocation, latitude, longitude } = useLocation();
	useEffect(() => {
		if (latitude && longitude) return;
		setLocation(coordinate.latitude, coordinate.longitude);
	}, [coordinate, latitude, longitude, setLocation]);

	const { monthlyWeather, getWeatherData } = useWeather({
		defaultMonthlyWeather,
	});

	const {
		count,
		days,
		year,
		month,
		day,
		isNowMonth,
		changeMonth,
		changeYearAndMonth,
		getScheduleOnTheDate,
		onGetSchedules,
	} = useCalendar(registeredSchedules, diffMonth, currentYear, currentMonth);

	// 年と月を変える
	const onChangeYearAndMonth = useAsyncLoading(
		async (year: string, month: string) => {
			const differenceOfMonth = dayjs(`${year}-${month}`).diff(
				dayjs(),
				'month',
			);

			await Promise.all([
				changeYearAndMonth(year, month),
				Number(year) >= LIMIT_YEAR && differenceOfMonth <= 0
					? getWeatherData(differenceOfMonth)
					: null,
			]);
		},
	);

	// 月を変える
	const onChangeMonth = useAsyncLoading(async (c: number) => {
		await Promise.all([
			changeMonth(c),
			Number(year) >= LIMIT_YEAR && c <= 0 ? getWeatherData(c) : null,
		]);
	});

	//
	const resetSchedule = useAsyncLoading(async () => {
		await onGetSchedules(Number(year), Number(month));
		setIsModalOpen(false);
	});

	return (
		<main className="w-full relative">
			<CalendarHead
				count={count}
				year={year}
				month={month}
				isNowMonth={isNowMonth}
				weather={currentWeather}
				changeMonth={onChangeMonth}
				onChangeYearAndMonth={onChangeYearAndMonth}
				setIsModalOpen={setIsModalOpen}
			/>
			<CalendarBody
				days={days}
				month={month}
				year={year}
				monthlyWeatherData={monthlyWeather}
				getScheduleOnTheDate={getScheduleOnTheDate}
			/>
			<ScheduleRegister
				type="register"
				shouldHideDateArea={false}
				schedule={{
					year: Number(year),
					month: Number(month),
					day: Number(day),
					start_hour: '00',
					start_minute: '00',
					end_hour: '00',
					end_minute: '00',
				}}
				onOpenModal={resetSchedule}
				onCloseModal={() => setIsModalOpen(false)}
				isModalOpen={isModalOpen}
				date={dayTextCommon('YYYYMMDD')}
			/>
		</main>
	);
};
