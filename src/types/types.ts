import { Database } from './supabase-generated-types';

export type Button = {
	text: string;
	buttonColor?: string;
	width?: string;
	textColor?: string;
	onEventCallBack?: () => void;
	disabled?: false;
	type?: 'submit' | 'reset' | 'button';
	otherClasses?: string;
};

export type HolidayAndSpecialDayException = {
	week: number;
	dayOfWeek: number;
	month: number;
	name: string;
};

export type Schedule = Pick<
	Database['public']['Tables']['schedule']['Row'],
	'day' | 'description' | 'id' | 'month' | 'scheduleTypes' | 'title' | 'year'
>;

export type SchduleRegisterInput = Pick<
	Database['public']['Tables']['schedule']['Insert'],
	'year' | 'month' | 'day' | 'description' | 'scheduleTypes' | 'title'
>;

export type ScheduleUpdateInput = Pick<
	Database['public']['Tables']['schedule']['Update'],
	'id' | 'title' | 'description' | 'scheduleTypes'
>;
