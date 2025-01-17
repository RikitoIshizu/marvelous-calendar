export type Button = {
	text: string;
	buttonColor?: string;
	width?: string;
	underBarColor?: string;
	textColor?: string;
	onEventCallBack?: Function;
	disabled?: false;
	type?: 'submit' | 'reset' | 'button';
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

export type ButtonStyleInput = {
	width?: string;
	buttonColor?: string;
	textColor?: string;
	underBarColor?: string;
};

export type ButtonStyle = {
	width?: string;
	backgroundColor?: string;
	color?: string;
	borderBottom?: string;
};

export type Schedule = {
	id: number;
	created_at?: string;
	year: number;
	month: number;
	day: number;
	scheduleTypes: number;
	title: string;
	description: string;
};
