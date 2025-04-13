'use Client';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { amountOfDay, dayTextCommmon } from 'shared/calendar';
import { registerScheduleDetail, updateSchedule } from 'shared/supabase';
import { Hour, Minute } from 'shared/time';
import { Schedule } from 'types/types';

export const useRegisterSchedule = (
	schedule: Pick<
		Schedule,
		| 'year'
		| 'month'
		| 'day'
		| 'start_hour'
		| 'start_minute'
		| 'end_hour'
		| 'end_minute'
	> &
		Partial<Pick<Schedule, 'id' | 'title' | 'description' | 'scheduleTypes'>>,
) => {
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
	const [title, setTitle] = useState<Schedule['title']>(schedule.title || '');
	const [startHour, setStartHour] = useState<Hour>(schedule.start_hour as Hour);
	const [startMinute, setStartMinute] = useState<Minute>(
		schedule.start_minute as Minute,
	);
	const [endHour, setEndHour] = useState<Hour>(schedule.end_hour as Hour);
	const [endMinute, setEndMinute] = useState<Minute>(
		schedule.end_minute as Minute,
	);
	const [description, setDescription] = useState<Schedule['description']>(
		schedule.description || '',
	);
	const [scheduleType, setScheduleType] = useState<Schedule['scheduleTypes']>(
		schedule.scheduleTypes || 1,
	);

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

	const yearList = firstSetCalendar().yearList;

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
	// const [isAveilableSubmit, setIsAveilableSubmit] = useState<boolean>(true);

	const changeYear = useCallback(
		(selectedYear: string, selectedMonth: string, selectedDay: string) => {
			// まずは年を選択した年にセットする
			setYear(() => selectedYear);

			const selectedDate = `${selectedYear}-${String(selectedMonth).padStart(
				2,
				'0',
			)}-${String(selectedDay).padStart(2, '0')}`;

			const today = dayTextCommmon('YYYY-MM-DD');

			let monthList: string[] = [];
			let dayList: string[] = [];

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
					monthList = [...monthList, String(m).padStart(2, '0')];
				}

				for (var d = todayDay + 1; d <= thisMonthAmount; d++) {
					dayList = [...dayList, String(d).padStart(2, '0')];
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
					monthList = [...monthList, String(mo).padStart(2, '0')];
				}

				for (var da = 1; da <= thisMonthAmount; da++) {
					dayList = [...dayList, String(da).padStart(2, '0')];
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

			let dayList: string[] = [];

			if (selectedYearAndMonth === nowMonth) {
				const today = dayjs();
				for (var i = 1; i <= amountOfMonth; i++) {
					const day = String(i).padStart(2, '0');
					const date = `${selectedYearAndMonth}-${day}`;
					const checkDay = dayjs(date);

					checkDay.isAfter(today) && (dayList = [...dayList, day]);
				}

				const nowSelectedDay = String(Number(selectedDay)).padStart(2, '0');

				!dayList.includes(nowSelectedDay) && setDay(nowSelectedDay);
			} else {
				for (var n = 1; n <= amountOfMonth; n++) {
					dayList = [...dayList, String(n).padStart(2, '0')];
				}

				Number(selectedDay) > amountOfMonth && setDay(String(amountOfMonth));
			}

			setDayList(dayList);
		},
		[setDay],
	);

	// const isStartAfterEnd = Number(startHour) >= Number(endHour);

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
			// isStartAfterEnd,
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
			// isStartAfterEnd,
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
		// isAveilableSubmit,
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
		// setIsAveilableSubmit,
	};
};
