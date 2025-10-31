import type { UseCalendar } from 'hooks/useCalendar';
import { UseWeather } from 'hooks/useWeather';
import { getWeatherMark } from 'libs/getWeatherMark';
import { useCallback, useMemo } from 'react';
import { Day } from './Day';

const DayOfWeek = () => {
	return (
		<thead className="border-b-2 border-black">
			<tr>
				<td className="text-center p-2 font-bold text-xl border-r-2 border-black text-sky-600">
					日<br />
					Sunday
				</td>
				<td className="text-center p-2 font-bold text-xl border-r-2 border-black">
					月<br />
					Monday
				</td>
				<td className="text-center p-2 font-bold text-xl border-r-2 border-black">
					火<br />
					Tuesday
				</td>
				<td className="text-center p-2 font-bold text-xl border-r-2 border-black">
					水<br />
					Wednesday
				</td>
				<td className="text-center p-2 font-bold text-xl border-r-2 border-black">
					木<br />
					Thursday
				</td>
				<td className="text-center p-2 font-bold text-xl border-r-2 border-black">
					金<br />
					Friday
				</td>
				<td className="text-center p-2 font-bold text-xl text-amber-600">
					土<br />
					Saturday
				</td>
			</tr>
		</thead>
	);
};

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
	const getWeatherData = useCallback(
		(date: string) => {
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
				icon: getWeatherMark(
					weatherData.weatherCode,
					'!w-[25px] !h-[25px] mx-2',
				),
				temperature,
			};
		},
		[monthlyWeatherData],
	);

	const dayComponent = useMemo(() => {
		return days.map((el) => {
			return (
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
							/>
						);
					})}
				</tr>
			);
		});
	}, [days, getScheduleOnTheDate, month, year, getWeatherData]);

	return (
		<table
			id="calender-main-area"
			className="h-[calc(100vh-64px)] top-[64px] w-full border-solid border-4 border-black table-fixed"
		>
			{DayOfWeek()}
			<tbody>{dayComponent}</tbody>
		</table>
	);
};
