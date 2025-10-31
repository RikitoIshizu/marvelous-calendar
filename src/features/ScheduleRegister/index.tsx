'use client';
import CloseIcon from 'assets/svgs/cross.svg';
import { Button } from 'components/Button';
import dayjs from 'dayjs';
import { InputDate } from 'features/ScheduleRegister/Components/InputDate';
import { ScheduleTime } from 'features/ScheduleRegister/Components/ScheduleTime';
import { useAsyncLoading } from 'hooks/useAsyncLoading';
import { useRegisterSchedule } from 'hooks/useRegisterSchedule';
import { FormEvent, useCallback, useMemo } from 'react';
import ReactModal from 'react-modal';
import { dayTextCommon } from 'utils/calendar';
import { InputDescription } from './Components/InputDescription';
import { InputTitle } from './Components/InputTitle';
import { ScheduleTypes } from './Components/ScheduleTypes';

const customStyles = {
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

type Schedule = Parameters<typeof useRegisterSchedule>['0'];

type Props = {
	isModalOpen: boolean;
	type: 'register' | 'edit';
	shouldHideDateArea: boolean;
	onOpenModal: (_: boolean) => void;
	onCloseModal: () => void;
	schedule: Schedule;
	date: string;
};

export const ScheduleRegister = ({
	isModalOpen,
	type,
	shouldHideDateArea,
	onOpenModal,
	onCloseModal,
	schedule: inputSchedule,
	date,
}: Props) => {
	// scheduleの初期化
	const schedule = useMemo(
		() => ({
			start_hour: inputSchedule.start_hour,
			start_minute: inputSchedule.start_minute,
			end_hour: inputSchedule.end_hour,
			end_minute: inputSchedule.end_minute,
			year: Number(dayTextCommon('YYYY', date)),
			month: Number(dayTextCommon('MM', date)),
			day: Number(dayTextCommon('DD', date)),
			...(type === 'edit' && {
				id: inputSchedule.id,
				title: inputSchedule.title,
				description: inputSchedule.description,
				scheduleTypes: inputSchedule.scheduleTypes,
				year: inputSchedule.year,
				month: inputSchedule.month,
				day: inputSchedule.day,
			}),
		}),
		[inputSchedule, date, type],
	);

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

	const onSuccess = useCallback(() => {
		alert('スケジュールが登録されました。');
		onOpenModal(true);
	}, [onOpenModal]);

	const onSubmitAction = useAsyncLoading(
		useCallback(
			async (e: FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				type === 'register'
					? await registerSchedule(onSuccess)
					: await editSchedule(onSuccess);
			},
			[type, onSuccess, registerSchedule, editSchedule],
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

		return false;
	}, [
		startHour,
		startMinute,
		endHour,
		endMinute,
		day,
		month,
		year,
		setTimeError,
	]);

	const isSubmitDisabled = useMemo(() => {
		return !title || !description || validateTime();
	}, [title, description, validateTime]);

	const onChangeYear = useCallback(
		(selectedYear: string) => {
			changeYear(selectedYear, month, day);
		},
		[changeYear, month, day],
	);

	const onChangeMonth = useCallback(
		(selectedMonth: string) => {
			changeMonth(year, selectedMonth, day);
		},
		[changeMonth, year, day],
	);

	return (
		<ReactModal
			isOpen={isModalOpen}
			ariaHideApp={false}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<button className="absolute top-0 left-[10px]" onClick={onCloseModal}>
				<CloseIcon className="!w-6 aspect-square" />
			</button>
			<div className="text-center text-3xl font-bold mb-4">予定を登録</div>
			<form onSubmit={(e: FormEvent<HTMLFormElement>) => onSubmitAction(e)}>
				<dl className="grid grid-cols-[auto_1fr] gap-3 items-start">
					{!shouldHideDateArea && type === 'register' && (
						<InputDate
							year={year}
							month={month}
							day={day}
							yearList={yearList}
							nowMonthList={nowMonthList}
							nowDayList={nowDayList}
							onChangeYear={onChangeYear}
							onChangeMonth={onChangeMonth}
							onChangeDay={setDay}
						/>
					)}
					<ScheduleTime
						startHour={startHour}
						startMinute={startMinute}
						endHour={endHour}
						endMinute={endMinute}
						timeError={timeError}
						onChangeStartHour={setStartHour}
						onChangeStartMinute={setStartMinute}
						onChangeEndHour={setEndHour}
						onChangeEndMinute={setEndMinute}
						onBlur={validateTime}
					/>
					<ScheduleTypes
						scheduleType={scheduleType}
						onEventCallBack={(e: string) => setScheduleType(Number(e))}
					/>
					<InputTitle
						title={title ?? ''}
						titleError={titleError}
						onChangeTitle={setTitle}
						onBlur={validateTitle}
					/>
					<InputDescription
						description={description ?? ''}
						descriptionError={descriptionError}
						onchangeDescription={setDescription}
						onBlur={validateDescription}
					/>
				</dl>
				<div className="text-center mt-5">
					<Button
						type="submit"
						text="登録"
						disabled={isSubmitDisabled}
						buttonColor="bg-[#a7f3d0]"
						otherClasses="h-[50px]"
					/>
				</div>
			</form>
		</ReactModal>
	);
};
