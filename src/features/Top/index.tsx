import { useRef, useEffect, useState, ComponentType } from 'react';
import ReactModal from 'react-modal';

const Modal = ReactModal as unknown as ComponentType<any>;

import { YearAndMonthAndDateList } from '@/lib/calendar';
import { useCalandar } from '@/features/Top/hooks/useCalendar';
import { Calendar } from '@/features/Top/Components/Calendar';
import { CalendarRegister } from '@/features/Top/Components/CalendarRegister';
import { CalendarHead } from '@/features/Top/Components/CalendarHead';

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

export const Top = () => {
	// 共通の処理はこのコンポーネントでまとめる
	const isDisplay = useRef(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const {
		count,
		days,
		year,
		month,
		isNowMonth,
		changeMonth,
		onChangeYearAndMonth,
		getScheduleOnTheDate,
		onGetSchedules,
	} = useCalandar();

	const onResetSchedule = () => {
		onGetSchedules(Number(year), Number(month));
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (!isDisplay.current) {
			isDisplay.current = true;
			changeMonth(0);
		}
	}, [changeMonth]);

	return (
		<main className="w-full relative">
			<CalendarHead
				count={count}
				year={year}
				month={month}
				isNowMonth={isNowMonth}
				changeMonth={changeMonth}
				YearAndMonthAndDateList={YearAndMonthAndDateList}
				onChangeYearAndMonth={onChangeYearAndMonth}
				setIsModalOpen={setIsModalOpen}
			/>
			<Calendar
				days={days}
				month={month}
				year={year}
				getScheduleOnTheDate={getScheduleOnTheDate}
			/>
			<Modal
				isOpen={isModalOpen}
				ariaHideApp={false}
				onRequestClose={() => setIsModalOpen(false)}
				style={customStyles}
				contentLabel="Example Modal"
			>
				<div>予定を登録</div>
				<CalendarRegister
					year={year}
					month={month}
					onEventCallBack={() => onResetSchedule()}
				/>
			</Modal>
		</main>
	);
};
