'use client';
import LoadingIndicator from 'components/LoadingIndicator';
import { useLocation } from 'context/LocationContext';
import dayjs from 'dayjs';
import { ScheduleRegister } from 'features/ScheduleRegister';
import { CalendarBody } from 'features/Top/Components/CalendarBody';
import { CalendarHead } from 'features/Top/Components/CalendarHead';
import { useAsyncLoading } from 'hooks/useAsyncLoading';
import { useCalendar } from 'hooks/useCalendar';
import { useWeather } from 'hooks/useWeather';
import { useCallback, useEffect, useState } from 'react';
import {
	FetchCurrentWeather,
	FetchMonthlyWeather,
	GetCoordinate,
	Schedule,
} from 'types/types';
import { dayTextCommon } from 'utils/calendar';
import { LIMIT_YEAR } from 'utils/constants';

export const Top = ({
	registeredSchedules,
	defaultCurrentWeather,
	defaultMonthlyWeather,
	coordinate,
}: {
	registeredSchedules: Schedule[];
	defaultCurrentWeather: FetchCurrentWeather;
	defaultMonthlyWeather: FetchMonthlyWeather;
	coordinate: GetCoordinate;
}) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// 外部APIを使用して経度と緯度を取得するため、useEffectを使用する
	const { setLocation, latitude, longitude } = useLocation();
	useEffect(() => {
		if (latitude && longitude) return;
		setLocation(coordinate.latitude, coordinate.longitude);
	}, [coordinate, latitude, longitude, setLocation]);

	const { currentWeather, monthlyWeather, getWeatherData } = useWeather({
		defaultCurrentWeather,
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
	} = useCalendar(registeredSchedules);

	// 年と月を変える
	const onChangeYearAndMonth = useAsyncLoading(
		useCallback(
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
			[changeYearAndMonth, getWeatherData],
		),
	);

	// 月を変える
	const onChangeMonth = useAsyncLoading(
		useCallback(
			async (c: number) => {
				await Promise.all([
					changeMonth(c),
					Number(year) >= LIMIT_YEAR && c <= 0 ? getWeatherData(c) : null,
				]);
			},
			[year, changeMonth, getWeatherData],
		),
	);

	//
	const resetSchedule = useAsyncLoading(
		useCallback(async () => {
			await onGetSchedules(Number(year), Number(month));
			setIsModalOpen(false);
		}, [year, month, onGetSchedules]),
	);

	return (
		<>
			<LoadingIndicator />
			<main className="w-full relative">
				<CalendarHead
					count={count}
					year={year}
					month={month}
					isNowMonth={isNowMonth}
					whether={currentWeather}
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
		</>
	);
};
