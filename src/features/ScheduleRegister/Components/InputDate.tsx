'use client';
import { Select } from 'components/Select';
import { useRegisterSchedule } from 'hooks/useRegisterSchedule';
import { ReactElement } from 'react';

type UseRegisterSchedule = ReturnType<typeof useRegisterSchedule>;

type Props = {
	year: UseRegisterSchedule['year'];
	month: UseRegisterSchedule['month'];
	day: UseRegisterSchedule['day'];
	yearList: UseRegisterSchedule['yearList'];
	nowMonthList: UseRegisterSchedule['nowMonthList'];
	nowDayList: UseRegisterSchedule['nowDayList'];
	onChangeYear: (_year: string) => void;
	onChangeMonth: (_month: string) => void;
	onChangeDay: UseRegisterSchedule['setDay'];
};

export const InputDate = (props: Props): ReactElement => {
	return (
		<>
			<dt className="text-right pt-1 text-xl">日付:</dt>
			<dd className="flex items-center">
				<Select
					id="year"
					name="year"
					value={props.year}
					selectList={props.yearList}
					suffix="年"
					suffixAs="label"
					onEventCallBack={props.onChangeYear}
				/>
				<Select
					id="month"
					name="month"
					value={props.month}
					selectList={props.nowMonthList}
					suffix="月"
					suffixAs="label"
					onEventCallBack={props.onChangeMonth}
				/>
				<Select
					id="day"
					name="day"
					value={props.day}
					selectList={props.nowDayList}
					suffix="日"
					suffixAs="label"
					onEventCallBack={props.onChangeDay}
				/>
			</dd>
		</>
	);
};
