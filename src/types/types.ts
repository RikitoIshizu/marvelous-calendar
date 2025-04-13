import { Hour, Minute } from 'shared/time';
import { Tables, TablesInsert, TablesUpdate } from './supabase-generated-types';

export type MonthString =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12';

export type DayString =
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09'
	| '10'
	| '11'
	| '12'
	| '13'
	| '14'
	| '15'
	| '16'
	| '17'
	| '18'
	| '19'
	| '20'
	| '21'
	| '22'
	| '23'
	| '24'
	| '25'
	| '26'
	| '27'
	| '28'
	| '29'
	| '30'
	| '31';

export type HolidayAndSpecialDayException = {
	week: number;
	dayOfWeek: number;
	month: number;
	name: string;
};

export type OmitParamNames =
	| 'created_at'
	| 'user_id'
	| 'start_hour'
	| 'start_minute'
	| 'end_hour'
	| 'end_minute'
	| 'scheduleTypes';

export type Schedule = Omit<Tables<'schedule'>, OmitParamNames> & {
	start_hour: Hour;
	start_minute: Minute;
	end_hour: Hour;
	end_minute: Minute;
};

export type SchduleRegisterInput = Omit<
	TablesInsert<'schedule'>,
	OmitParamNames
> & {
	start_hour: Hour;
	start_minute: Minute;
	end_hour: Hour;
	end_minute: Minute;
	scheduleTypes: number;
};

export type ScheduleUpdateInput = Omit<
	TablesUpdate<'schedule'>,
	'created_at' | 'user_id' | 'day' | 'month' | 'year'
>;
