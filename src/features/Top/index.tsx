'use client';
import { useLocation } from 'context/LocationContext';
import { CalendarBody } from 'features/Top/Components/CalendarBody';
import { CalendarHead } from 'features/Top/Components/CalendarHead';
import { useCalendar } from 'hooks/useCalendar';
import { useWeather } from 'hooks/useWeather';
import { ComponentProps, useCallback, useEffect, useState } from 'react';
import { dayTextCommon, yearAndMonthAndDateList } from 'shared/calendar';
import { CalendarRegisterModal } from 'shared/SchduleRegister/CalendarRegisterModal';
import {
	FetchCurrentWeather,
	FetchMonthlyWeather,
	GetCoordinate,
	Schedule,
} from 'types/types';

export const Top = ({
	registeredSchedules,
	allSchedules,
	defaultCurrentWeather,
	defaultMonthlyWeather,
	coordinate,
}: {
	registeredSchedules: Schedule[];
	allSchedules: Schedule[];
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

	const { currentWeather, monthlyWeather, changeYearAndMonth } = useWeather({
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
		onChangeYearAndMonth,
		getScheduleOnTheDate,
		onGetSchedules,
	} = useCalendar(registeredSchedules);

	const onChangeMonth = useCallback(
		async (c: number) => {
			Promise.all([
				changeMonth(c),
				Number(year) >= 2016 || c <= 1 ? changeYearAndMonth(c) : null,
			]);
		},
		[changeMonth, changeYearAndMonth, year],
	);

	const onResetSchedule: ComponentProps<
		typeof CalendarRegisterModal
	>['onOpenModal'] = useCallback(() => {
		onGetSchedules(Number(year), Number(month));
		setIsModalOpen(false);
	}, [onGetSchedules, year, month]);

	return (
		<main className="w-full relative">
			<CalendarHead
				count={count}
				year={year}
				month={month}
				isNowMonth={isNowMonth}
				whether={currentWeather}
				onChangeYearAndMonth={onChangeYearAndMonth}
				changeMonth={onChangeMonth}
				yearAndMonthAndDateList={yearAndMonthAndDateList}
				setIsModalOpen={setIsModalOpen}
			/>
			<CalendarBody
				days={days}
				month={month}
				year={year}
				monthlyWeather={monthlyWeather}
				getScheduleOnTheDate={getScheduleOnTheDate}
			/>
			<CalendarRegisterModal
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
				onOpenModal={onResetSchedule}
				isModalOpen={isModalOpen}
				date={dayTextCommon('YYYYMMDD')}
				registeredSchedules={allSchedules}
			/>
		</main>
	);
};
