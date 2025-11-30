'use client';
import { HolidayAndSpecialDayException, ScheduleSummary } from '@/types/types';
import {
	dayTextCommon,
	holiday,
	holidayAndSpecialDayException,
	scheduleTextColor,
	specialDays,
} from '@/utils/calendar';
import dayjs from 'dayjs';
import Link from 'next/link';
import { JSX, memo, useCallback, useMemo } from 'react';

type Props = {
	date: string;
	order: number;
	keyOfDayOfWeek: number;
	selectYear: string;
	selectMonth: string;
	schedules?: ScheduleSummary[];
	weatherIcon?: JSX.Element | null;
	temperature?: string;
	tbodyHeight: number;
	weeks: number;
};

// 祝日もしくは特別な日を表示するテキスト
const holidayAndSpecialDayText = (
	dayOfWeek: Props['keyOfDayOfWeek'],
	date: Props['date'],
	order: Props['order'],
): string => {
	const checkDate = dayTextCommon('MMDD', date);

	if (checkDate === '0229') return '閏年';
	if (holiday[`${checkDate}`]) return holiday[`${checkDate}`];
	if (specialDays[`${checkDate}`]) return specialDays[`${checkDate}`];

	const month = dayjs(date).month() + 1;

	const isHolidayAndSpecialDayException = holidayAndSpecialDayException.filter(
		(el: HolidayAndSpecialDayException) => {
			return (
				el.week === order && dayOfWeek === el.dayOfWeek && el.month === month
			);
		},
	);

	if (isHolidayAndSpecialDayException.length)
		return isHolidayAndSpecialDayException[0].name;

	const yesterday: string = dayjs(date).add(-1, 'day').format('YYYYMMDD');
	const yesterdayOnlyYearAndMonth: string = dayjs(date)
		.add(-1, 'day')
		.format('MMDD');
	const dOfW = dayjs(yesterday).day();

	if (holiday[`${yesterdayOnlyYearAndMonth}`] && dOfW === 0)
		return '国民の休日';

	return '';
};

// 予定時間テキスト
const scheduleTimeText = (
	scheduleTimes: Omit<ScheduleSummary, 'id' | 'title' | 'scheduleTypes'>,
) => {
	const { start_hour, start_minute, end_hour, end_minute } = scheduleTimes;
	return `${start_hour}:${start_minute}~${end_hour}:${end_minute}`;
};

// 日付部分
const DatePart = memo(function DatePart({
	keyOfDayOfWeek,
	date,
	order,
	selectYear,
	selectMonth,
	weatherIcon,
	temperature,
}: Omit<Props, 'schedules' | 'tbodyHeight' | 'weeks'>) {
	const dayClass = useCallback(
		(
			keyOfDayOfWeek: Props['keyOfDayOfWeek'],
			date: Props['date'],
			order: Props['order'],
		): string => {
			let commonClass: string = 'flex items-center align-text-top text-xs ml-1';
			const nowMonth = dayjs(`${selectYear}-${selectMonth}`).month();
			const checkMonth = dayjs(date).month();

			const today = dayTextCommon('YYYYMMDD');
			const checkDay = dayTextCommon('YYYYMMDD', date);

			if (checkDay === today) {
				commonClass +=
					' justify-center w-[35px] rounded-full bg-[red] text-center leading-9 text-white';
			} else if (nowMonth !== checkMonth) {
				commonClass += ' text-gray-300';
			} else if (keyOfDayOfWeek === 0) {
				commonClass += ' text-sky-600';
			} else if (keyOfDayOfWeek === 6) {
				commonClass += ' text-amber-600';
			}

			const checkDate = dayTextCommon('MMDD', date);

			if (specialDays[`${checkDate}`]) commonClass += ' text-cyan-500';
			if (holiday[`${checkDate}`]) commonClass += ' text-green-600';

			const month = dayjs(date).month() + 1;

			const isHolidayAndSpecialDayException =
				holidayAndSpecialDayException.filter(
					(el: HolidayAndSpecialDayException) => {
						return (
							el.week === order &&
							keyOfDayOfWeek === el.dayOfWeek &&
							el.month === month
						);
					},
				);

			isHolidayAndSpecialDayException.length &&
				(commonClass += ' text-green-600');

			const yesterday: string = dayjs(date).add(-1, 'day').format('YYYYMMDD');
			const yesterdayOnlyYearAndMonth: string = dayjs(date)
				.add(-1, 'day')
				.format('MMDD');
			const dOfW = dayjs(yesterday).day();

			holiday[`${yesterdayOnlyYearAndMonth}`] &&
				dOfW === 0 &&
				(commonClass += ' text-green-600');

			return commonClass;
		},
		[selectMonth, selectYear],
	);

	const dayText = useCallback(
		(date: Props['date']) => {
			const nowMonth = dayjs(`${selectYear}-${selectMonth}`).month();
			const checkMonth = dayjs(date).month();

			return nowMonth !== checkMonth
				? dayTextCommon('M/D', date)
				: dayjs(date).date().toString();
		},
		[selectMonth, selectYear],
	);

	return (
		<div className="flex items-center justify-items-start">
			<div className={dayClass(keyOfDayOfWeek, date, order)}>
				{dayText(date)}
			</div>
			{weatherIcon && weatherIcon}
			{temperature && <span>{temperature}</span>}
		</div>
	);
});

