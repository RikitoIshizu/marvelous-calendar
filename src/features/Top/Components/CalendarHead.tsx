import LeftArrowIcon from 'assets/svgs/arrowLeft.svg';
import RightArrowIcon from 'assets/svgs/arrowRight.svg';
import ClearSkyIcon from 'assets/svgs/wheather/clearSky.svg';
import CloudyIcon from 'assets/svgs/wheather/cloudy.svg';
import RainyIcon from 'assets/svgs/wheather/rainy.svg';
import SnowyIcon from 'assets/svgs/wheather/snowy.svg';
import SunnyIcon from 'assets/svgs/wheather/sunny.svg';
import ThunderIcon from 'assets/svgs/wheather/thunder.svg';
import { Button } from 'components/Button';
import { Select } from 'components/Select';
import { useMemo } from 'react';
import { FetchCurrentWeather } from 'types/types';

const weatherIconStyles = '!w-[40px] !h-[40px] mr-4';

const getWeatherMark = (weatherCode: FetchCurrentWeather['weatherCode']) => {
	if (weatherCode === 0) return <ClearSkyIcon className={weatherIconStyles} />;
	if (weatherCode === 3) return <CloudyIcon className={weatherIconStyles} />;
	if ([1, 2].includes(weatherCode))
		return <SunnyIcon className={weatherIconStyles} />;
	if ([45, 48, 51, 53, 55, 56, 57].includes(weatherCode))
		// 霧
		return <CloudyIcon className={weatherIconStyles} />;
	if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode))
		return <RainyIcon className={weatherIconStyles} />;
	if ([71, 73, 75, 77, 85, 86].includes(weatherCode))
		return <SnowyIcon className={weatherIconStyles} />;
	if ([95, 96, 99].includes(weatherCode))
		return <ThunderIcon className={weatherIconStyles} />;
	return null;
};

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
	whether: FetchCurrentWeather;
	changeMonth: Function;
	yearAndMonthAndDateList: Function;
	onChangeYearAndMonth: Function;
	setIsModalOpen: Function;
}) => {
	const temperture = useMemo(() => {
		return Number(whether.temperature).toFixed(1);
	}, [whether.temperature]);

	const humidity = useMemo(() => {
		return whether.relativeHumidity;
	}, [whether.relativeHumidity]);

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
					{getWeatherMark(whether.weatherCode)}
					<div className="mr-4">気温 {temperture}℃</div>
					<div>湿度 {humidity}%</div>
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
