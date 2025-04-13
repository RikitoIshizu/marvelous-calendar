import { Tables, TablesInsert, TablesUpdate } from './supabase-generated-types';

export type HolidayAndSpecialDayException = {
	week: number;
	dayOfWeek: number;
	month: number;
	name: string;
};

export type Schedule = Omit<Tables<'schedule'>, 'created_at' | 'user_id'>;

export type SchduleRegisterInput = Omit<
	TablesInsert<'schedule'>,
	'created_at' | 'user_id' | 'id'
>;

export type ScheduleUpdateInput = Omit<
	TablesUpdate<'schedule'>,
	'created_at' | 'user_id' | 'day' | 'month' | 'year'
>;
