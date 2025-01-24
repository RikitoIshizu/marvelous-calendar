import {
	useRef,
	useEffect,
	useState,
	ComponentType,
	ComponentProps,
} from 'react';
import ReactModal from 'react-modal';

const Modal = ReactModal as unknown as ComponentType<any>;

import { yearAndMonthAndDateList } from '@/lib/calendar';
import { useCalandar } from 'hooks/useCalendar';
import { Calendar } from '@/features/Top/Components/Calendar';
import { CalendarRegister } from '@/components/parts/CalendarRegister';
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
		day,
		isNowMonth,
		changeMonth,
		onChangeYearAndMonth,
		getScheduleOnTheDate,
		onGetSchedules,
	} = useCalandar();

	const onResetSchedule: ComponentProps<
		typeof CalendarRegister
	>['onEventCallBack'] = () => {
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
				yearAndMonthAndDateList={yearAndMonthAndDateList}
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
					onEventCallBack={() => onResetSchedule()}
					type="register"
					shouldHideDateArea={false}
					schedule={{
						year: Number(year),
						month: Number(month),
						day: Number(day),
					}}
				/>
			</Modal>
		</main>
	);
};
