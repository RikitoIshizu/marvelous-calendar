import { createClient } from '@supabase/supabase-js';
import {
	Schedule,
	ScheduleRegisterInput,
	ScheduleUpdateInput,
} from 'types/types';
import { dayTextCommon } from 'utils/calendar';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const GET_COLUMN =
	'id, year, month, day, scheduleTypes, title, description, start_hour, start_minute, end_hour, end_minute';

export const getSchedule = async (
	year?: Schedule['year'],
	month?: Schedule['month'],
) => {
	try {
		const { data, error, status } =
			year && month
				? await supabase
						.from('schedule')
						.select(GET_COLUMN)
						.match({ year, month })
						.overrideTypes<Schedule[], { merge: false }>()
				: await supabase
						.from('schedule')
						.select(GET_COLUMN)
						.overrideTypes<Schedule[], { merge: false }>();

		if (error && status !== 406) {
			throw new Error(`エラーが発生しました。${error.message}`);
		}

		if (data === null) {
			throw new Error('スケジュールが取得できませんでした。');
		}

		return data!;
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${String(error)}`);
	}
};

export const getScheduleDetail = async (date: string) => {
	const year = dayTextCommon('YYYY', date);
	const month = dayTextCommon('M', date);
	const day = dayTextCommon('D', date);

	try {
		const { data, error, status } = await supabase
			.from('schedule')
			.select(GET_COLUMN)
			.match({ year, month, day })
			.overrideTypes<Schedule[], { merge: false }>();

		if (error && status !== 406) {
			throw new Error(`エラーが発生しました。${error.message}`);
		}

		if (data === null) {
			throw new Error('スケジュールが取得できませんでした。');
		}

		return data;
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${String(error)}`);
	}
};

export const registerScheduleDetail = async (
	registerParams: Omit<ScheduleRegisterInput, 'id'>,
): Promise<null> => {
	try {
		const { error, status } = await supabase
			.from('schedule')
			.insert(registerParams);

		if (error && status !== 406) {
			throw new Error(`エラーが発生しました。${error.message}`);
		}

		return null;
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${String(error)}`);
	}
};

export const deleteSchedule = async (id: Schedule['id']) => {
	try {
		const { error, status } = await supabase
			.from('schedule')
			.delete()
			.eq('id', id);

		if (error && status !== 406) {
			throw new Error(`エラーが発生しました。${error.message}`);
		}

		return null;
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${String(error)}`);
	}
};

export const updateSchedule = async (params: ScheduleUpdateInput) => {
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

	try {
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
			throw new Error(`エラーが発生しました。${error.message}`);
		}

		return null;
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${String(error)}`);
	}
};
