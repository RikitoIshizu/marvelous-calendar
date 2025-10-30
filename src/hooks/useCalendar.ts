'use client';
import { getSchedule } from 'apis/supabase';
import dayjs from 'dayjs';
import { useAsyncLoading } from 'hooks/useAsyncLoading';
import { useCallback, useMemo, useState } from 'react';
import {
	Calendar,
	DayString,
	MonthString,
	Schedule,
	WeeklyDay,
} from 'types/types';
import { amountOfDay, dayTextCommon } from 'utils/calendar';
import { DAYS_IN_WEEK, SATURDAY, SUNDAY } from 'utils/constants';

type ScheduleSummary = Pick<Schedule, 'id' | 'title' | 'scheduleTypes'>;

// その月のカレンダーを生成する
const makeCalendar = (ym: string): Calendar[] => {
	const calendar: Calendar[] = [];
	const weekdayCounters: number[] = new Array(DAYS_IN_WEEK).fill(0);

	// 現在見ている月のカレンダーの日付を取得する
	for (let i = 1; i <= amountOfDay(ym); i++) {
		const day = i.toString().padStart(2, '0');
		const yearAndMonth = dayTextCommon('YYYY-MM', ym);
		const date = dayTextCommon('YYYY-MM-DD', `${yearAndMonth}-${day}`);
		const keyOfDayOfWeek = dayjs(date).day();

		weekdayCounters[keyOfDayOfWeek]++;
		const order = weekdayCounters[keyOfDayOfWeek];

		const calendarEntry: Calendar = { date, keyOfDayOfWeek, order };
		calendar.push(calendarEntry);
	}

	return calendar;
};

// 前月の不足日を追加する関数
const addPreviousMonthDays = (firstDayOfMonth: Calendar): Calendar[] => {
	const prevMonthDays: Calendar[] = [];
	const dateObj = dayjs(firstDayOfMonth.date);

	// 月初が日曜日の場合は追加不要
	if (firstDayOfMonth.keyOfDayOfWeek === SUNDAY) return prevMonthDays;

	// 日曜日でない場合、前月の日付を追加
	for (let i = firstDayOfMonth.keyOfDayOfWeek; i > 0; i--) {
		const prevDate = dateObj.add(-i, 'day');
		prevMonthDays.push({
			date: prevDate.format('YYYY-MM-DD'),
			keyOfDayOfWeek: prevDate.day(),
			order: 1,
		});
	}

	return prevMonthDays;
};

// 次月の不足日を追加する関数
const addNextMonthDays = (lastDayOfMonth: Calendar): Calendar[] => {
	const nextMonthDays: Calendar[] = [];
	const dateObj = dayjs(lastDayOfMonth.date);

	// 月末が土曜日の場合は追加不要
	if (lastDayOfMonth.keyOfDayOfWeek === SATURDAY) return nextMonthDays;

	// 土曜日でない場合、次月の日付を追加
	for (let i = 1; i <= SATURDAY - lastDayOfMonth.keyOfDayOfWeek; i++) {
		const nextDate = dateObj.add(i, 'day');
		nextMonthDays.push({
			date: nextDate.format('YYYY-MM-DD'),
			keyOfDayOfWeek: nextDate.day(),
			order: SATURDAY,
		});
	}

	return nextMonthDays;
};

// 週ごとに分割する関数
const groupByWeek = (calendar: Calendar[]): WeeklyDay[] => {
	const datePerWeek: WeeklyDay[] = [];
	let oneWeek: Calendar[] = [];
	let week = 1;

	calendar.forEach((calendarDate: Calendar) => {
		oneWeek.push(calendarDate);

		// 土曜日(週の最後)になったら週をまとめる
		if (calendarDate.keyOfDayOfWeek !== SATURDAY) return;
		datePerWeek.push({ week, days: oneWeek });
		oneWeek = [];
		week++;
	});

	return datePerWeek;
};

const getCalendarDays = (val: number): WeeklyDay[] => {
	const yearMonth = dayjs().add(val, 'month').format('YYYY-MM');

	// カレンダーを取得する、その月の全日付を取得
	const currentMonthCalendar = makeCalendar(yearMonth);

	// 前月と次月の不足日を追加
	const previousMonthDays = addPreviousMonthDays(currentMonthCalendar[0]);
	const nextMonthDays = addNextMonthDays(
		currentMonthCalendar[currentMonthCalendar.length - 1],
	);

	// 前月、今月、次月を結合
	const fullCalendar = [
		...previousMonthDays,
		...currentMonthCalendar,
		...nextMonthDays,
	];

	// 週ごとに分ける
	return groupByWeek(fullCalendar);
};

export const useCalendar = (initSchedules: Schedule[]) => {
	const [count, setCount] = useState<number>(0);
	const [days, setDays] = useState<WeeklyDay[]>(getCalendarDays(0)); //初期値を設定する
	const [year, setYear] = useState<string>(dayTextCommon('YYYY'));
	const [month, setMonth] = useState<MonthString>(
		dayTextCommon('MM') as MonthString,
	);
	const [day, setDay] = useState<DayString>(dayTextCommon('DD') as DayString);
	const [schedules, setSchedules] = useState<Schedule[]>(initSchedules);

	const onGetSchedules = useCallback(async (y: number, m: number) => {
		const schedule = await getSchedule(y, m);
		setSchedules(schedule);
	}, []);

	const setNowYearAndMonth = useCallback(
		async (val: number) => {
			const targetDate = dayjs().add(val, 'month');
			const y = targetDate.format('YYYY');
			const m = targetDate.format('MM') as MonthString;

			setYear(y);
			setMonth(m);

			await onGetSchedules(Number(y), Number(m));
		},
		[onGetSchedules],
	);

	// 月を変える
	const changeMonth = useAsyncLoading(
		useCallback(
			async (c: number) => {
				setCount(c);
				setDays(getCalendarDays(c));
				await setNowYearAndMonth(c);
			},
			[setCount, setNowYearAndMonth],
		),
	);

	// 年と月を変える
	const changeYearAndMonth = useCallback(
		async (year: string, month: string) => {
			const now = dayTextCommon('YYYY-MM');
			const nowYAndM = dayjs(now);
			const sltYAndM = dayjs(`${year}-${month}`);
			const c = sltYAndM.diff(nowYAndM, 'month');

			await changeMonth(c);
		},
		[changeMonth],
	);

	// 今見ているカレンダーが実際の現在の年月かどうか
	const isNowMonth = useMemo(() => count === 0, [count]);

	const getScheduleOnTheDate = useCallback(
		(day: string): ScheduleSummary[] => {
			const dateObj = dayjs(day);
			const targetYear = Number(dateObj.format('YYYY'));
			const targetMonth = Number(dateObj.format('M'));
			const targetDay = Number(dateObj.format('D'));

			return schedules
				.filter((schedule) => {
					const { year, month, day } = schedule;

					return (
						Number(year) === targetYear &&
						Number(month) === targetMonth &&
						Number(day) === targetDay
					);
				})
				.map((schedule) => {
					const { id, title, scheduleTypes } = schedule;
					return { id, title, scheduleTypes };
				});
		},
		[schedules],
	);

	return {
		count,
		days,
		year,
		month,
		day,
		schedules,
		isNowMonth,
		changeMonth,
		changeYearAndMonth,
		getScheduleOnTheDate,
		onGetSchedules,
		setDay,
	};
};
