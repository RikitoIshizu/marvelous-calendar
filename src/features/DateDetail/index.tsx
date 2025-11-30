'use client';
import { deleteSchedule, getScheduleDetail } from '@/apis/supabase';
import { Schedule as ScheduleComponent } from '@/features/DateDetail/Components/Schedule';
import { ScheduleRegister } from '@/features/ScheduleRegister';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { useWeatherMark } from '@/libs/getWeatherMark';
import { MonthlyWeatherData, Quote, Schedule } from '@/types/types';
import { dayTextCommon, specialDays } from '@/utils/calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState } from 'react';
import { Quotes } from './Components/Quotes';

// 天気の部分
const WeatherPart = memo(function WeatherPart({
	weather,
}: {
	weather: MonthlyWeatherData[string];
}) {
	const maxTemperature = useMemo(
		() => weather.temperatureMax.toFixed(1),
		[weather.temperatureMax],
	);

	const minTemperature = useMemo(
		() => weather.temperatureMin.toFixed(1),
		[weather.temperatureMin],
	);

	const weatherIcon = useWeatherMark(weather.weatherCode);

	return (
		<>
			{weatherIcon}
			<div className="text-xl">
				最高気温: {maxTemperature}℃ / 最低気温: {minTemperature}℃
			</div>
		</>
	);
});

// ヘッダーの部分
const HeaderPart = memo(function HeaderPart({
	date,
	weather,
}: {
	date: string;
	weather?: MonthlyWeatherData[string];
}) {
	// ページのタイトル
	const getTitleText = useMemo(
		(): string => `${dayjs(date).locale('ja').format('YYYY年M月D日(ddd)')}`,
		[date],
	);

	return (
		<div className="mt-4 mb-6 gap-4 flex items-center justify-center">
			<h1 className="text-4xl font-bold ">{getTitleText}</h1>
			{!!weather && WeatherPart({ weather })}
		</div>
	);
});

// 特別な日パート
const SpecialDayPart = memo(function SpecialDayPart({
	date,
}: {
	date: string;
}) {
	// カレンダーに表示する特別な日
	const specialDay = useMemo((): string => {
		const md = dayTextCommon('MMDD', date);
		return specialDays[md] ? specialDays[md] : '';
	}, [date]);

	if (!specialDay) return null;

	return (
		<>
			<h2 className="text-3xl font-bold">今日は何の日？</h2>
			<div className="mt-1">{specialDay}</div>
		</>
	);
});

// トップページへのリンク
const TopPageLink = memo(function TopPageLink({ date }: { date: string }) {
	const topPagePath = useMemo(() => {
		const month = dayTextCommon('MM', date);
		const year = dayTextCommon('YYYY', date);

		return `/?year=${year}&month=${month}`;
	}, [date]);

	return (
		<div className="mt-6 text-center">
			<Link href={topPagePath} className="w-[100px] h-[50px] text-blue-700">
				戻る
			</Link>
		</div>
	);
});

export const DateDetail = ({
	registeredSchedules,
	date,
	quotes,
	weather,
}: {
	registeredSchedules: Schedule[];
	date: string;
	quotes: Quote[];
	weather?: MonthlyWeatherData[string];
}) => {
	// 登録されているスケジュール
	const [schedules, setSchedules] = useState<Schedule[]>(registeredSchedules);
	// 登録・編集のモーダルが開いているかどうか
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	// モーダルのモード(作成か・編集か)
	const [modalMode, setModalMode] = useState<'register' | 'edit'>('register');
	// 編集しようとしているスケジュールの詳細
	const [selectedSchedule, setSelectedScheduleId] = useState<Schedule | {}>({});

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
	const openModal = (id: Schedule['id']) => {
		setModalMode('edit');
		const editSchedule = schedules?.filter((el) => el.id === id);

		if (!editSchedule?.length) return;

		setSelectedScheduleId(editSchedule[0]);
		setIsModalOpen(true);
	};

	// スケジュールを登録する
	const openRegisterScheduleModal = () => {
		setIsModalOpen(true);
		setModalMode('register');
	};

	//
	const confirmShouldDeleteSchedule = useAsyncLoading(
		useCallback(
			async (id: Schedule['id']) => {
				const response = await deleteSchedule(id);

				if (!response) await loadSchedules();
			},
			[loadSchedules],
		),
	);

	return (
		<main>
			<section className="my-2 relative">
				<HeaderPart date={date} weather={weather} />
				<div className="w-[1000px] mx-auto">
					<SpecialDayPart date={date} />
					<div className="flex justify-center gap-4">
						<ScheduleComponent
							schedules={schedules}
							date={date}
							onOpenRegisterScheduleModal={openRegisterScheduleModal}
							onOpenModal={openModal}
							onDeleteSchedule={confirmShouldDeleteSchedule}
						/>
						<Quotes quotes={quotes} />
					</div>

					<TopPageLink date={date} />
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
