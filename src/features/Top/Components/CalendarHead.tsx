import { Button } from '@/components/parts/Button';
import { Select } from '@/components/parts/Select';

export const CalendarHead = ({
	count,
	year,
	month,
	isNowMonth,
	changeMonth,
	YearAndMonthAndDateList,
	onChangeYearAndMonth,
	setIsModalOpen,
}: {
	count: number;
	year: string;
	month: string;
	isNowMonth: boolean;
	changeMonth: Function;
	YearAndMonthAndDateList: Function;
	onChangeYearAndMonth: Function;
	setIsModalOpen: Function;
}) => {
	return (
		<div
			id="calender-head"
			className="p-3 flex justify-between items-content w-full bg-white z-10"
		>
			<button
				onClick={() => {
					changeMonth(count - 1);
				}}
			>
				<img src="./arrowLeft.svg" alt="前の月" className="h-[40px]" />
			</button>
			<div className="w-[300px] flex items-center">
				<Select
					name="year"
					value={year}
					selectList={YearAndMonthAndDateList(`${year}-${month}`).yearList}
					onEventCallBack={(year: string) => {
						onChangeYearAndMonth(year, month);
					}}
				/>
				<span className="mx-1">年</span>
				<Select
					name="month"
					value={month}
					selectList={YearAndMonthAndDateList(`${year}-${month}`).monthList}
					onEventCallBack={(month: string) => {
						onChangeYearAndMonth(year, month);
					}}
				/>
				<span className="ml-1">月</span>
			</div>
			<div className="w-[450px] flex">
				<Button
					text="予定を登録"
					buttonColor="blue"
					textColor="#fff"
					onEventCallBack={() => {
						setIsModalOpen(true);
					}}
				/>
				{!isNowMonth && (
					<Button
						text="月をリセット"
						buttonColor="red"
						underBarColor="#691"
						textColor="#fff"
						onEventCallBack={() => {
							changeMonth(0);
						}}
					/>
				)}
			</div>
			<button
				onClick={() => {
					changeMonth(count + 1);
				}}
			>
				<img src="./arrowRight.svg" alt="次の月" className="h-[40px]" />
			</button>
		</div>
	);
};
