import dayjs from 'dayjs';
import { HolidayAndSpecialDayException, type Schedule } from 'types/types';

type Calendar = {
	keyOfDayOfWeek: number;
	order: number;
	date: string;
};

type WeeklyDay = {
	days: Calendar[];
	week: number;
};

export const holiday: Record<string, string> = {
	'0101': '元日',
	'0211': '建国記念日',
	'0223': '天皇誕生日',
	'0321': '春分の日',
	'0429': '昭和の日',
	'0503': '憲法記念日',
	'0504': 'みどりの日',
	'0505': 'こどもの日',
	'0811': '山の日',
	'0923': '秋分の日',
	'1103': '文化の日',
	'1123': '勤労感謝の日',
};

export const holidayAndSpecialDayException: HolidayAndSpecialDayException[] = [
	{
		week: 2,
		dayOfWeek: 1,
		month: 1,
		name: '成人の日',
	},
	{
		week: 2,
		dayOfWeek: 0,
		month: 5,
		name: '母の日',
	},
	{
		week: 3,
		dayOfWeek: 0,
		month: 6,
		name: '父の日',
	},
	{
		week: 3,
		dayOfWeek: 1,
		month: 7,
		name: '海の日',
	},
	{
		week: 3,
		dayOfWeek: 1,
		month: 9,
		name: '敬老の日',
	},
	{
		week: 2,
		dayOfWeek: 1,
		month: 10,
		name: 'スポーツの日',
	},
];

export const specialDays: Record<string, string> = {
	'0101': 'ヴィジュアル系バンド・NIGHTMAREのバンド結成日',
	'0106': 'セーラーサターンの誕生日',
	'0107': '人日の節句',
	'0111': '鏡開き',
	'0115': '小正月',
	'0127': 'セーラーウラヌスの誕生日',
	'0201': '旧正月',
	'0203': '節分',
	'0208': '針供養',
	'0214': 'バレンタインデー',
	'0303': '雛祭り',
	'0305': 'NIGHTMARE・ギター、棺さんの誕生日',
	'0306': 'セーラーネプチューンの誕生日',
	'0308': '国際女性デー',
	'0314': 'ホワイトデー',
	'0321': 'ロックマンエグゼが発売された日',
	'0401': 'エイプリルフール',
	'0408': '花祭り',
	'0417': 'セーラーマーズの誕生日',
	'0420': 'MOTHER3が発売された日',
	'0609': 'NIGHTMARE・ドラム、RUKAさんの誕生日',
	'0610': '時の記念日',
	'0623': 'NIGHTMARE・ベース、Ni~yaさんの誕生日',
	'0629': 'NIGHTMARE・ギター、咲人さんの誕生日',
	'0630': 'セーラームーンの誕生日',
	'0701': '山・海開き',
	'0706': 'セーラームーンの連載が始まった日',
	'0707': '七夕',
	'0714': 'NIGHTMARE・ボーカル、YOMIさんの誕生日',
	'0727': 'MOTHERが発売された日',
	'0806': '広島原爆の日',
	'0809': '長崎原爆の日',
	'0815': '終戦記念日',
	'0827': 'MOTHER2が発売された日',
	'0909': '重陽の節句',
	'0910': 'セーラーマーキュリーの誕生日',
	'1022': 'セーラーヴィーナスの誕生日',
	'1029': 'セーラープルートの誕生日',
	'1031': 'ハロウィン',
	'1115': '七五三',
	'1119': '国際男性デー',
	'1205': 'セーラージュピターの誕生日',
	'1225': 'クリスマス',
	'1231': '大晦日',
};

export const dayTextCommon = (
	format: string,
	date?: string | undefined,
): string => {
	return date ? dayjs(date).format(format) : dayjs().format(format);
};

export const yearAndMonthAndDateList = (
	yearAndMonth: string,
	isNeedDay?: boolean,
): { yearList: string[]; monthList: string[]; dayList?: string[] } => {
	let yearList: string[] = [];
	let monthList: string[] = [];
	let dayList: string[] = [];

	for (let i = -5; i < 6; i++) {
		const addYear: string = dayjs(yearAndMonth).add(i, 'year').format('YYYY');
		yearList = [...yearList, addYear];
	}

	for (let i = 1; i <= 12; i++) {
		const addMonth = i.toString().padStart(2, '0');
		monthList = [...monthList, addMonth];
	}

	if (isNeedDay) {
		return { yearList, monthList, dayList };
	}

	return { yearList, monthList };
};

