'use client';
import { registerScheduleDetail, updateSchedule } from 'apis/supabase';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { DayString, MonthString, ScheduleRegisterInput } from 'types/types';
import { amountOfDay, dayTextCommon } from 'utils/calendar';
import { MONTHS_IN_YEAR, YEARS_TO_SHOW } from 'utils/constants';

// 年リストを生成
const generateYearList = (startYear: string): string[] => {
	const yearList: string[] = [startYear];
	for (let i = 1; i < YEARS_TO_SHOW; i++) {
		const year = dayjs(`${startYear}-01`).add(i, 'year').format('YYYY');
		yearList.push(year);
	}
	return yearList;
};

// 月リストを生成（開始月から12月まで）
const generateMonthList = (startMonth: number): MonthString[] => {
	const monthList: MonthString[] = [];
	for (let month = startMonth; month <= MONTHS_IN_YEAR; month++) {
		monthList.push(String(month).padStart(2, '0') as MonthString);
	}
	return monthList;
};

// 全ての月リストを生成（1月から12月まで）
const generateAllMonthList = (): MonthString[] => {
	const monthList: MonthString[] = [];
	for (let month = 1; month <= MONTHS_IN_YEAR; month++) {
		monthList.push(String(month).padStart(2, '0') as MonthString);
	}
	return monthList;
};

// 日リストを生成（特定の日より後の日のみ）
const generateDayListAfter = (
	yearMonth: string,
	afterDay: number,
): DayString[] => {
	const dayList: DayString[] = [];
	const totalDays = amountOfDay(yearMonth);
	for (let day = afterDay + 1; day <= totalDays; day++) {
		dayList.push(String(day).padStart(2, '0') as DayString);
	}
	return dayList;
};

// 日リストを生成（全ての日）
const generateAllDayList = (yearMonth: string): DayString[] => {
	const dayList: DayString[] = [];
	const totalDays = amountOfDay(yearMonth);
	for (let day = 1; day <= totalDays; day++) {
		dayList.push(String(day).padStart(2, '0') as DayString);
	}
	return dayList;
};

// 日リストを生成（今日より後の日のみ）
const generateFutureDayList = (yearMonth: string): DayString[] => {
	const dayList: DayString[] = [];
	const totalDays = amountOfDay(yearMonth);
	const today = dayjs();

	for (let i = 1; i <= totalDays; i++) {
		const day = String(i).padStart(2, '0');
		const date = `${yearMonth}-${day}`;
		const checkDay = dayjs(date);

		if (checkDay.isAfter(today)) {
			dayList.push(day as DayString);
		}
	}
	return dayList;
};

// カレンダーの選択リストの初期値設定用の処理
const firstSetCalendar = (year: string, month: string) => {
	const nowYearAndMonth = `${year}-${month}`;

	// 年リスト: 今年から10年後まで
	const yearList = generateYearList(year);

	// 月リスト: 今月以降の月
	const monthList = generateMonthList(Number(month));

	// 日リスト: 今日より後の日
	const dayList = generateFutureDayList(nowYearAndMonth);

	return {
		yearList,
		monthList,
		dayList,
	};
};

export type UseRegisterSchedule = ReturnType<typeof useRegisterSchedule>;

