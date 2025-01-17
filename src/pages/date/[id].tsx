import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
	FormEvent,
	useEffect,
	useState,
	useCallback,
	useMemo,
	ComponentType,
} from 'react';
import ReactModal from 'react-modal';

const Modal = ReactModal as unknown as ComponentType<any>;

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
	registerScheduleDetail,
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
	const [modalMode, setModalMode] = useState<'register' | 'edit'>('register');
	const [isNewScheduleLoading, setIsNewScheduleLoading] =
		useState<boolean>(false);
	const [schedules, setSchedules] = useState<Schedule[]>([]);

	// 編集用パラメータ
	const [scheduleId, setScheduleId] = useState<Schedule['id'] | ''>('');
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
	const dateText = useMemo(() => dayjs(date).format('YYYY年M月D日'), [date]);
	const pageTitle = useMemo(() => `${dateText}の予定`, [dateText]);
	const pageDescription = useMemo(
		() => `${date}の予定を確認・変更・作成ができます。`,
		[date],
	);

	const loadSchedules = useCallback(async () => {
		const schedules = await getScheduleDetail(date);
		setSchedules(schedules);
	}, [date]);

	const specialDay = useCallback(() => {
		const md = dayjs(date).format('MMDD');

		return specialDays[md] ? specialDays[md] : '';
	}, [date]);

	const updSchedule = useCallback(
		async (e: FormEvent<Element>): Promise<void> => {
			e.preventDefault();

			setTitleError(!scheduleTitle ? 'タイトルを入力は必須です。' : '');
			setDescriptionError(
				!scheduleDescription ? 'スケジュールの詳細は必須です。' : '',
			);

			if (!scheduleTitle && !scheduleDescription) return;

			if (modalMode === 'register') {
				const registeringDate = dayjs(date);
				const year = registeringDate.format('YYYY');
				const month = registeringDate.format('MM');
				const day = registeringDate.format('DD');

				const response = await registerScheduleDetail({
					year: Number(year),
					month: Number(month),
					day: Number(day),
					title: scheduleTitle,
					description: scheduleDescription,
					scheduleTypes: Number(scheduleType),
				});

				!response && alert('スケジュール登録完了！');
			} else {
				const response = await updateSchedule({
					id: Number(scheduleId),
					title: scheduleTitle,
					description: scheduleDescription,
					scheduleTypes: Number(scheduleType),
				});

				!response && alert('スケジュール変更完了！');
			}

			setTitleError('');
			setDescriptionError('');
			setIsModalOpen(false);
			loadSchedules();
		},
		[
			scheduleTitle,
			scheduleDescription,
			scheduleType,
			date,
			loadSchedules,
			modalMode,
			scheduleId,
		],
	);

	const openModal = useCallback(
		(id: Schedule['id']): void => {
			setModalMode('edit');
			const editSchedule = schedules?.filter((el) => el.id === id);

			if (!editSchedule?.length) return;

			setScheduleId(editSchedule[0].id);
			setScheduleTitle(editSchedule[0].title);
			setScheduletDescription(editSchedule[0].description);
			setScheduleType(editSchedule[0].scheduleTypes);
			setIsModalOpen(true);
		},
		[schedules],
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
		[loadSchedules],
	);

	const openRegisterScheduleModal = () => {
		setIsModalOpen(true);
		setModalMode('register');
		setScheduleId('');
		setScheduleTitle('');
		setScheduletDescription('');
		setScheduleType(null);
	};

	useEffect(() => {
		router.isReady && loadSchedules();
	}, [router, loadSchedules]);

	const shouldShowScheduleRegisterBtn = useCallback(() => {
		return dayjs(date).isAfter(dayjs());
	}, [date]);

	return (
		<main>
			<MetaData title={pageTitle} description={pageDescription} />
			<section className="my-2 relative">
				{typeof date === 'string' && !!date && (
					<h1 className="text-4xl font-bold text-center">{titleText(date)}</h1>
				)}
				<div className="w-[1000px] mx-auto">
					{specialDay() && (
						<section>
							<h2 className="text-2xl font-bold">今日は何の日？</h2>
							<div className="mt-1">{specialDay()}</div>
						</section>
					)}
					<section className="mt-4">
						<div className="flex">
							<h2 className="text-2xl font-bold mr-4">スケジュール</h2>
							{shouldShowScheduleRegisterBtn() && (
								<Button
									text="登録"
									textColor="#fff"
									onEventCallBack={openRegisterScheduleModal}
								/>
							)}
						</div>
						{schedules.length ? (
							<ul className="mt-4">
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
						) : (
							<div className="mt-4">スケジュールは登録されていません。</div>
						)}
					</section>
					<div className="mt-6 text-center">
						<Link href="/" className="w-[100px] h-[50px] text-blue-700">
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
						<Button type="submit" text="登録" buttonColor="#a7f3d0" />
					</div>
				</form>
			</Modal>
			{isNewScheduleLoading && (
				<div className="fixed bg-white w-full h-full">読み込み中</div>
			)}
		</main>
	);
}
