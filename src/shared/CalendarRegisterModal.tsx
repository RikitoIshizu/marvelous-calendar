'use client';
import ReactModal from 'react-modal';
import { CalendarRegister } from './CalendarRegister';
import { ComponentType } from 'react';
import { Schedule } from 'types/types';

const Modal = ReactModal as unknown as ComponentType<any>;

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

type Props = {
	isModalOpen: boolean;
	type: 'register' | 'edit';
	shouldHideDateArea: boolean;
	onOpenModal: (_isOpen: boolean) => void;
	year: number;
	month: number;
	day: number;
	startHour?: Schedule['start_hour'];
	startMinute?: Schedule['start_minute'];
	endHour?: Schedule['end_hour'];
	endMinute?: Schedule['end_minute'];
	id?: Schedule['id'];
	title?: Schedule['title'];
	description?: Schedule['description'];
	scheduleTypes?: Schedule['scheduleTypes'];
};

export const CalendarRegisterModal = ({
	isModalOpen,
	type,
	shouldHideDateArea,
	onOpenModal,
	year,
	month,
	day,
	startHour,
	startMinute,
	endHour,
	endMinute,
	id,
	title,
	description,
	scheduleTypes,
}: Props) => {
	return (
		<Modal
			isOpen={isModalOpen}
			ariaHideApp={false}
			onRequestClose={() => onOpenModal(false)}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<div className="text-center text-3xl font-bold mb-4">予定を登録</div>
			<CalendarRegister
				onEventCallBack={() => onOpenModal(true)}
				type={type}
				shouldHideDateArea={shouldHideDateArea}
				schedule={{
					year,
					month,
					day,
					...(startHour && { start_hour: startHour }),
					...(startMinute && { start_minute: startMinute }),
					...(endHour && { end_hour: endHour }),
					...(endMinute && { end_minute: endMinute }),
					...(type === 'edit' && {
						id,
						title,
						description,
						scheduleTypes,
					}),
				}}
			/>
		</Modal>
	);
};
