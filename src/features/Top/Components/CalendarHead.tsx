import LeftArrowIcon from '@/assets/svgs/arrowLeft.svg';
import RightArrowIcon from '@/assets/svgs/arrowRight.svg';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import type { UseCalendar } from '@/hooks/useCalendar';
import { getWeatherMark } from '@/libs/getWeatherMark';
import { FetchCurrentWeather } from '@/types/types';
import { yearAndMonthAndDateList } from '@/utils/calendar';
import { memo, useMemo } from 'react';

const WeatherPart = memo(function WeatherPart({
	weather,
}: {
	weather: FetchCurrentWeather;
}) {
	// 現在の気温
	const temperature = useMemo<string | null>(
		() =>
			weather?.temperature != null
				? Number(weather.temperature).toFixed(1) + '℃'
				: null,
		[weather],
	);

	// 現在の湿度
	const humidity = useMemo<string | null>(
		() => weather?.relativeHumidity + '%' || null,
		[weather],
	);

	// 現在の降水確率
	const precipitation = useMemo<string>(() => {
		const precipitation = Math.round(Number(weather?.precipitation) * 100);
		return precipitation + '%';
	}, [weather]);

	return (
		<div className="flex items-center w-1/3">
			{getWeatherMark(weather.weatherCode, '!w-[40px] !h-[40px] mr-4')}
			<div>
				<div className="flex items-center">
					<div className="mr-4">気温 {temperature}</div>
					<div>湿度 {humidity}</div>
				</div>
				<div>降水確率: {precipitation}</div>
			</div>
		</div>
	);
});

export const CalendarHead = ({
	count,
	year,
	month,
	isNowMonth,
	weather,
	changeMonth,
	onChangeYearAndMonth,
	setIsModalOpen,
}: {
	count: UseCalendar['count'];
	year: UseCalendar['year'];
	month: UseCalendar['month'];
	isNowMonth: UseCalendar['isNowMonth'];
	weather: FetchCurrentWeather;
	changeMonth: UseCalendar['changeMonth'];
	onChangeYearAndMonth: (_year: string, _month: string) => Promise<void>;
	setIsModalOpen: (_value: boolean) => void;
}) => {
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
				<WeatherPart weather={weather} />
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
