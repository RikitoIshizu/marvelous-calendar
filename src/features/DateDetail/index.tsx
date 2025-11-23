'use client';
import dayjs from 'dayjs';
import { ScheduleRegister } from 'features/ScheduleRegister';
import { useAsyncLoading } from 'hooks/useAsyncLoading';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Schedule } from 'types/types';
import { dayTextCommon, specialDays } from 'utils/calendar';
import { deleteSchedule, getScheduleDetail } from '../../apis/supabase';
import { Schedule as ScheduleComponent } from './Components/Schedule';

export const DateDetail = ({
	registeredSchedules,
	date,
}: {
	registeredSchedules: Schedule[];
	date: string;
}) => {
	// 登録されているスケジュール
	const [schedules, setSchedules] = useState<Schedule[]>(registeredSchedules);
	// 登録・編集のモーダルが開いているかどうか
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	// モーダルのモード(作成か・編集か)
	const [modalMode, setModalMode] = useState<'register' | 'edit'>('register');
	// 編集しようとしているスケジュールの詳細
	const [selectedSchedule, setSelectedScheduleId] = useState<Schedule | {}>({});

	// ページタイトル
	const getTitleText = (): string => {
		const today = dayjs();
		const selectedDay = dayjs(date);
		const todayText = dayTextCommon('YYYYMMDD');
		const selectedDayWithFormat = dayTextCommon('YYYYMMDD', date);

		if (todayText === selectedDayWithFormat) return '今日の予定';
		if (today.add(1, 'day').format('YYYYMMDD') === selectedDayWithFormat)
			return '明日の予定';
		if (today.add(-1, 'day').format('YYYYMMDD') === selectedDayWithFormat)
			return '昨日の予定';
		if (selectedDay.isBefore(dayjs()))
			return `${selectedDay.format('YYYY年M月D日')}に追加された予定`;
		return `${selectedDay.format('YYYY年M月D日')}の予定`;
	};

	// カレンダーに表示する特別な日
	const specialDay = (): string => {
		const md = dayTextCommon('MMDD', date);
		return specialDays[md] ? specialDays[md] : '';
	};

	// 登録されているスケジュールを読み込む
	const loadSchedules = useCallback(async () => {
		const schedules = await getScheduleDetail(date);
		setSchedules(schedules);
	}, [date]);

	// スケジュールをアップデートする
	const updateSchedule = useAsyncLoading(
		useCallback(
			async (_: boolean) => {
				setIsModalOpen(false);
				await loadSchedules();
			},
			[loadSchedules],
		),
	);

	// 作成・編集モーダルを開く
	const openModal = useCallback(
		(id: Schedule['id']) => {
			setModalMode('edit');
			const editSchedule = schedules?.filter((el) => el.id === id);

			if (!editSchedule?.length) return;

			setSelectedScheduleId(editSchedule[0]);
			setIsModalOpen(true);
		},
		[schedules],
	);

	// スケジュールを登録する
	const openRegisterScheduleModal = useCallback(() => {
		setIsModalOpen(true);
		setModalMode('register');
	}, []);

	//
	const confirmShouldDeleteSchedule = useAsyncLoading(
		useCallback(
			async (id: Schedule['id']) => {
				const response = await deleteSchedule(id);

				if (!response) {
					await loadSchedules();
				}
			},
			[loadSchedules],
		),
	);

	return (
		<main>
			<section className="my-2 relative">
				<h1 className="text-4xl font-bold text-center">{getTitleText()}</h1>
				<div className="w-[1000px] mx-auto">
					{specialDay() && (
						<>
							<h2 className="text-3xl font-bold">今日は何の日？</h2>
							<div className="mt-1">{specialDay()}</div>
						</>
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
				<ScheduleRegister
					isModalOpen={isModalOpen}
					type={modalMode}
					shouldHideDateArea={true}
					onOpenModal={updateSchedule}
					onCloseModal={() => setIsModalOpen(false)}
					schedule={selectedSchedule as Schedule}
					date={date}
				/>
			</section>
		</main>
	);
};