// 祝日もしくは特別な日テキスト部分
const HolidayText = memo(function HolidayText({ text }: { text: string }) {
	return <div className="p-1 whitespace-nowrap truncate text-xs">{text}</div>;
});

// 予定リスト部分
const ScheduleList = memo(function ScheduleList({
	schedules,
	innerTdHeight,
}: {
	schedules?: ScheduleSummary[];
	innerTdHeight: number;
}) {
	if (!schedules) return null;

	return (
		<div
			style={{
				height: innerTdHeight ? `${innerTdHeight}px` : 'auto',
			}}
			className=" overflow-hidden"
		>
			{schedules && (
				<ul>
					{schedules.map((el) => (
						<li key={el.id} className={scheduleTextColor(el.scheduleTypes!)}>
							<span className="text-xs">{scheduleTimeText(el)}</span>
							<br />
							{el.title}
						</li>
					))}
				</ul>
			)}
		</div>
	);
});

export const Day = memo(function Day(props: Props) {
	// 祝日もしくは特別な日を表示するテキスト
	const holidayText = useMemo<string>(
		() =>
			holidayAndSpecialDayText(props.keyOfDayOfWeek, props.date, props.order),
		[props.keyOfDayOfWeek, props.date, props.order],
	);

	// css
	const classes = useMemo<string>(() => {
		let commonClasses = 'align-text-top cursor-pointer';
		if (props.keyOfDayOfWeek !== 6) commonClasses += ' border-r-2 border-black';

		const today = dayjs();
		const theDay = dayjs(props.date);

		const tod = dayTextCommon('YYYYMMDD');
		const the = dayTextCommon('YYYYMMDD', props.date);

		if (tod === the) commonClasses += ' bg-yellow-200';
		else if (theDay.isBefore(today)) commonClasses += ' bg-neutral-400';
		return commonClasses;
	}, [props.date, props.keyOfDayOfWeek]);

	// tdの高さを計算
	const tdHeight = useMemo<number>(
		() => (props.tbodyHeight > 0 ? (props.tbodyHeight - 100) / props.weeks : 0),
		[props.tbodyHeight, props.weeks],
	);

	const innerTdHeight = useMemo<number>(() => {
		if (!tdHeight) return 0;

		const specialDaysTextHeight = holidayText ? 24 : 0;

		return tdHeight - 28 - specialDaysTextHeight;
	}, [tdHeight, holidayText]);

	return (
		<td className={classes}>
			<Link href={`/date/${dayTextCommon('YYYYMMDD', props.date)}`}>
				<div style={{ height: tdHeight > 0 ? `${tdHeight}px` : 'auto' }}>
					<DatePart
						keyOfDayOfWeek={props.keyOfDayOfWeek}
						date={props.date}
						order={props.order}
						selectYear={props.selectYear}
						selectMonth={props.selectMonth}
						weatherIcon={props.weatherIcon}
						temperature={props.temperature}
					/>
					<HolidayText text={holidayText} />
					<ScheduleList
						schedules={props.schedules}
						innerTdHeight={innerTdHeight}
					/>
				</div>
			</Link>
		</td>
	);
});
