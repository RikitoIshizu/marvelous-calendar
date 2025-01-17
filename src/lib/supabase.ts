import { createClient } from '@supabase/supabase-js';
import type { Schedule } from './types';
import dayjs from 'dayjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const GET_COLUMN = 'id, year, month, day, scheduleTypes, title, description';

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
	const dateParams = dayjs(date);
	const year = dateParams.format('YYYY');
	const month = dateParams.format('M');
	const day = dateParams.format('D');

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
	registerParams: Pick<
		Schedule,
		'year' | 'month' | 'day' | 'scheduleTypes' | 'title' | 'description'
	>,
): Promise<null> => {
	const { year, month, day, scheduleTypes, title, description } =
		registerParams;

	const { error, status } = await supabase
		.from('schedule')
		.insert({ year, month, day, scheduleTypes, title, description });

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
	params: Pick<Schedule, 'id' | 'title' | 'description' | 'scheduleTypes'>,
): Promise<null> => {
	const { id, title, description, scheduleTypes } = params;
	const { error } = await supabase
		.from('schedule')
		.update({ title, description, scheduleTypes })
		.eq('id', id);

	if (error) {
		throw error;
	}

	return null;
};
