import LeftArrowIcon from 'assets/svgs/arrowLeft.svg';
import RightArrowIcon from 'assets/svgs/arrowRight.svg';
import { Button } from 'components/Button';
import { Select } from 'components/Select';
import type { UseCalendar } from 'hooks/useCalendar';
import type { UseWeather } from 'hooks/useWeather';
import { getWeatherMark } from 'libs/getWeatherMark';
import { yearAndMonthAndDateList } from 'utils/calendar';

export const CalendarHead = ({
	count,
	year,
	month,
	isNowMonth,
	whether,
	changeMonth,
	onChangeYearAndMonth,
	setIsModalOpen,
}: {
	count: UseCalendar['count'];
	year: UseCalendar['year'];
	month: UseCalendar['month'];
	isNowMonth: UseCalendar['isNowMonth'];
	whether: UseWeather['currentWeather'];
	changeMonth: UseCalendar['changeMonth'];
	onChangeYearAndMonth: (_year: string, _month: string) => Promise<void>;
	setIsModalOpen: (_value: boolean) => void;
}) => {
	const temperature: string | null =
		whether?.temperature != null
			? Number(whether.temperature).toFixed(1) + '℃'
			: null;

	const humidity: string | null = whether?.relativeHumidity + '%' || null;

	const precipitation = (): string => {
		const precipitation = Math.round(Number(whether?.precipitation) * 100);
		return precipitation + '%';
	};

	return (
		<div
			id="calender-head"
			className="p-3 flex items-content w-full bg-white z-10"
		>
			<button
				className="w-[5%] mr-auto"
				onClick={() => {
					changeMonth(count - 1);
				}}
			>
				<LeftArrowIcon className="!w-[40px] !h-[40px]" />
			</button>
			<div className="flex items-center justify-center w-[90%]">
				<div className="flex items-center w-1/3">
					{whether && (
						<>
							{getWeatherMark(whether.weatherCode, '!w-[40px] !h-[40px] mr-4')}
							<div>
								<div className="flex items-center">
									<div className="mr-4">気温 {temperature}</div>
									<div>湿度 {humidity}</div>
								</div>
								<div>降水確率: {precipitation()}</div>
							</div>
						</>
					)}
				</div>
				<div className="flex items-center w-1/3">
					<Select
						name="year"
						value={year}
						selectList={yearAndMonthAndDateList(`${year}-${month}`).yearList}
						onEventCallBack={(year: string) => {
							onChangeYearAndMonth(year, month);
						}}
					/>
					<span className="mx-1">年</span>
					<Select
						name="month"
						value={month}
						selectList={yearAndMonthAndDateList(`${year}-${month}`).monthList}
						onEventCallBack={(month: string) => {
							onChangeYearAndMonth(year, month);
						}}
					/>
					<span className="ml-1">月</span>
				</div>
				<div className="flex w-1/3">
					<Button
						text="予定を登録"
						buttonColor="bg-[blue]"
						textColor="text-[#fff]"
						onEventCallBack={() => {
							setIsModalOpen(true);
						}}
					/>
					{!isNowMonth && (
						<Button
							text="月をリセット"
							buttonColor="bg-[red]"
							textColor="text-[#fff]"
							otherClasses="ml-4"
							onEventCallBack={() => {
								changeMonth(0);
							}}
						/>
					)}
				</div>
			</div>
			<button
				className="w-[5%] ml-auto"
				onClick={() => {
					changeMonth(count + 1);
				}}
			>
				<RightArrowIcon className="!w-[40px] !h-[40px]" />
			</button>
		</div>
	);
};
