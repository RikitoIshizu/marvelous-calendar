'use client';
import Link from 'next/link';
import { useState, useCallback, ComponentProps, useMemo } from 'react';
import { dayTextCommmon, specialDays } from 'shared/calendar';
import { deleteSchedule } from 'shared/supabase';
import { Schedule } from 'types/types';
import { Schedule as ScheduleComponent } from './Components/Schedule';
import { CalendarRegister } from '../../shared/CalendarRegister';
import { useSchedule } from 'hooks/useSchedule';
import { Hour, Minute } from 'shared/time';
import { CalendarRegisterModal } from 'shared/CalendarRegisterModal';
import dayjs from 'dayjs';

export const DateDetail = ({
	initSchedules,
	date,
}: {
	initSchedules: Schedule[];
	date: string;
}) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [modalMode, setModalMode] = useState<'register' | 'edit'>('register');
	const [isNewScheduleLoading, setIsNewScheduleLoading] =
		useState<boolean>(false);

	const year = useMemo(() => dayTextCommmon('YYYY', date), [date]);
	const month = useMemo(() => dayTextCommmon('MM', date), [date]);
	const day = useMemo(() => dayTextCommmon('DD', date), [date]);

	const specialDay = useMemo(() => {
		const md = dayTextCommmon('MMDD', date);

		return specialDays[md] ? specialDays[md] : '';
	}, [date]);

	const {
		schedules,
		scheduleId,
		setScheduleId,
		scheduleTitle,
		setScheduleTitle,
		scheduleDescription,
		setScheduletDescription,
		scheduleType,
		setScheduleType,
		loadSchedules,
		startHour,
		setStartHour,
		startMinute,
		setStartMinute,
		endHour,
		setEndHour,
		endMinute,
		setEndMinute,
	} = useSchedule(date, initSchedules);

	const updSchedule: ComponentProps<
		typeof CalendarRegister
	>['onEventCallBack'] = useCallback(async () => {
		setIsModalOpen(false);
		loadSchedules();
	}, [loadSchedules]);

	// 編集
	const openModal: ComponentProps<typeof ScheduleComponent>['onOpenModal'] =
		useCallback(
			(id: Schedule['id']) => {
				setModalMode('edit');
				const editSchedule = schedules?.filter((el) => el.id === id);

				if (!editSchedule?.length) return;

				setScheduleId(editSchedule[0].id);
				setScheduleTitle(editSchedule[0].title);
				setScheduletDescription(editSchedule[0].description);
				setScheduleType(editSchedule[0].scheduleTypes);
				setStartHour(editSchedule[0].start_hour as Hour);
				setEndHour(editSchedule[0].end_hour as Hour);
				setStartMinute(editSchedule[0].start_minute as Minute);
				setEndMinute(editSchedule[0].end_minute as Minute);
				setIsModalOpen(true);
			},
			[
				schedules,
				setScheduleId,
				setScheduleTitle,
				setScheduletDescription,
				setScheduleType,
				setStartHour,
				setEndHour,
				setStartMinute,
				setEndMinute,
			],
		);

	// 登録
	const openRegisterScheduleModal: ComponentProps<
		typeof ScheduleComponent
	>['onOpenRegisterScheduleModal'] = useCallback(() => {
		setIsModalOpen(true);
		setModalMode('register');
		setScheduleId('');
		setScheduleTitle('');
		setScheduletDescription('');
	}, [setScheduleId, setScheduleTitle, setScheduletDescription]);

	const confirmShouldDeleteSchedule: ComponentProps<
		typeof ScheduleComponent
	>['onDeleteSchedule'] = useCallback(
		async (id: Schedule['id']) => {
			setIsNewScheduleLoading(true);
			const response = await deleteSchedule(id);

			if (!response) {
				loadSchedules();
				setIsNewScheduleLoading(false);
			}
		},
		[loadSchedules],
	);

	const titleText = useCallback((): string => {
		const today = dayjs();
		const selectedDay = dayjs(date);
		const todayText = dayTextCommmon('YYYYMMDD');
		const selectedDayWithFormat = dayTextCommmon('YYYYMMDD', date);

		if (todayText === selectedDayWithFormat) return '今日の予定';
		if (today.add(1, 'day').format('YYYYMMDD') === selectedDayWithFormat)
			return '明日の予定';
		if (today.add(-1, 'day').format('YYYYMMDD') === selectedDayWithFormat)
			return '昨日の予定';

		if (selectedDay.isBefore(dayjs()))
			return `${selectedDay.format('YYYY年M月D日')}に追加された予定`;

		return `${selectedDay.format('YYYY年M月D日')}の予定`;
	}, [date]);

	return (
		<main>
			<section className="my-2 relative">
				{typeof date === 'string' && !!date && (
					<h1 className="text-4xl font-bold text-center">{titleText()}</h1>
				)}
				<div className="w-[1000px] mx-auto">
					{specialDay && (
						<section>
							<h2 className="text-2xl font-bold">今日は何の日？</h2>
							<div className="mt-1">{specialDay}</div>
						</section>
					)}
					<ScheduleComponent
						schedules={schedules}
						date={date}
						onOpenRegisterScheduleModal={openRegisterScheduleModal}
						onOpenModal={openModal}
						onDeleteSchedule={confirmShouldDeleteSchedule}
					/>
					<div className="mt-6 text-center">
						<Link href="/" className="w-[100px] h-[50px] text-blue-700">
							戻る
						</Link>
					</div>
				</div>
				<CalendarRegisterModal
					isModalOpen={isModalOpen}
					type={modalMode}
					shouldHideDateArea={true}
					onOpenModal={updSchedule}
					year={Number(year)}
					month={Number(month)}
					day={Number(day)}
					startHour={startHour}
					startMinute={startMinute}
					endHour={endHour}
					endMinute={endMinute}
					id={Number(scheduleId)}
					title={scheduleTitle}
					description={scheduleDescription}
					scheduleTypes={scheduleType}
				/>
			</section>
			{isNewScheduleLoading && (
				<div className="fixed bg-white w-full h-full">読み込み中</div>
			)}
		</main>
	);
};
