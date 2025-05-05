import LeftArrowIcon from 'assets/svgs/arrowLeft.svg';
import RightArrowIcon from 'assets/svgs/arrowRight.svg';
import { Button } from 'components/Button';
import { Select } from 'components/Select';
import { getWeatherMark } from 'libs/getWeatherMark';
import { useMemo } from 'react';
import { FetchCurrentWeather } from 'types/types';

export const CalendarHead = ({
	count,
	year,
	month,
	isNowMonth,
	whether,
	changeMonth,
	yearAndMonthAndDateList,
	onChangeYearAndMonth,
	setIsModalOpen,
}: {
	count: number;
	year: string;
	month: string;
	isNowMonth: boolean;
	whether: FetchCurrentWeather | null;
	changeMonth: Function;
	yearAndMonthAndDateList: Function;
	onChangeYearAndMonth: Function;
	setIsModalOpen: Function;
}) => {
	const temperature = useMemo(() => {
		return Number(whether?.temperature).toFixed(1) || null;
	}, [whether?.temperature]);

	const humidity = useMemo(() => {
		return whether?.relativeHumidity || null;
	}, [whether?.relativeHumidity]);

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
							<div className="mr-4">気温 {temperature}℃</div>
							<div>湿度 {humidity}%</div>
						</>
					)}

					{/* 
				<div>降水量 </div>*/}
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
