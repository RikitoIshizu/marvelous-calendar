'use client';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import React, {
	FormEvent,
	useCallback,
	useEffect,
	useState,
	useRef,
} from 'react';
import { Select } from 'components/Select';
import { Button } from 'components/Button';
import { InputTitle } from 'components/Input/InputTitle';
import { ScheduleTypes } from 'components/ScheduleTypes';
import { amountOfDay, dayTextCommmon } from 'shared/calendar';
import { registerScheduleDetail, updateSchedule } from 'shared/supabase';
import { InputDescription } from 'components/Input/InputDescription';
import { Schedule } from 'types/types';
import { ScheduleTime } from '../components/ScheduleTime';
import { Hour, Minute } from 'shared/time';

dayjs.extend(isLeapYear);

type Props = {
	onEventCallBack: () => void; // TODO: 命名がよくないから後で変えたい
	type: 'register' | 'edit';
	shouldHideDateArea: boolean;
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
		Partial<Pick<Schedule, 'id' | 'title' | 'description' | 'scheduleTypes'>>;
};

// TODO: ここの入力項目が引用元に依存してるので、修正予定
export const CalendarRegister = (props: Props) => {
	const { schedule } = props;
	const isDisplay = useRef<boolean>(false);

	// TODO: hooksにまとめる
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
	const [startHour, setStartHour] = useState<Hour>(
		(schedule.start_hour as Hour) || '00',
	);
	const [startMinute, setStartMinute] = useState<Minute>(
		(schedule.start_minute as Minute) || '00',
	);
	const [endHour, setEndHour] = useState<Hour>(
		(schedule.end_hour as Hour) || '00',
	);
	const [endMinute, setEndMinute] = useState<Minute>(
		(schedule.end_minute as Minute) || '00',
	);
	const [description, setDescription] = useState<Schedule['description']>(
		schedule.description || '',
	);
	const [type, setType] = useState<Schedule['scheduleTypes']>(
		schedule.scheduleTypes || 1,
	);

	// カレンダーの年月日のリスト
	const [nowYearList, setYearList] = useState<string[]>([]);
	const [nowMonthList, setMonthList] = useState<string[]>([]);
	const [nowDayList, setDayList] = useState<string[]>([]);

	// バリデーション
	const [titleError, setTitleError] = useState<string>('');
	const [descriptionError, setDescriptionError] = useState<string>('');
	const [timeError, setTimeError] = useState<string>('');

	// カレンダーを読み込んだ時に選択できる年月日を設定する
	const firstSetCalendar = useCallback(() => {
		const nowYearAndMonth = `${year}-${month}`;

		let yearList: string[] = [year.toString()];
		let monthList: string[] = [];
		let dayList: string[] = [];

		// 年(今月から10年後までの年を選択できるようにする)
		for (var i = 1; i <= 9; i++) {
			const setYear = dayjs(`${year}-01`).add(i, 'year').format('YYYY');
			yearList = [...yearList, setYear];
		}

		// 月(今年の今月以降の月を選択できるようにする)
		for (var n = 1; n <= 12; n++) {
			n >= Number(month) && (monthList = [...monthList, n.toString()]);
		}

		// 日(当日より後の日だけ選択できるようにする)
		for (var m = 1; m <= amountOfDay(nowYearAndMonth); m++) {
			const day = m.toString().padStart(2, '0');

			const checkData = dayjs(`${nowYearAndMonth}-${day}`);
			const dateCheck = checkData.isAfter(dayjs());

			dateCheck && (dayList = [...dayList, day]);
		}

		setYearList(yearList);
		setMonthList(monthList);
		setDayList(dayList);
	}, [month, year]);

	const onChangeYear = useCallback(
		(selectedYear: string, selectedMonth: string, selectedDay: string) => {
			// まずは年を選択した年にセットする
			setYear(() => selectedYear);

			const selectedDate = `${selectedYear}-${selectedMonth
				.toString()
				.padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

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
					monthList = [...monthList, m.toString().padStart(2, '0')];
				}

				for (var d = todayDay + 1; d <= thisMonthAmount; d++) {
					dayList = [...dayList, d.toString().padStart(2, '0')];
				}

				// さらに選択している月と日が過去の日になっちゃっている時
				if (Number(selectedMonth) < todayMonth) {
					setMonth(() => todayMonth.toString().padStart(2, '0'));
				}

				if (Number(selectedDay) < todayDay) {
					setDay(() => (todayDay + 1).toString().padStart(2, '0'));
				}
			} else {
				// 違う時は月と日のリストを作り直す
				for (var mo = 1; mo <= 12; mo++) {
					monthList = [...monthList, mo.toString().padStart(2, '0')];
				}

				for (var da = 1; da <= thisMonthAmount; da++) {
					dayList = [...dayList, da.toString().padStart(2, '0')];
				}
			}

			setMonthList(monthList);
			setDayList(dayList);
		},
		[setDay],
	);

	const onChangeMonth = useCallback(
		(selectedYear: string, selectedMonth: string, selectedDay: string) => {
			// まずは月を選択した月にセットする
			setMonth(selectedMonth);

			// 今月なら当日以前の日付が選択されていないかを確認しないといけない
			const selectedYearAndMonth = `${selectedYear}-${selectedMonth
				.toString()
				.padStart(2, '0')}`;
			const nowMonth = dayTextCommmon('YYYY-MM');

			const amountOfMonth = amountOfDay(selectedYearAndMonth);

			let dayList: string[] = [];

			if (selectedYearAndMonth === nowMonth) {
				const today = dayjs();
				for (var i = 1; i <= amountOfMonth; i++) {
					const day = i.toString().padStart(2, '0');
					const date = `${selectedYearAndMonth}-${day}`;
					const checkDay = dayjs(date);

					checkDay.isAfter(today) && (dayList = [...dayList, day]);
				}

				const nowSelectedDay = Number(selectedDay).toString().padStart(2, '0');

				!dayList.includes(nowSelectedDay) && setDay(nowSelectedDay);
			} else {
				for (var n = 1; n <= amountOfMonth; n++) {
					dayList = [...dayList, n.toString().padStart(2, '0')];
				}

				Number(selectedDay) > amountOfMonth && setDay(amountOfMonth.toString());
			}

			setDayList(dayList);
		},
		[setDay],
	);

	const registerSchedule = useCallback(
		async (e: FormEvent<Element>) => {
			e.preventDefault();
			setTitleError(!title ? 'タイトルを入力してください。' : '');
			setDescriptionError(
				!description ? 'スケジュールの詳細を入力してください。' : '',
			);
			const isStartAfterEnd = Number(startHour) >= Number(endHour);
			setTimeError(isStartAfterEnd ? 'スケジュールの時間が不適切です。' : '');
			if (!title && !description && isStartAfterEnd) return;

			const response =
				props.type === 'register'
					? await registerScheduleDetail({
							year: Number(year),
							month: Number(month),
							day: Number(day),
							title,
							description,
							scheduleTypes: type,
							start_hour: startHour,
							start_minute: startMinute,
							end_hour: endHour,
							end_minute: endMinute,
						})
					: await updateSchedule({
							id: Number(schedule?.id),
							title,
							description,
							scheduleTypes: type,
							start_hour: startHour,
							start_minute: startMinute,
							end_hour: endHour,
							end_minute: endMinute,
						});
			if (!response) {
				alert('スケジュール登録完了！');
				setTitleError('');
				setDescriptionError('');
				return props.onEventCallBack();
			}
		},
		[
			day,
			description,
			month,
			year,
			type,
			title,
			props,
			startHour,
			startMinute,
			endHour,
			endMinute,
			schedule.id,
		],
	);

	// TODO: stateの更新はuseEffectでやるべきじゃないので、のちに修正予定
	useEffect(() => {
		if (!isDisplay.current) {
			isDisplay.current = true;
			firstSetCalendar();
		}
	}, [firstSetCalendar]);

	return (
		<form onSubmit={(e: FormEvent<Element>) => registerSchedule(e)}>
			{!props.shouldHideDateArea && props.type === 'register' && (
				<div className="mt-3 flex items-center">
					<label htmlFor="date" className="mr-2">
						日付:
					</label>
					<Select
						name="year"
						value={year}
						selectList={nowYearList}
						suffix="年"
						onEventCallBack={(year: string) => {
							onChangeYear(year, month, day);
						}}
					/>
					<Select
						name="month"
						value={month}
						selectList={nowMonthList}
						suffix="月"
						onEventCallBack={(month: string) => {
							onChangeMonth(year, month, day);
						}}
					/>
					<Select
						name="day"
						value={day}
						selectList={nowDayList}
						suffix="日"
						onEventCallBack={(day: string) => {
							setDay(day);
						}}
					/>
				</div>
			)}
			<ScheduleTime
				startHour={startHour}
				startMinute={startMinute}
				endHour={endHour}
				endMinute={endMinute}
				onChangeStartHour={setStartHour}
				onChangeStartMinute={setStartMinute}
				onChangeEndHour={setEndHour}
				onChangeEndMinute={setEndMinute}
			/>
			{timeError && <p className="text-xs text-[red]">{timeError}</p>}
			<ScheduleTypes
				type={type}
				onEventCallBack={(e: string) => setType(Number(e))}
			/>
			<InputTitle
				title={title!}
				titleError={titleError}
				onChangeTitle={(text: string) => setTitle(text)}
			/>
			<InputDescription
				description={description!}
				descriptionError={descriptionError}
				onchangeDescription={(text: string) => setDescription(text)}
			/>
			<div className="text-center mt-5">
				<Button
					type="submit"
					text="登録"
					buttonColor="bg-[#a7f3d0]"
					otherClasses="h-[50px]"
				/>
			</div>
		</form>
	);
};