export const useRegisterSchedule = (schedule: ScheduleRegisterInput) => {
	const defaultYear = schedule.year?.toString() || dayTextCommon('YYYY');
	const defaultMonth = schedule.month?.toString() || dayTextCommon('MM');
	const defaultDay = schedule.day?.toString() || dayTextCommon('DD');

	// 年月日
	const [year, setYear] = useState<string>(defaultYear);
	const [month, setMonth] = useState<string>(defaultMonth);
	const [day, setDay] = useState<string>(defaultDay);

	// スケジュールのタイトル
	const [title, setTitle] = useState<
		NonNullable<ScheduleRegisterInput['title']>
	>(schedule.title ?? '');

	// 時間関係
	const [startHour, setStartHour] = useState<
		ScheduleRegisterInput['start_hour']
	>(schedule.start_hour || '00');
	const [startMinute, setStartMinute] = useState<
		ScheduleRegisterInput['start_minute']
	>(schedule.start_minute || '00');
	const [endHour, setEndHour] = useState<ScheduleRegisterInput['end_hour']>(
		schedule.end_hour || '01',
	);
	const [endMinute, setEndMinute] = useState<
		ScheduleRegisterInput['end_minute']
	>(schedule.end_minute || '00');

	// 説明文
	const [description, setDescription] = useState<
		NonNullable<ScheduleRegisterInput['description']>
	>(schedule.description ?? '');

	// スケジュールのタイプ
	const [scheduleType, setScheduleType] = useState<
		ScheduleRegisterInput['scheduleTypes']
	>(schedule.scheduleTypes || 1);

	const yearList = useMemo(
		() => firstSetCalendar(defaultYear, defaultMonth).yearList,
		[defaultYear, defaultMonth],
	);

	// カレンダーの月日のリスト
	const [nowMonthList, setMonthList] = useState<string[]>(
		firstSetCalendar(defaultYear, defaultMonth).monthList,
	);
	const [nowDayList, setDayList] = useState<string[]>(
		firstSetCalendar(defaultYear, defaultMonth).dayList,
	);

	// バリデーション
	const [titleError, setTitleError] = useState<string>('');
	const [descriptionError, setDescriptionError] = useState<string>('');
	const [timeError, setTimeError] = useState<string>('');

	const changeYear = useCallback(
		(
			selectedYear: string,
			selectedMonth: string,
			selectedDay: string,
		): void => {
			setYear(selectedYear);

			const selectedDate = `${selectedYear}-${String(selectedMonth).padStart(
				2,
				'0',
			)}-${String(selectedDay).padStart(2, '0')}`;
			const today = dayTextCommon('YYYY-MM-DD');
			const thisYear = Number(dayTextCommon('YYYY'));
			const todayMonth = dayjs().month() + 1;
			const todayDay = dayjs().date();

			// 選択した年が今年または選択した日付が過去の場合
			const isCurrentYearOrPast =
				dayjs(selectedDate).isBefore(today) ||
				thisYear === Number(selectedYear);

			let monthList: MonthString[];
			let dayList: DayString[];

			if (isCurrentYearOrPast) {
				// 今月以降の月リストを生成
				monthList = generateMonthList(todayMonth);

				// 明日以降の日リストを生成
				const currentYearMonth = dayTextCommon('YYYY-MM');
				dayList = generateDayListAfter(currentYearMonth, todayDay);

				// 選択している月が過去なら今月にセット
				if (Number(selectedMonth) < todayMonth) {
					setMonth(String(todayMonth).padStart(2, '0'));
				}

				// 選択している日が過去なら明日にセット
				if (Number(selectedDay) <= todayDay) {
					setDay(String(todayDay + 1).padStart(2, '0'));
				}
			} else {
				// 未来の年の場合：全ての月と日を選択可能
				monthList = generateAllMonthList();
				const firstMonthOfYear = `${selectedYear}-01`;
				dayList = generateAllDayList(firstMonthOfYear);
			}

			setMonthList(monthList);
			setDayList(dayList);
		},
		[],
	);

	// 月を変更
	const changeMonth = useCallback(
		(
			selectedYear: string,
			selectedMonth: string,
			selectedDay: string,
		): void => {
			setMonth(selectedMonth);

			const selectedYearAndMonth = `${selectedYear}-${String(
				selectedMonth,
			).padStart(2, '0')}`;
			const currentMonth = dayTextCommon('YYYY-MM');
			const totalDaysInMonth = amountOfDay(selectedYearAndMonth);

			let dayList: DayString[];

			if (selectedYearAndMonth === currentMonth) {
				// 今月の場合：今日より後の日のみ選択可能
				dayList = generateFutureDayList(selectedYearAndMonth);

				const selectedDayFormatted = String(Number(selectedDay)).padStart(
					2,
					'0',
				) as DayString;

				// 選択している日が選択可能な日に含まれていない場合、リストの最初の日にセット
				if (!dayList.includes(selectedDayFormatted) && dayList.length > 0) {
					setDay(dayList[0]);
				}
			} else {
				// 未来の月の場合：全ての日が選択可能
				dayList = generateAllDayList(selectedYearAndMonth);

				// 選択している日がその月の日数を超えている場合、月末日にセット
				if (Number(selectedDay) > totalDaysInMonth) {
					setDay(String(totalDaysInMonth).padStart(2, '0'));
				}
			}

			setDayList(dayList);
		},
		[],
	);

	// エラーメッセージをリセットする
	const clearErrorMessages = (): void => {
		setTitleError('');
		setDescriptionError('');
		setTimeError('');
	};

	// 入力系の値をリセットする
	const resetInputItem = (): void => {
		setTitle('');
		setStartHour('00');
		setStartMinute('00');
		setEndHour('01');
		setEndMinute('00');
		setDescription('');
		setScheduleType(1);
	};

	const registerSchedule = useCallback(
		async (onSuccess: () => void) => {
			const response = await registerScheduleDetail({
				year: Number(year),
				month: Number(month),
				day: Number(day),
				title,
				description,
				scheduleTypes: scheduleType,
				start_hour: startHour,
				start_minute: startMinute,
				end_hour: endHour,
				end_minute: endMinute,
			});

			if (!response) {
				onSuccess();
				clearErrorMessages();
				resetInputItem;
			}
		},
		[
			day,
			description,
			month,
			year,
			title,
			startHour,
			startMinute,
			endHour,
			endMinute,
			scheduleType,
		],
	);

	const editSchedule = useCallback(
		async (onSuccess: () => void) => {
			const response = await updateSchedule({
				id: Number(schedule?.id),
				title,
				description,
				scheduleTypes: scheduleType,
				start_hour: startHour,
				start_minute: startMinute,
				end_hour: endHour,
				end_minute: endMinute,
			});

			if (!response) {
				onSuccess();
				clearErrorMessages();
				resetInputItem();
			}
		},
		[
			description,
			title,
			startHour,
			startMinute,
			endHour,
			endMinute,
			scheduleType,
			schedule.id,
		],
	);

	return {
		year,
		month,
		day,
		title,
		startHour,
		startMinute,
		endHour,
		endMinute,
		description,
		scheduleType,
		yearList,
		nowMonthList,
		nowDayList,
		titleError,
		descriptionError,
		timeError,
		setDay,
		setTitle,
		setStartHour,
		setStartMinute,
		setEndHour,
		setEndMinute,
		setDescription,
		setScheduleType,
		changeYear,
		changeMonth,
		registerSchedule,
		editSchedule,
		setTitleError,
		setTimeError,
		setDescriptionError,
	};
};
