'use Client';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { amountOfDay, dayTextCommmon } from 'shared/calendar';
import { DayString, MonthString, SchduleRegisterInput } from 'types/types';
import { registerScheduleDetail, updateSchedule } from '../apis/supabase';

export const useRegisterSchedule = (schedule: SchduleRegisterInput) => {
	// 入力項目
	const [year, setYear] = useState<string>(
		schedule.year?.toString() || dayTextCommmon('YYYY'),
	);
	const [month, setMonth] = useState<string>(
		schedule.month?.toString() || dayTextCommmon('MM'),
	);
	const [day, setDay] = useState<string>(
		schedule.day?.toString() || dayTextCommmon('DD'),
	);
	const [title, setTitle] = useState<SchduleRegisterInput['title']>(
		schedule.title || '',
	);
	const [startHour, setStartHour] = useState<
		SchduleRegisterInput['start_hour']
	>(schedule.start_hour);
	const [startMinute, setStartMinute] = useState<
		SchduleRegisterInput['start_minute']
	>(schedule.start_minute);
	const [endHour, setEndHour] = useState<SchduleRegisterInput['end_hour']>(
		schedule.end_hour,
	);
	const [endMinute, setEndMinute] = useState<
		SchduleRegisterInput['end_minute']
	>(schedule.end_minute);
	const [description, setDescription] = useState<
		SchduleRegisterInput['description']
	>(schedule.description || '');
	const [scheduleType, setScheduleType] = useState<
		SchduleRegisterInput['scheduleTypes']
	>(schedule.scheduleTypes || 1);

	// カレンダーの選択リストの初期値設定用の処理
	const firstSetCalendar = useCallback(() => {
		const nowYearAndMonth = `${year}-${month}`;

		let yearList: string[] = [String(year)];
		let monthList: string[] = [];
		let dayList: string[] = [];

		// 年(今月から10年後までの年を選択できるようにする)
		for (var i = 1; i <= 9; i++) {
			const setYear = dayjs(`${year}-01`).add(i, 'year').format('YYYY');
			yearList = [...yearList, setYear];
		}

		// 月(今年の今月以降の月を選択できるようにする)
		for (var n = 1; n <= 12; n++) {
			n >= Number(month) && (monthList = [...monthList, String(n)]);
		}

		// 日(当日より後の日だけ選択できるようにする)
		for (var m = 1; m <= amountOfDay(nowYearAndMonth); m++) {
			const day = String(m).padStart(2, '0');

			const checkData = dayjs(`${nowYearAndMonth}-${day}`);
			const dateCheck = checkData.isAfter(dayjs());

			dateCheck && (dayList = [...dayList, day]);
		}

		return {
			yearList,
			monthList,
			dayList,
		};
	}, [month, year]);

	const yearList = useMemo(
		() => firstSetCalendar().yearList,
		[firstSetCalendar],
	);

	// カレンダーの月日のリスト
	const [nowMonthList, setMonthList] = useState<string[]>(
		firstSetCalendar().monthList,
	);
	const [nowDayList, setDayList] = useState<string[]>(
		firstSetCalendar().dayList,
	);

	// バリデーション
	const [titleError, setTitleError] = useState<string>('');
	const [descriptionError, setDescriptionError] = useState<string>('');
	const [timeError, setTimeError] = useState<string>('');

	const changeYear = useCallback(
		(selectedYear: string, selectedMonth: string, selectedDay: string) => {
			// まずは年を選択した年にセットする
			setYear(() => selectedYear);

			const selectedDate = `${selectedYear}-${String(selectedMonth).padStart(
				2,
				'0',
			)}-${String(selectedDay).padStart(2, '0')}`;

			const today = dayTextCommmon('YYYY-MM-DD');

			let monthList: MonthString[] = [];
			let dayList: DayString[] = [];

			const thisMonthAmount = amountOfDay(dayTextCommmon('YYYY-MM'));
			const thisYear = Number(dayTextCommmon('YYYY'));

			// 選択した年が過去の日になっちゃった時
			if (
				dayjs(selectedDate).isBefore(today) ||
				thisYear === Number(selectedYear)
			) {
				const todayMonth = dayjs().month() + 1;
				const todayDay = dayjs().date();

				for (var m = todayMonth; m <= 12; m++) {
					monthList = [...monthList, String(m).padStart(2, '0') as MonthString];
				}

				for (var d = todayDay + 1; d <= thisMonthAmount; d++) {
					dayList = [...dayList, String(d).padStart(2, '0') as DayString];
				}

				// さらに選択している月と日が過去の日になっちゃっている時
				if (Number(selectedMonth) < todayMonth) {
					setMonth(() => String(todayMonth).padStart(2, '0'));
				}

				if (Number(selectedDay) < todayDay) {
					setDay(() => String(todayDay + 1).padStart(2, '0'));
				}
			} else {
				// 違う時は月と日のリストを作り直す
				for (var mo = 1; mo <= 12; mo++) {
					monthList = [
						...monthList,
						String(mo).padStart(2, '0') as MonthString,
					];
				}

				for (var da = 1; da <= thisMonthAmount; da++) {
					dayList = [...dayList, String(da).padStart(2, '0') as DayString];
				}
			}

			setMonthList(monthList);
			setDayList(dayList);
		},
		[setDay],
	);

	const changeMonth = useCallback(
		(selectedYear: string, selectedMonth: string, selectedDay: string) => {
			// まずは月を選択した月にセットする
			setMonth(selectedMonth);

			// 今月なら当日以前の日付が選択されていないかを確認しないといけない
			const selectedYearAndMonth = `${selectedYear}-${String(
				selectedMonth,
			).padStart(2, '0')}`;
			const nowMonth = dayTextCommmon('YYYY-MM');

			const amountOfMonth = amountOfDay(selectedYearAndMonth);

			let dayList: DayString[] = [];

			if (selectedYearAndMonth === nowMonth) {
				const today = dayjs();
				for (var i = 1; i <= amountOfMonth; i++) {
					const day = String(i).padStart(2, '0');
					const date = `${selectedYearAndMonth}-${day}`;
					const checkDay = dayjs(date);

					checkDay.isAfter(today) && (dayList = [...dayList, day as DayString]);
				}

				const nowSelectedDay = String(Number(selectedDay)).padStart(
					2,
					'0',
				) as DayString;

				!dayList.includes(nowSelectedDay) && setDay(nowSelectedDay);
			} else {
				for (var n = 1; n <= amountOfMonth; n++) {
					dayList = [...dayList, String(n).padStart(2, '0') as DayString];
				}

				Number(selectedDay) > amountOfMonth && setDay(String(amountOfMonth));
			}

			setDayList(dayList);
		},
		[setDay],
	);

	const clearErrorMessages = useCallback(() => {
		setTitleError('');
		setDescriptionError('');
		setTimeError('');
	}, []);

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
			clearErrorMessages,
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
			clearErrorMessages,
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
