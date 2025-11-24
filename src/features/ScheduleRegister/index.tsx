'use client';
import CloseIcon from 'assets/svgs/cross.svg';
import { Button } from 'components/Button';
import dayjs from 'dayjs';
import { InputDate } from 'features/ScheduleRegister/Components/InputDate';
import { ScheduleTime } from 'features/ScheduleRegister/Components/InputTime';
import { useAsyncLoading } from 'hooks/useAsyncLoading';
import { useRegisterSchedule } from 'hooks/useRegisterSchedule';
import { FormEvent, memo, useCallback, useMemo } from 'react';
import ReactModal from 'react-modal';
import { dayTextCommon } from 'utils/calendar';
import { InputDescription } from './Components/InputDescription';
import { ScheduleTypes } from './Components/InputScheduleTypes';
import { InputTitle } from './Components/InputTitle';

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

type Schedule = Parameters<typeof useRegisterSchedule>[number];

type Props = {
	isModalOpen: boolean;
	type: 'register' | 'edit';
	shouldHideDateArea: boolean;
	onOpenModal: (_: boolean) => void;
	onCloseModal: () => void;
	schedule: Schedule;
	date: string;
};

// モーダルの閉じるボタン
const CloseButton = memo(function CloseButton({
	onCloseModal,
}: {
	onCloseModal: Props['onCloseModal'];
}) {
	return (
		<button className="absolute top-0 left-[10px]" onClick={onCloseModal}>
			<CloseIcon className="!w-6 aspect-square" />
		</button>
	);
});

export const ScheduleRegister = ({
	isModalOpen,
	type,
	shouldHideDateArea,
	onOpenModal,
	onCloseModal,
	schedule: inputSchedule,
	date,
}: Props) => {
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

	const onRegisterSchedule = useCallback(async () => {
		const onSuccess = () => {
			alert('スケジュールが登録されました。');
			onOpenModal(true);
		};

		try {
			await registerSchedule(onSuccess);
		} catch {
			alert('スケジュールの作成に失敗しました。');
		}
	}, [registerSchedule, onOpenModal]);

	const onEditSchedule = useCallback(async () => {
		const onSuccess = () => {
			alert('スケジュールの変更が完了しました。');
			onOpenModal(true);
		};

		try {
			await editSchedule(onSuccess);
		} catch {
			alert('スケジュールの変更に失敗しました。');
		}
	}, [editSchedule, onOpenModal]);

	// 登録と変更
	const submitAction = useAsyncLoading(
		useCallback(
			async (e: FormEvent<HTMLFormElement>) => {
				e.preventDefault();

				if (type === 'register') {
					await onRegisterSchedule();
				} else {
					await onEditSchedule();
				}
			},
			[type, onRegisterSchedule, onEditSchedule],
		),
	);

	// タイトルが入力されているか
	const validateTitle = (): void => {
		setTitleError(!title ? 'タイトルを入力してください。' : '');
	};

	// 説明文が入力されているか
	const validateDescription = (): void => {
		setDescriptionError(
			!description ? 'スケジュールの詳細を入力してください。' : '',
		);
	};

	// 時間が適切に入力されているか
	const checkTimeError = (): boolean => {
		const isSameStartAndEnd =
			startHour === endHour && startMinute === endMinute;

		if (isSameStartAndEnd) return true;

		const registerDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		const startDateAndTime = `${registerDate} ${startHour}:${startMinute}`;
		const endDateAndTime = `${registerDate} ${endHour}:${endMinute}`;

		return dayjs(startDateAndTime).isAfter(dayjs(endDateAndTime));
	};

	// onBlur時にエラーメッセージをセットする
	const validateTime = (): void => {
		setTimeError('');
		// はじまりと終わりの時間が同じかどうか
		const isSameStartAndEnd =
			startHour === endHour && startMinute === endMinute;

		if (isSameStartAndEnd) {
			setTimeError('はじめと終わりの時間が同じです。');
			return;
		}

		// はじまりの時間が終わりを超えていないかどうか
		const registerDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		const startDateAndTime = `${registerDate} ${startHour}:${startMinute}`;
		const endDateAndTime = `${registerDate} ${endHour}:${endMinute}`;

		if (dayjs(startDateAndTime).isAfter(dayjs(endDateAndTime))) {
			setTimeError(
				'スケジュールのはじまりの時間が終わりの時間を超えています。',
			);
		}
	};

	const isSubmitDisabled = !title || !description || checkTimeError();

	return (
		<ReactModal
			isOpen={isModalOpen}
			ariaHideApp={false}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<CloseButton onCloseModal={onCloseModal} />
			<div className="text-center text-3xl font-bold mb-4">予定を登録</div>
			<form onSubmit={submitAction}>
				<dl className="grid grid-cols-[auto_1fr] gap-3 items-start">
					{!shouldHideDateArea && type === 'register' && (
						<InputDate
							year={year}
							month={month}
							day={day}
							yearList={yearList}
							nowMonthList={nowMonthList}
							nowDayList={nowDayList}
							onChangeYear={(selectedYear: string) =>
								changeYear(selectedYear, month, day)
							}
							onChangeMonth={(selectedMonth: string) =>
								changeMonth(year, selectedMonth, day)
							}
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
