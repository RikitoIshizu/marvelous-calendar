'use client';
import { Button } from 'components/Button';
import { InputDescription } from 'components/Input/InputDescription';
import { InputTitle } from 'components/Input/InputTitle';
import { Select } from 'components/Select';
import dayjs from 'dayjs';
import { useAsyncLoading } from 'hooks/useAsyncLoading';
import { useRegisterSchedule } from 'hooks/useRegisterSchedule';
import { FormEvent, useCallback, useMemo } from 'react';
import { ScheduleTypes } from 'shared/SchduleRegister/ScheduleTypes';
import { Hour, Minute } from 'shared/time';
import { ScheduleTime } from './ScheduleTime';

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

	const onSubmitAction = useAsyncLoading(
		useCallback(
			async (e: FormEvent<Element>) => {
				e.preventDefault();
				props.type === 'register'
					? await registerSchedule(props.onEventCallBack)
					: await editSchedule(props.onEventCallBack);
			},
			[props.type, props.onEventCallBack, registerSchedule, editSchedule],
		),
	);

	const validateTitle = useCallback(() => {
		setTitleError(!title ? 'タイトルを入力してください。' : '');
	}, [title, setTitleError]);

	const validateDescription = useCallback(() => {
		setDescriptionError(
			!description ? 'スケジュールの詳細を入力してください。' : '',
		);
	}, [description, setDescriptionError]);

	const validateTime = useCallback(() => {
		setTimeError('');
		// はじまりと終わりの時間が同じかどうか
		const isSameStartAndEnd =
			startHour === endHour && startMinute === endMinute;

		if (isSameStartAndEnd) {
			setTimeError('はじめと終わりの時間が同じです。');
			return true;
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
		}

		// かぶってるスケジュールがないか
		const isDuplicatedTime = registeredSchedules.some((schedule) => {
			// 日付一致しているか
			const registeredDate = `${schedule.year}-${String(schedule.month).padStart(2, '0')}-${String(schedule.day).padStart(2, '0')}`;
			const registeringDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
			if (registeredDate !== registeringDate) return;

			// 登録しようとしている日時
			const registeringStartTime = dayjs(
				`${registeringDate} ${startHour}:${startMinute}`,
			);
			const registeringEndTime = dayjs(
				`${registeringDate} ${endHour}:${endMinute}`,
			);

			// 登録済みの日時
			const registeredStartTime = dayjs(
				`${registeredDate} ${schedule.start_hour}:${schedule.start_minute}`,
			);
			const registeredEndTime = dayjs(
				`${registeredDate} ${schedule.end_hour}:${schedule.end_minute}`,
			);

			const isStartTimeBetweenRegisteredStartAndEndTime =
				registeredStartTime.isAfter(registeringStartTime) &&
				registeredStartTime.isBefore(registeringEndTime);

			const isEndTimeBetweenRegisteredStartAndEndTime =
				registeredEndTime.isAfter(registeringStartTime) &&
				registeredEndTime.isBefore(registeringEndTime);

			return (
				isStartTimeBetweenRegisteredStartAndEndTime ||
				isEndTimeBetweenRegisteredStartAndEndTime
			);
		});

		setTimeError(isDuplicatedTime ? 'スケジュールが被ってます。' : '');
		return isDuplicatedTime;
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

	const isAvailableSubmit = useMemo(() => {
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
				onBlur={validateDescription}
			/>
			<div className="text-center mt-5">
				<Button
					type="submit"
					text="登録"
					disabled={isAvailableSubmit}
					buttonColor="bg-[#a7f3d0]"
					otherClasses="h-[50px]"
				/>
			</div>
		</form>
	);
};
