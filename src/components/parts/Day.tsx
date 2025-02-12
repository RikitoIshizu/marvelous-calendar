'use client';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { Schedule } from 'types/types';
import { scheduleTextColor } from '@/lib/calendar';

import {
	holiday,
	holidayAndSpecialDayException,
	specialDays,
	dayTextCommmon,
} from '@/lib/calendar';
import { HolidayAndSpecialDayException } from 'types/types';
import { NamedExoticComponent, useCallback, memo } from 'react';

type Props = {
	date: string;
	order: number;
	keyOfdayOfWeek: number;
	selectYear: string;
	selectMonth: string;
	schedules?: Pick<Schedule, 'id' | 'title' | 'scheduleTypes'>[];
};

const holidayAndSpecialDayText = (
	dayOfWeek: number,
	date: string,
	order: number,
): string => {
	const checkDate = dayTextCommmon('MMDD', date);

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

	if (holiday[`${yesterdayOnlyYearAndMonth}`] && dOfW === 0) {
		return '国民の休日';
	}

	return '';
};

const holidayAndSpecialDayTextClass = (
	dayOfWeek: number,
	date: string,
	order: number,
): string => {
	const checkDate = dayTextCommmon('MMDD', date);

	if (specialDays[`${checkDate}`]) return 'p-1 text-cyan-500 text-xs';

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

export const Day: NamedExoticComponent<Props> = memo(function Day(
	props: Props,
) {
	const dayClass = useCallback(
		(
			keyOfdayOfWeek: Props['keyOfdayOfWeek'],
			date: Props['date'],
			order: Props['order'],
		): string => {
			let commonClass: string = 'flex items-center align-text-top text-xl ml-1';
			const nowMonth = dayjs(
				`${props.selectYear}-${props.selectMonth}`,
			).month();
			const checkMonth = dayjs(date).month();

			const today = dayTextCommmon('YYYYMMDD');
			const checkDay = dayTextCommmon('YYYYMMDD', date);

			if (checkDay === today) {
				commonClass +=
					' w-[35px] rounded-full bg-[red] text-center leading-9 text-white';
			} else if (nowMonth !== checkMonth) {
				if (checkDay === today) {
					commonClass += 'text-lime-400';
				} else {
					commonClass += ' text-gray-400';
				}
			} else if (keyOfdayOfWeek === 0) {
				commonClass += ' text-sky-600';
			} else if (keyOfdayOfWeek === 6) {
				commonClass += ' text-amber-600';
			}

			const checkDate = dayTextCommmon('MMDD', date);

			if (specialDays[`${checkDate}`]) commonClass += ' text-cyan-500';
			if (holiday[`${checkDate}`]) commonClass += ' text-green-600';

			const month = dayjs(date).month() + 1;

			const isHolidayAndSpecialDayException =
				holidayAndSpecialDayException.filter(
					(el: HolidayAndSpecialDayException) => {
						return (
							el.week === order &&
							keyOfdayOfWeek === el.dayOfWeek &&
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
		[props.selectYear, props.selectMonth],
	);

	const dayText = useCallback(
		(date: string) => {
			const nowMonth = dayjs(
				`${props.selectYear}-${props.selectMonth}`,
			).month();
			const checkMonth = dayjs(date).month();

			return nowMonth !== checkMonth
				? dayTextCommmon('M/D', date)
				: dayjs(date).date().toString();
		},
		[props.selectYear, props.selectMonth],
	);

	const classes = useCallback((): string => {
		let commonClasses =
			'h-[calc((100vh-64px-75px)/7)] align-text-top cursor-pointer';
		if (props.keyOfdayOfWeek !== 6) commonClasses += ' border-r-2 border-black';

		const today = dayjs();
		const theDay = dayjs(props.date);

		const tod = dayTextCommmon('YYYYMMDD');
		const the = dayTextCommmon('YYYYMMDD', props.date);

		if (tod === the) commonClasses += ' bg-yellow-200';
		else if (theDay.isBefore(today)) commonClasses += ' bg-neutral-300';

		return commonClasses;
	}, [props]);

	return (
		<td className={classes()}>
			<div className="items-center">
				<Link href={`/date/${dayjs(props.date).format('YYYYMMDD')}`}>
					<div
						className={dayClass(props.keyOfdayOfWeek, props.date, props.order)}
					>
						{dayText(props.date)}
						<span
							className={holidayAndSpecialDayTextClass(
								props.keyOfdayOfWeek,
								props.date,
								props.order,
							)}
						>
							{holidayAndSpecialDayText(
								props.keyOfdayOfWeek,
								props.date,
								props.order,
							)}
						</span>
					</div>
					{(holidayAndSpecialDayText(
						props.keyOfdayOfWeek,
						props.date,
						props.order,
					) ||
						props.schedules) && (
						<div className="h-[calc(((100vh-64px-75px)/7)-32px)] overflow-y-scroll">
							{props.schedules && (
								<ul>
									{props.schedules.map((el) => (
										<li
											key={el.id}
											className={scheduleTextColor(el.scheduleTypes!)}
										>
											{el.title}
										</li>
									))}
								</ul>
							)}
						</div>
					)}
				</Link>
			</div>
		</td>
	);
});
