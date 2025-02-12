import { Database } from './supabase-ganerated-types';

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

export type SchduleRegisterInput = {
	selectYear: string;
	selectMonth: string;
	selectDay: string;
	type: number;
	description: string;
	title: string;
};

export type Schedule = Pick<
	Database['public']['Tables']['schedule']['Row'],
	'day' | 'description' | 'id' | 'month' | 'scheduleTypes' | 'title' | 'year'
>;
