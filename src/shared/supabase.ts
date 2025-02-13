import {
	SchduleRegisterInput,
	Schedule,
	ScheduleUpdateInput,
} from 'types/types';
import { createClient } from '@supabase/supabase-js';
import { dayTextCommmon } from './calendar';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const GET_COLUMN =
	'id, year, month, day, scheduleTypes, title, description, start_hour, start_minute, end_hour, end_minute';

export const getSchedule = async (
	year?: Schedule['year'],
	month?: Schedule['month'],
): Promise<Schedule[]> => {
	const { data, error, status } =
		year && month
			? await supabase
					.from('schedule')
					.select(GET_COLUMN)
					.match({ year, month })
			: await supabase.from('schedule').select(GET_COLUMN);

	if (error && status !== 406) {
		throw error;
	}
	return data as Schedule[];
};

export const getScheduleDetail = async (date: string): Promise<Schedule[]> => {
	const year = dayTextCommmon('YYYY', date);
	const month = dayTextCommmon('M', date);
	const day = dayTextCommmon('D', date);

	const { data, error, status } = await supabase
		.from('schedule')
		.select(GET_COLUMN)
		.match({ year, month, day });

	if (error && status !== 406) {
		throw error;
	}
	return data as Schedule[];
};

export const registerScheduleDetail = async (
	registerParams: SchduleRegisterInput,
): Promise<null> => {
	const {
		year,
		month,
		day,
		scheduleTypes,
		title,
		description,
		start_hour,
		start_minute,
		end_hour,
		end_minute,
	} = registerParams;

	const { error, status } = await supabase.from('schedule').insert({
		year,
		month,
		day,
		scheduleTypes,
		title,
		description,
		start_hour,
		start_minute,
		end_hour,
		end_minute,
	});

	if (error && status !== 406) {
		throw error;
	}
	return null;
};

export const deleteSchedule = async (id: Schedule['id']): Promise<null> => {
	const { error, status } = await supabase
		.from('schedule')
		.delete()
		.eq('id', id);

	if (error && status !== 406) {
		throw error;
	}
	return null;
};

export const updateSchedule = async (
	params: ScheduleUpdateInput,
): Promise<null> => {
	const {
		id,
		title,
		description,
		scheduleTypes,
		start_hour,
		start_minute,
		end_hour,
		end_minute,
	} = params;
	const { error } = await supabase
		.from('schedule')
		.update({
			title,
			description,
			scheduleTypes,
			start_hour,
			start_minute,
			end_hour,
			end_minute,
		})
		.eq('id', id);

	if (error) {
		throw error;
	}

	return null;
};
