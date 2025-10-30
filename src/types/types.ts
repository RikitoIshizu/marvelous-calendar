import { getCoordinate } from 'apis/ipstack';
import { fetchCurrentWeather, fetchMonthlyWeather } from 'apis/weather';
import { Hour, Minute } from 'utils/time';
import { Tables, TablesInsert, TablesUpdate } from './supabase-generated-types';

export type CurrentWeather = {
	temperature?: number;
	weatherCode?: number;
	windSpeed?: number;
	windDirection?: number;
};

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

export type Calendar = {
	keyOfDayOfWeek: number;
	order: number;
	date: string;
};

export type WeeklyDay = {
	days: Calendar[];
	week: number;
};

export type MonthlyWeatherData = Record<
	string,
	{
		weatherCode: number;
		temperatureMax: number;
		temperatureMin: number;
	}
>;

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
	| 'end_minute';

export type Schedule = Omit<Tables<'schedule'>, OmitParamNames> & {
	start_hour: Hour;
	start_minute: Minute;
	end_hour: Hour;
	end_minute: Minute;
};

export type ScheduleRegisterInput = Omit<
	TablesInsert<'schedule'>,
	OmitParamNames
> & {
	start_hour: Hour;
	start_minute: Minute;
	end_hour: Hour;
	end_minute: Minute;
};

export type ScheduleUpdateInput = Omit<
	TablesUpdate<'schedule'>,
	'created_at' | 'user_id' | 'day' | 'month' | 'year'
>;

export type FetchCurrentWeather = Awaited<
	ReturnType<typeof fetchCurrentWeather>
>;

export type FetchMonthlyWeather = Awaited<
	ReturnType<typeof fetchMonthlyWeather>
>;

export type GetCoordinate = Awaited<ReturnType<typeof getCoordinate>>;

export type FindIp = {
	city: {
		geoname_id: number;
		names: {
			en: string;
		};
	};
	continent: {
		code: string;
		geoname_id: number;
		names: {
			de: string;
			en: string;
			es: string;
			fa: string;
			fr: string;
			ja: string;
			ko: string;
			'pt-BR': string;
			ru: string;
			'zh-CN': string;
		};
	};
	country: {
		geoname_id: number;
		is_in_european_union: boolean;
		iso_code: string;
		names: {
			de: string;
			en: string;
			es: string;
			fa: string;
			fr: string;
			ja: string;
			ko: string;
			'pt-BR': string;
			ru: string;
			'zh-CN': string;
		};
	};
	location: {
		latitude: number;
		longitude: number;
		time_zone: string;
		weather_code: string;
	};
	postal: {
		code: string;
	};
	subdivisions: Array<{
		geoname_id: number;
		iso_code?: string;
		names: {
			de?: string;
			en: string;
			es?: string;
			fa?: string;
			fr?: string;
			ja: string;
			ko?: string;
			'pt-BR'?: string;
			ru?: string;
			'zh-CN'?: string;
		};
	}>;
	traits: {
		autonomous_system_number: number;
		autonomous_system_organization: string;
		connection_type: string;
		isp: string;
		organization: string;
		user_type: string;
	};
};
