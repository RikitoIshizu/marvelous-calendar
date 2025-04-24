'use client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { ComponentProps, useCallback, useMemo, useState } from 'react';
import { dayTextCommmon, specialDays } from 'shared/calendar';
import { CalendarRegisterModal } from 'shared/SchduleRegister/CalendarRegisterModal';
import { Schedule } from 'types/types';
import { deleteSchedule, getScheduleDetail } from '../../api/apis/supabase';
import { CalendarRegister } from '../../shared/SchduleRegister/CalendarRegister';
import { Schedule as ScheduleComponent } from './Components/Schedule';

export const DateDetail = ({
	registeredSchedules,
	date,
}: {
	registeredSchedules: Schedule[];
	date: string;
}) => {
	const [schedules, setSchedules] = useState<Schedule[]>(registeredSchedules);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [modalMode, setModalMode] = useState<'register' | 'edit'>('register');
	const [isNewScheduleLoading, setIsNewScheduleLoading] =
		useState<boolean>(false);
	const [selectedSchedule, setSelectedSchdeuld] = useState<Schedule | {}>({});

	const specialDay = useMemo(() => {
		const md = dayTextCommmon('MMDD', date);

		return specialDays[md] ? specialDays[md] : '';
	}, [date]);

	const loadSchedules = useCallback(async () => {
		const schedules = await getScheduleDetail(date);
		setSchedules(schedules);
	}, [date]);

	const updSchedule: ComponentProps<
		typeof CalendarRegister
	>['onEventCallBack'] = useCallback(async () => {
		alert('スケジュールが登録されました。');
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

				setSelectedSchdeuld(editSchedule[0]);
				setIsModalOpen(true);
			},
			[schedules],
		);

	// 登録
	const openRegisterScheduleModal: ComponentProps<
		typeof ScheduleComponent
	>['onOpenRegisterScheduleModal'] = useCallback(() => {
		setIsModalOpen(true);
		setModalMode('register');
	}, []);

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
							<h2 className="text-3xl font-bold">今日は何の日？</h2>
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
					schedule={selectedSchedule as Schedule}
					date={date}
					registeredSchedules={registeredSchedules}
				/>
			</section>
			{isNewScheduleLoading && (
				<div className="fixed bg-white w-full h-full">読み込み中</div>
			)}
		</main>
	);
};
