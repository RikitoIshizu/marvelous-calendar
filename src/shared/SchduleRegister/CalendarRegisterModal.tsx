'use client';
import { ComponentProps, ComponentType } from 'react';
import ReactModal from 'react-modal';
import { dayTextCommon } from '../calendar';
import { CalendarRegister } from './CalendarRegister';

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
	shouldHideDateArea: ComponentProps<
		typeof CalendarRegister
	>['shouldHideDateArea'];
	onOpenModal: (_isOpen: boolean) => void;
	schedule: ComponentProps<typeof CalendarRegister>['schedule'];
	registeredSchedules: ComponentProps<
		typeof CalendarRegister
	>['registeredSchedules'];
	date: string;
};

export const CalendarRegisterModal = ({
	isModalOpen,
	type,
	shouldHideDateArea,
	onOpenModal,
	schedule,
	registeredSchedules,
	date,
}: Props) => {
	const onSuccess = () => {
		alert('スケジュールが登録されました。');
		onOpenModal(true);
	};

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
				onEventCallBack={() => onSuccess()}
				type={type}
				shouldHideDateArea={shouldHideDateArea}
				schedule={{
					start_hour: schedule.start_hour,
					start_minute: schedule.start_minute,
					end_hour: schedule.end_hour,
					end_minute: schedule.end_minute,
					year: Number(dayTextCommon('YYYY', date)),
					month: Number(dayTextCommon('MM', date)),
					day: Number(dayTextCommon('DD', date)),
					...(type === 'edit' && {
						id: schedule.id,
						title: schedule.title,
						description: schedule.description,
						scheduleTypes: schedule.scheduleTypes,
						year: schedule.year,
						month: schedule.month,
						day: schedule.day,
					}),
				}}
				registeredSchedules={registeredSchedules}
			/>
		</Modal>
	);
};
