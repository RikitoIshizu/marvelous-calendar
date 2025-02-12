import { Day } from '@/components/parts/Day';

type Calendar = {
	keyOfdayOfWeek: number;
	order: number;
	date: string;
};

type WeeklyDay = {
	days: Calendar[];
	week: number;
};

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
}: {
	days: WeeklyDay[];
	month: string;
	year: string;
	getScheduleOnTheDate: Function;
}) => {
	return (
		<table
			id="calender-main-area"
			className="h-[calc(100vh-64px)] top-[64px] w-full border-solid border-4 border-black table-fixed"
		>
			{DayOfWeek()}
			<tbody>
				{days.map((el) => {
					return (
						<tr
							key={`${`${el.week}-${el.days}`}`}
							className="border-b-2 border-black"
						>
							{el.days.map((elem) => {
								return (
									<Day
										key={elem.date}
										date={elem.date}
										order={elem.order}
										keyOfdayOfWeek={elem.keyOfdayOfWeek}
										selectMonth={month}
										selectYear={year}
										schedules={getScheduleOnTheDate(elem.date)}
									/>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};
