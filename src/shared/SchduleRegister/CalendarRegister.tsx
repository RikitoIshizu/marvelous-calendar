'use client';
import { Button } from 'components/Button';
import { InputDescription } from 'components/Input/InputDescription';
import { InputTitle } from 'components/Input/InputTitle';
import { Select } from 'components/Select';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import { useRegisterSchedule } from 'hooks/useRegisterSchedule';
import { FormEvent, useCallback, useMemo } from 'react';
import { ScheduleTypes } from 'shared/SchduleRegister/ScheduleTypes';
import { Hour, Minute } from 'shared/time';
import { ScheduleTime } from './ScheduleTime';

dayjs.extend(isLeapYear);

type Schedule = Parameters<typeof useRegisterSchedule>['0'];

type Props = {
	onEventCallBack: () => void; // TODO: 命名がよくないから後で変えたい
	type: 'register' | 'edit';
	shouldHideDateArea: boolean;
	schedule: Schedule;
	registeredSchedules: Schedule[];
};

// TODO: ここの入力項目が引用元に依存してるので、修正予定
export const CalendarRegister = (props: Props) => {
	const { schedule, registeredSchedules } = props;

	const {
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
	} = useRegisterSchedule(schedule);

	const onSubmitAction = useCallback(
		(e: FormEvent<Element>) => {
			e.preventDefault();
			props.type === 'register'
				? registerSchedule(props.onEventCallBack)
				: editSchedule(props.onEventCallBack);
		},
		[props.type, props.onEventCallBack, registerSchedule, editSchedule],
	);

	const validateTitle = useCallback(() => {
		setTitleError(!title ? 'タイトルを入力してください。' : '');
	}, [title, setTitleError]);

	const validateDescriotion = useCallback(() => {
		setDescriptionError(
			!description ? 'スケジュールの詳細を入力してください。' : '',
		);
	}, [description, setDescriptionError]);

	const validateTime = useCallback(() => {
		// はじまりと終わりの時間が同じかどうか
		const isSameStartAndEnd =
			startHour === endHour && startMinute === endMinute;

		if (isSameStartAndEnd) {
			setTimeError('はじめと終わりの時間が同じです。');
			return true;
		} else {
			setTimeError('');
		}

		// はじまりの時間が終わりを超えていないかどうか
		const registerDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		const startDateAndTime = `${registerDate} ${startHour}:${startMinute}`;
		const endDateAndTime = `${registerDate} ${endHour}:${endMinute}`;

		if (dayjs(startDateAndTime).isAfter(dayjs(endDateAndTime))) {
			setTimeError(
				'スケジュールのはじまりの時間が終わりの時間を超えています。',
			);
			return true;
		} else {
			setTimeError('');
		}

		// かぶってるスケジュールがないか
		const isDuplecatedHour = registeredSchedules.some((schedule) => {
			const registeredStart = `${schedule.start_hour}:${schedule.start_minute}`;
			const registerStart = `${startHour}:${startMinute}`;
			const registeredEnd = `${schedule.end_hour}:${schedule.end_minute}`;
			const registerEnd = `${endHour}:${endMinute}`;

			return registeredStart === registerStart || registeredEnd === registerEnd;
		});

		if (isDuplecatedHour) {
			setTimeError('スケジュールが被ってます。');
			return true;
		} else {
			setTimeError('');
			return false;
		}
	}, [
		startHour,
		startMinute,
		endHour,
		endMinute,
		day,
		month,
		registeredSchedules,
		year,
		setTimeError,
	]);

	const isAveilableSubmit = useMemo(() => {
		return !title || !description || validateTime();
	}, [title, description, validateTime]);

	return (
		<form onSubmit={(e: FormEvent<Element>) => onSubmitAction(e)}>
			{!props.shouldHideDateArea && props.type === 'register' && (
				<div className="mt-3 flex items-center">
					<label htmlFor="date" className="mr-2">
						日付:
					</label>
					<Select
						name="year"
						value={year}
						selectList={yearList}
						suffix="年"
						onEventCallBack={(year: string) => {
							changeYear(year, month, day);
						}}
					/>
					<Select
						name="month"
						value={month}
						selectList={nowMonthList}
						suffix="月"
						onEventCallBack={(month: string) => {
							changeMonth(year, month, day);
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
				onChangeStartHour={(hour: Hour) => setStartHour(hour)}
				onChangeStartMinute={(minute: Minute) => setStartMinute(minute)}
				onChangeEndHour={(hour: Hour) => setEndHour(hour)}
				onChangeEndMinute={(minute: Minute) => setEndMinute(minute)}
				onBlur={validateTime}
			/>
			{timeError && <p className="text-xs text-[red]">{timeError}</p>}
			<ScheduleTypes
				scheduleType={scheduleType}
				onEventCallBack={(e: string) => setScheduleType(Number(e))}
			/>
			<InputTitle
				title={title!}
				titleError={titleError}
				onChangeTitle={(text: string) => setTitle(text)}
				onBlur={validateTitle}
			/>
			<InputDescription
				description={description!}
				descriptionError={descriptionError}
				onchangeDescription={(text: string) => setDescription(text)}
				onBlur={validateDescriotion}
			/>
			<div className="text-center mt-5">
				<Button
					type="submit"
					text="登録"
					disabled={isAveilableSubmit}
					buttonColor="bg-[#a7f3d0]"
					otherClasses="h-[50px]"
				/>
			</div>
		</form>
	);
};
