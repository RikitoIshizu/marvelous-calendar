'use client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { JSX } from 'react';
import { HolidayAndSpecialDayException, ScheduleSummary } from 'types/types';
import {
	dayTextCommon,
	holiday,
	holidayAndSpecialDayException,
	scheduleTextColor,
	specialDays,
} from 'utils/calendar';

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

const holidayAndSpecialDayText = (
	dayOfWeek: number,
	date: string,
	order: number,
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

const holidayAndSpecialDayTextClass = (
	dayOfWeek: number,
	date: string,
	order: number,
): string => {
	const checkDate = dayTextCommon('MMDD', date);

	if (specialDays[`${checkDate}`])
		return 'p-1 text-cyan-500 whitespace-nowrap truncate text-xs';

	const isHolidayAndSpecialDayException = holidayAndSpecialDayException.filter(
		(el: HolidayAndSpecialDayException) => {
			return (
				el.week === order &&
				dayOfWeek === el.dayOfWeek &&
				el.month === dayjs(date).month() + 1
			);
		},
	);

	const yesterday: string = dayjs(date).add(-1, 'day').format('YYYYMMDD');
	const yesterdayOnlyYearAndMonth: string = dayjs(date)
		.add(-1, 'day')
		.format('MMDD');
	const dOfW = dayjs(yesterday).day();

	if (
		holiday[`${checkDate}`] ||
		isHolidayAndSpecialDayException.length ||
		(holiday[`${yesterdayOnlyYearAndMonth}`] && dOfW === 0)
	) {
		return 'p-1 text-green-600 text-xs';
	}

	return '';
};

export const Day = (props: Props) => {
	const dayClass = (
		keyOfDayOfWeek: Props['keyOfDayOfWeek'],
		date: Props['date'],
		order: Props['order'],
	): string => {
		let commonClass: string = 'flex items-center align-text-top text-xs ml-1';
		const nowMonth = dayjs(`${props.selectYear}-${props.selectMonth}`).month();
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
	};

	const dayText = (date: string) => {
		const nowMonth = dayjs(`${props.selectYear}-${props.selectMonth}`).month();
		const checkMonth = dayjs(date).month();

		return nowMonth !== checkMonth
			? dayTextCommon('M/D', date)
			: dayjs(date).date().toString();
	};

	// 祝日もしくは特別な日を表示するテキスト
	const holidayText = holidayAndSpecialDayText(
		props.keyOfDayOfWeek,
		props.date,
		props.order,
	);

	// css
	const classes = () => {
		let commonClasses = 'align-text-top cursor-pointer';
		if (props.keyOfDayOfWeek !== 6) commonClasses += ' border-r-2 border-black';

		const today = dayjs();
		const theDay = dayjs(props.date);

		const tod = dayTextCommon('YYYYMMDD');
		const the = dayTextCommon('YYYYMMDD', props.date);

		if (tod === the) commonClasses += ' bg-yellow-200';
		else if (theDay.isBefore(today)) commonClasses += ' bg-neutral-400';
		return commonClasses;
	};

	// tdの高さを計算
	const tdHeight =
		props.tbodyHeight > 0 ? (props.tbodyHeight - 100) / props.weeks : 0;

	const innerTdHeight = () => {
		if (!tdHeight) return 0;

		const specialDaysTextHeight = holidayText ? 24 : 0;

		return tdHeight - 28 - specialDaysTextHeight;
	};

	const scheduleTimeText = (
		scheduleTimes: Omit<
			NonNullable<Props['schedules']>[number],
			'id' | 'title'
		>,
	) => {
		const { start_hour, start_minute, end_hour, end_minute } = scheduleTimes;
		return `${start_hour}:${start_minute}~${end_hour}:${end_minute}`;
	};

	return (
		<td className={classes()}>
			<Link href={`/date/${dayTextCommon('YYYYMMDD', props.date)}`}>
				<div style={{ height: tdHeight > 0 ? `${tdHeight}px` : 'auto' }}>
					<div className="flex items-center justify-items-start">
						<div
							className={dayClass(
								props.keyOfDayOfWeek,
								props.date,
								props.order,
							)}
						>
							{dayText(props.date)}
						</div>
						{props.weatherIcon && props.weatherIcon}
						{props.temperature && <span>{props.temperature}</span>}
					</div>
					{holidayText && (
						<div
							className={holidayAndSpecialDayTextClass(
								props.keyOfDayOfWeek,
								props.date,
								props.order,
							)}
						>
							{holidayText}
						</div>
					)}

					{(holidayText || props.schedules) && (
						<div
							style={{
								height: innerTdHeight() ? `${innerTdHeight()}px` : 'auto',
							}}
							className=" overflow-hidden"
						>
							{props.schedules && (
								<ul>
									{props.schedules.map((el) => (
										<li
											key={el.id}
											className={scheduleTextColor(el.scheduleTypes!)}
										>
											<span className="text-xs">{scheduleTimeText(el)}</span>
											<br />
											{el.title}
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</div>
			</Link>
		</td>
	);
};
