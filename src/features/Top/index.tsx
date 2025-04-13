'use client';
import { CalendarBody } from 'features/Top/Components/CalendarBody';
import { CalendarHead } from 'features/Top/Components/CalendarHead';
import { useCalandar } from 'hooks/useCalendar';
import { ComponentProps, useState } from 'react';
import { dayTextCommmon, yearAndMonthAndDateList } from 'shared/calendar';
import { CalendarRegisterModal } from 'shared/SchduleRegister/CalendarRegisterModal';
import { Schedule } from 'types/types';

export const Top = ({
	registeredSchedules,
	allSchedules,
}: {
	registeredSchedules: Schedule[];
	allSchedules: Schedule[];
}) => {
	// 共通の処理はこのコンポーネントでまとめる
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
	} = useCalandar(registeredSchedules);

	const onResetSchedule: ComponentProps<
		typeof CalendarRegisterModal
	>['onOpenModal'] = () => {
		onGetSchedules(Number(year), Number(month));
		setIsModalOpen(false);
	};

	return (
		<main className="w-full relative">
			<CalendarHead
				count={count}
				year={year}
				month={month}
				isNowMonth={isNowMonth}
				changeMonth={changeMonth}
				yearAndMonthAndDateList={yearAndMonthAndDateList}
				onChangeYearAndMonth={onChangeYearAndMonth}
				setIsModalOpen={setIsModalOpen}
			/>
			<CalendarBody
				days={days}
				month={month}
				year={year}
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
				date={dayTextCommmon('YYYYMMDD')}
				registeredSchedules={allSchedules}
			/>
		</main>
	);
};
