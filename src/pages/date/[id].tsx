import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState, useCallback, useMemo } from 'react';
import Modal from 'react-modal';

import { Button } from '@/components/atoms/Button';
import { MetaData } from '@/components/atoms/MetaData';
import { InputTitle } from '@/components/molecules/InputTitle';
import { InputDescription } from '@/components/molecules/InputDescription';
import { ScheduleTypes } from '@/components/molecules/ScheduleTypes';

import { specialDays, scheduleTextColor } from '@/lib/calendar';
import {
	getScheduleDetail,
	deleteSchedule,
	updateSchedule,
} from '@/lib/supabase';
import type { Schedule } from '@/lib/types';

const modalContentStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		width: '62.5rem',
	},
};

const titleText = (date: string): string => {
	const today = dayjs();
	const selectedDay = dayjs(date);
	const selectedDayWithFormat = selectedDay.format('YYYYMMDD');

	if (today.format('YYYYMMDD') === selectedDayWithFormat) return '今日の予定';
	if (today.add(1, 'day').format('YYYYMMDD') === selectedDayWithFormat)
		return '明日の予定';
	if (today.add(-1, 'day').format('YYYYMMDD') === selectedDayWithFormat)
		return '昨日の予定';

	if (selectedDay.isBefore(today))
		return `${selectedDay.format('YYYY年M月D日')}に追加された予定`;

	return `${selectedDay.format('YYYY年M月D日')}の予定`;
};

export default function Date() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isNewScheduleLoading, setIsNewScheduleLoading] =
		useState<boolean>(false);
	const [schedules, setSchedules] = useState<Schedule[] | null>(null);

	// 編集用パラメータ
	const [scheduleId, setScheduleId] = useState<Schedule['id'] | null>(null);
	const [scheduleTitle, setScheduleTitle] = useState<Schedule['title']>('');
	const [scheduleDescription, setScheduletDescription] =
		useState<Schedule['description']>('');
	const [scheduleType, setScheduleType] = useState<
		Schedule['scheduleTypes'] | null
	>(null);

	// バリデーション
	const [titleError, setTitleError] = useState<string>('');
	const [descriptionError, setDescriptionError] = useState<string>('');

	const date = useRouter().query.id as string;
	const dateText = useMemo(() => dayjs(date).format('YYYY年M月D日'), []);
	const pageTitle = useMemo(() => `${dateText}の予定`, []);
	const pageDescription = useMemo(
		() => `${date}の予定を確認・変更・作成ができます。`,
		[]
	);

	const loadSchedules = useCallback(async () => {
		const schedules = await getScheduleDetail(date);
		setSchedules(schedules);
	}, [date]);

	const specialDay = useMemo((): string => {
		const md = dayjs(date).format('MMDD');

		return specialDays[md] ? specialDays[md] : '';
	}, []);

	const updSchedule = useCallback(
		async (e: FormEvent<Element>): Promise<void> => {
			e.preventDefault();

			setTitleError(!scheduleTitle ? 'タイトルを入力は必須です。' : '');
			setDescriptionError(
				!scheduleDescription ? 'スケジュールの詳細は必須です。' : ''
			);

			if (scheduleTitle && scheduleDescription) {
				const response = await updateSchedule({
					id: Number(scheduleId),
					title: scheduleTitle,
					description: scheduleDescription,
					scheduleTypes: Number(scheduleType),
				});

				if (!response) {
					alert('スケジュール変更完了！');
					setTitleError('');
					setDescriptionError('');
					setIsModalOpen(false);
					loadSchedules();
				}
			}
		},
		[
			scheduleTitle,
			scheduleDescription,
			scheduleType,
			titleError,
			descriptionError,
		]
	);

	const openModal = useCallback(
		(id: Schedule['id']): void => {
			const editSchedule = schedules?.filter((el) => el.id === id);

			if (!editSchedule?.length) return;

			setScheduleId(editSchedule[0].id);
			setScheduleTitle(editSchedule[0].title);
			setScheduletDescription(editSchedule[0].description);
			setScheduleType(editSchedule[0].scheduleTypes);
			setIsModalOpen(true);
		},
		[schedules]
	);

	const confirmShouldDeleteSchedule = useCallback(
		async (id: Schedule['id']) => {
			const shouldDeleteSchedule =
				window.confirm('選択したスケジュールを削除しますか？');

			if (!shouldDeleteSchedule) return;

			setIsNewScheduleLoading(true);
			const response = await deleteSchedule(id);

			if (!response) {
				loadSchedules();
				setIsNewScheduleLoading(false);
			}
		},
		[schedules]
	);

	useEffect(() => {
		router.isReady && loadSchedules();
	}, [router]);

	return (
		<main>
			<MetaData title={pageTitle} description={pageDescription} />
			<section className="my-2 relative">
				{typeof date === 'string' && !!date && (
					<h1 className="text-4xl font-bold text-center">{titleText(date)}</h1>
				)}
				<div className="w-[1000px] mx-auto">
					{specialDay && (
						<section>
							<h2 className="text-2xl font-bold">今日は何の日？</h2>
							<div className="mt-1">{specialDay}</div>
						</section>
					)}
					{schedules?.length ? (
						<section className="mt-4">
							<h2 className="text-2xl font-bold">登録されているスケジュール</h2>
							{schedules && (
								<ul>
									{schedules.map((el) => {
										return (
											<li className="mt-1 flex items-center" key={el.id}>
												<p className={scheduleTextColor(el.scheduleTypes)}>
													{el.description}
												</p>
												<button
													className="ml-2 w-[80px] bg-[blue] text-[#fff] rounded-full"
													onClick={() => openModal(el.id)}
												>
													編集
												</button>
												<button
													className="ml-2 w-[80px] bg-[red] text-[#fff] rounded-full"
													onClick={() => confirmShouldDeleteSchedule(el.id)}
												>
													削除
												</button>
											</li>
										);
									})}
								</ul>
							)}
						</section>
					) : null}
					<div className="mt-6">
						<Link href="/" className="w-[100px] h-[50px] bg-[red]s">
							戻る
						</Link>
					</div>
				</div>
			</section>
			<Modal
				isOpen={isModalOpen}
				ariaHideApp={false}
				onRequestClose={() => setIsModalOpen(false)}
				style={modalContentStyles}
				contentLabel="Example Modal"
			>
				<form onSubmit={(e: FormEvent<Element>) => updSchedule(e)}>
					<div className="">予定を編集</div>
					<ScheduleTypes
						type={scheduleType}
						onEventCallBack={(e: string) => setScheduleType(Number(e))}
					/>
					<InputTitle
						title={scheduleTitle}
						titleError={titleError}
						onChangeTitle={(text: string) => setScheduleTitle(text)}
					/>
					<InputDescription
						description={scheduleDescription}
						descriptionError={descriptionError}
						onchangeDescription={(text: string) =>
							setScheduletDescription(text)
						}
					/>
					<div className="text-center mt-5">
						<Button
							type="submit"
							text="登録"
							buttonColor="#a7f3d0"
							underBarColor="#059669"
						/>
					</div>
				</form>
			</Modal>
			{isNewScheduleLoading && (
				<div className="fixed bg-white w-full h-full">読み込み中</div>
			)}
		</main>
	);
}
