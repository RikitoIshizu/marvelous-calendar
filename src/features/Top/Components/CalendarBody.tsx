import type { UseCalendar } from '@/hooks/useCalendar';
import { UseWeather } from '@/hooks/useWeather';
import { getWeatherMark } from '@/libs/getWeatherMark';
import { useLayoutEffect, useRef, useState } from 'react';
import { Day } from './Day';

export const CalendarBody = ({
	days,
	month,
	year,
	getScheduleOnTheDate,
	monthlyWeatherData,
}: {
	days: UseCalendar['days'];
	month: UseCalendar['month'];
	year: UseCalendar['year'];
	monthlyWeatherData: UseWeather['monthlyWeather'];
	getScheduleOnTheDate: UseCalendar['getScheduleOnTheDate'];
}) => {
	// eslint-disable-next-line no-undef
	const tbodyRef = useRef<HTMLTableSectionElement>(null);
	const [tbodyHeight, setTbodyHeight] = useState(0);

	// tbodyの高さを取得
	useLayoutEffect(() => {
		if (!tbodyRef.current) return;

		const height = tbodyRef.current.offsetHeight;
		setTbodyHeight(height);
	}, [days]);

	// 天気データを取得する
	const getWeatherData = (date: string) => {
		const weatherData = monthlyWeatherData?.[date];

		if (!weatherData) {
			return {
				weather: undefined,
				temperature: undefined,
			};
		}

		const maxTemperature = weatherData.temperatureMax.toFixed(1);
		const minTemperature = weatherData.temperatureMin.toFixed(1);

		const temperature = `${minTemperature} ~ ${maxTemperature}℃`;

		return {
			icon: getWeatherMark(weatherData.weatherCode, '!w-[25px] !h-[25px] mx-2'),
			temperature,
		};
	};

	return (
		// 72pxはヘッダーの高さ
		<table
			id="calender-main-area"
			className="h-[calc(100vh-72px)] w-full border-solid border-4 border-black table-fixed"
		>
			<thead className="border-b-2 border-black">
				<tr>
					<td className="text-center p-2 font-bold border-r-2 border-black text-sky-600">
						日 Sunday
					</td>
					<td className="text-center p-2 font-bold border-r-2 border-black">
						月 Monday
					</td>
					<td className="text-center p-2 font-bold border-r-2 border-black">
						火 Tuesday
					</td>
					<td className="text-center p-2 font-bold border-r-2 border-black">
						水 Wednesday
					</td>
					<td className="text-center p-2 font-bold border-r-2 border-black">
						木 Thursday
					</td>
					<td className="text-center p-2 font-bold border-r-2 border-black">
						金 Friday
					</td>
					<td className="text-center p-2 font-bold  text-amber-600">
						土 Saturday
					</td>
				</tr>
			</thead>
			<tbody ref={tbodyRef}>
				{days.map((el) => (
					<tr
						key={`${`${el.week}-${el.days}`}`}
						className="border-b-2 border-black"
					>
						{el.days.map((elem) => {
							const weather = getWeatherData(elem.date);

							return (
								<Day
									key={elem.date}
									date={elem.date}
									order={elem.order}
									keyOfDayOfWeek={elem.keyOfDayOfWeek}
									selectMonth={month}
									selectYear={year}
									weatherIcon={weather.icon}
									temperature={weather.temperature}
									schedules={getScheduleOnTheDate(elem.date)}
									tbodyHeight={tbodyHeight}
									weeks={days.length}
								/>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
};