export const amountOfDay = (yearAndMonth: string) => {
	const startMonth: string = dayjs(yearAndMonth)
		.startOf('month')
		.format('YYYY-MM-DD');
	const endMonth: string = dayjs(yearAndMonth)
		.endOf('month')
		.format('YYYY-MM-DD');

	return dayjs(endMonth).diff(startMonth, 'day') + 1;
};

export const monthList = [
	'01',
	'02',
	'03',
	'04',
	'05',
	'06',
	'07',
	'08',
	'09',
	'10',
	'11',
	'12',
];

export const scheduleTextColor = (id: Schedule['id']): string => {
	switch (id) {
		case 1:
			return 'text-red-500';
		case 2:
			return 'text-sky-500';
		case 3:
			return 'text-emerald-500';
		case 4:
			return 'text-lime-800';
		case 5:
			return 'text-yellow-600';
		default:
			return 'text-gray-500';
	}
};

export const getCalendarDays = (val: number) => {
	const setYAndM = dayjs().add(val, 'month').format('YYYY-MM');

	// カレンダーを取得する
	// その月の全日付を取得
	let nowCalendar: Calendar[] = [];

	// まずは現在見ている月のカレンダーの日付を取得する
	for (var i = 1; i <= amountOfDay(setYAndM); i++) {
		const day = i.toString().padStart(2, '0');
		const yearAndMonth = dayTextCommon('YYYY-MM', setYAndM);
		const date = dayTextCommon('YYYY-MM-DD', `${yearAndMonth}-${day}`);
		const keyOfDayOfWeek = dayjs(date).day();
		const order =
			nowCalendar.filter((el: Calendar) => el.keyOfDayOfWeek === keyOfDayOfWeek)
				.length + 1;

		const setData: Calendar = { date, keyOfDayOfWeek: keyOfDayOfWeek, order };
		nowCalendar = [...nowCalendar, setData];
	}

	// 足りない前後の月の日付を取得する。
	let prevMonthDate: Calendar[] = [];
	let nextMonthDate: Calendar[] = [];

	nowCalendar.forEach((date) => {
		const d = dayjs(date.date);
		const day: number = d.date();

		if (day === 1) {
			// 月初の場合、前月の足りない日数を追加する
			if (date.keyOfDayOfWeek) {
				for (var i = date.keyOfDayOfWeek; i > 0; i--) {
					const addPrevMonthDate = d.add(-i, 'day');
					prevMonthDate = [
						...prevMonthDate,
						{
							date: addPrevMonthDate.format('YYYY-MM-DD'),
							keyOfDayOfWeek: addPrevMonthDate.day(),
							order: 1,
						},
					];
				}
			}
		} else if (day === nowCalendar.length) {
			// 月末の場合、次月の足りない日数を追加する
			if (date.keyOfDayOfWeek !== 6) {
				for (var n = 1; n <= 6 - date.keyOfDayOfWeek; n++) {
					const addPrevMonthDate = d.add(n, 'day');
					nextMonthDate = [
						...nextMonthDate,
						{
							date: addPrevMonthDate.format('YYYY-MM-DD'),
							keyOfDayOfWeek: addPrevMonthDate.day(),
							order: 6,
						},
					];
				}
			}
		}
	});

	const displayCalendar = [...prevMonthDate, ...nowCalendar, ...nextMonthDate];

	let datePerWeek: WeeklyDay[] = [];
	let oneWeek: Calendar[] = [];
	let week = 1;

	// 週ごとに分ける
	displayCalendar.forEach((date: Calendar) => {
		oneWeek = [...oneWeek, date];

		if (date.keyOfDayOfWeek === 6) {
			const addData: WeeklyDay[] = [{ week, days: oneWeek }];

			datePerWeek = [...datePerWeek, ...addData];
			oneWeek = [];
			week++;
		}
	});

	return datePerWeek;
};
