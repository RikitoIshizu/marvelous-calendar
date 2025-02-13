'use client';
import ReactModal from 'react-modal';
import { CalendarRegister } from './CalendarRegister';
import { ComponentProps, ComponentType } from 'react';
import { dayTextCommmon } from './calendar';

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
	schedule: ComponentProps<typeof CalendarRegister>['schedule'];
	date: string;
};

export const CalendarRegisterModal = ({
	isModalOpen,
	type,
	shouldHideDateArea,
	onOpenModal,
	schedule,
	date,
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
					year:
						type === 'edit'
							? schedule.year
							: Number(dayTextCommmon('YYYY', date)),
					month:
						type === 'edit'
							? schedule.month
							: Number(dayTextCommmon('MM', date)),
					day:
						type === 'edit' ? schedule.day : Number(dayTextCommmon('DD', date)),
					start_hour: schedule.start_hour,
					start_minute: schedule.start_minute,
					end_hour: schedule.end_hour,
					end_minute: schedule.end_minute,
					...(type === 'edit' && {
						id: schedule.id,
						title: schedule.title,
						description: schedule.description,
						scheduleTypes: schedule.scheduleTypes,
					}),
				}}
			/>
		</Modal>
	);
};
