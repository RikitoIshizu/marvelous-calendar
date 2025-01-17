import dayjs from 'dayjs';
import {
	useRef,
	useEffect,
	useState,
	useMemo,
	ComponentType,
	useCallback,
} from 'react';
import ReactModal from 'react-modal';

const Modal = ReactModal as unknown as ComponentType<any>;

import { dayTextCommmon, YearAndMonthAndDateList } from '@/lib/calendar';
import { amountOfDay } from '@/lib/calendar';
import { Schedule } from '@/lib/types';
import { getSchedule } from '@/lib/supabase';
import { Day } from '@/components/atoms/Day';
import { CalendarRegister } from '@/components/organisms/CalendarRegister';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';

type Calendar = {
	keyOfdayOfWeek: number;
	order: number;
	date: string;
};

type WeeklyDay = {
	days: Calendar[];
	week: number;
};

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

const CalendarComponent = ({
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

export const Top = () => {
	// 共通の処理はこのコンポーネントでまとめる
	const isDisplay = useRef(false);
	const [count, setCount] = useState<number>(0);
	const [days, setDays] = useState<WeeklyDay[]>([]);
	const [year, setYear] = useState<string>(dayTextCommmon('YYYY'));
	const [month, setMonth] = useState<string>(dayTextCommmon('MM'));
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const onGetSchedules = async (y: number, m: number): Promise<void> => {
		const schedule = await getSchedule(y, m);
		setSchedules(schedule);
	};

	const setNowYearAndMonth = useCallback(
		async (val: number) => {
			console.log(val);
			const y = dayjs().add(val, 'month').format('YYYY');
			const m = dayjs().add(val, 'month').format('MM');

			setYear(() => y);
			setMonth(() => m);

			onGetSchedules(Number(y), Number(m));
		},
		[onGetSchedules, setYear, setMonth],
	);

	// カレンダーの日付を取得
	const setCalendar = (val: number) => {
		const setYandM = dayjs().add(val, 'month').format('YYYY-MM');

		// カレンダーを取得する
		// その月の全日付を取得
		let nowCalendar: Calendar[] = [];

		// まずは現在見ている月のカレンダーの日付を取得する
		for (var i = 1; i <= amountOfDay(setYandM); i++) {
			const day = i.toString().padStart(2, '0');
			const yearAndMonth = dayTextCommmon('YYYY-MM', setYandM);
			const date = dayTextCommmon('YYYY-MM-DD', `${yearAndMonth}-${day}`);
			const keyOfdayOfWeek = dayjs(date).day();
			const order =
				nowCalendar.filter(
					(el: Calendar) => el.keyOfdayOfWeek === keyOfdayOfWeek,
				).length + 1;

			const setData: Calendar = { date, keyOfdayOfWeek, order };
			nowCalendar = [...nowCalendar, setData];
		}

		// 足りない前後の月の日付を取得する。
		let prevMonthDate: Calendar[] = [];
		let nextMonthDate: Calendar[] = [];

		nowCalendar.forEach((date) => {
			const d = dayjs(date.date);
			const day: number = d.date();

			if (day === 1) {
				// 月初の場合、前月の足りない日数を追加する
				if (date.keyOfdayOfWeek) {
					for (var i = date.keyOfdayOfWeek; i > 0; i--) {
						const addPrevMonthDate = d.add(-i, 'day');
						prevMonthDate = [
							...prevMonthDate,
							{
								date: addPrevMonthDate.format('YYYY-MM-DD'),
								keyOfdayOfWeek: addPrevMonthDate.day(),
								order: 1,
							},
						];
					}
				}
			} else if (day === nowCalendar.length) {
				// 月末の場合、次月の足りない日数を追加する
				if (date.keyOfdayOfWeek !== 6) {
					for (var n = 1; n <= 6 - date.keyOfdayOfWeek; n++) {
						const addPrevMonthDate = d.add(n, 'day');
						nextMonthDate = [
							...nextMonthDate,
							{
								date: addPrevMonthDate.format('YYYY-MM-DD'),
								keyOfdayOfWeek: addPrevMonthDate.day(),
								order: 6,
							},
						];
					}
				}
			}
		});

		const displayCalendar = [
			...prevMonthDate,
			...nowCalendar,
			...nextMonthDate,
		];

		let datePerWeek: WeeklyDay[] = [];
		let oneWeek: Calendar[] = [];
		let week = 1;

		// 週ごとに分ける
		displayCalendar.forEach((date: Calendar) => {
			oneWeek = [...oneWeek, date];

			if (date.keyOfdayOfWeek === 6) {
				const addData: WeeklyDay[] = [{ week, days: oneWeek }];

				datePerWeek = [...datePerWeek, ...addData];
				oneWeek = [];
				week++;
			}
		});

		setDays(datePerWeek);
	};

	// 月を変える
	const changeMonth = useCallback(
		(c: number) => {
			setCount(c);
			setNowYearAndMonth(c);
			setCalendar(c);
		},
		[setCount, setNowYearAndMonth, setCalendar],
	);

	// 年と月を変える
	const onChangeYearAndMonth = (year: string, month: string): void => {
		const now = dayTextCommmon('YYYY-MM');
		const nowYandM = dayjs(now);
		const sltYandM = dayjs(`${year}-${month}`);
		const c = sltYandM.diff(nowYandM, 'month');

		changeMonth(c);
	};

	// 今見ているカレンダーが実際の現在の年月かどうか
	const isNowMonth = useMemo(() => count === 0, [count]);

	const onResetSchedule = () => {
		onGetSchedules(Number(year), Number(month));
		setIsModalOpen(false);
	};

	const getScheduleOnTheDate = (
		day: string,
	): Pick<Schedule, 'id' | 'title' | 'scheduleTypes'>[] => {
		const y = dayjs(day).format('YYYY');
		const m = dayjs(day).format('M');
		const d = dayjs(day).format('D');

		return schedules
			.filter((el) => {
				const { year, month, day } = el;

				return (
					Number(year) === Number(y) &&
					Number(month) === Number(m) &&
					Number(day) === Number(d)
				);
			})
			.map((el) => {
				const { id, title, scheduleTypes } = el;
				return { id, title, scheduleTypes };
			});
	};

	useEffect(() => {
		if (!isDisplay.current) {
			isDisplay.current = true;
			changeMonth(0);
		}
	}, [changeMonth]);

	return (
		<main className="w-full relative">
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
			<CalendarComponent
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
				<div className="">予定を登録</div>
				<CalendarRegister
					year={year}
					month={month}
					onEventCallBack={() => onResetSchedule()}
				/>
			</Modal>
		</main>
	);
};
