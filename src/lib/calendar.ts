import dayjs from 'dayjs';
import { HolidayAndSpecialDayException } from './types';
import type { Schedule } from './types';

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

export const specialDayList: { date: string; name: string }[] = [
  { date: '0101', name: 'ヴィジュアル系バンド・NIGHTMAREのバンド結成日' },
  { date: '0106', name: 'セーラーサターンの誕生日' },
  { date: '0107', name: '人日の節句' },
  { date: '0111', name: '鏡開き' },
  { date: '0115', name: '小正月' },
  { date: '0127', name: 'セーラーウラヌスの誕生日' },
  { date: '0201', name: '旧正月' },
  { date: '0203', name: '節分' },
  { date: '0208', name: '針供養' },
  { date: '0214', name: 'バレンタインデー' },
  { date: '0303', name: '雛祭り' },
  { date: '0306', name: 'セーラーネプチューンの誕生日' },
  { date: '0308', name: '国際女性デー' },
  { date: '0314', name: 'ホワイトデー' },
  { date: '0321', name: 'ロックマンエグゼが発売された日' },
  { date: '0401', name: 'エイプリルフール' },
  { date: '0408', name: '花祭り' },
  { date: '0417', name: 'セーラーマーズの誕生日' },
  { date: '0420', name: 'MOTHER3が発売された日' },
  { date: '0610', name: '時の記念日' },
  { date: '0630', name: 'セーラームーンの誕生日' },
  { date: '0701', name: '山・海開き' },
  { date: '0706', name: 'セーラームーンの連載が始まった日' },
  { date: '0707', name: '七夕' },
  { date: '0707', name: 'ヴィジュアル系バンド・vistlipのバンド結成日' },
  { date: '0727', name: 'MOTHERが発売された日' },
  { date: '0806', name: '広島原爆の日' },
  { date: '0809', name: '長崎原爆の日' },
  { date: '0815', name: '終戦記念日' },
  { date: '0827', name: 'MOTHER2が発売された日' },
  { date: '0909', name: '重陽の節句' },
  { date: '0910', name: 'セーラーマーキュリーの誕生日' },
  { date: '1022', name: 'セーラーヴィーナスの誕生日' },
  { date: '1029', name: 'セーラープルートの誕生日' },
  { date: '1031', name: 'ハロウィン' },
  { date: '1115', name: '七五三' },
  { date: '1119', name: '国際男性デー' },
  { date: '1205', name: 'セーラージュピターの誕生日' },
  { date: '1225', name: 'クリスマス' },
  { date: '1231', name: '大晦日' },
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
  '0306': 'セーラーネプチューンの誕生日',
  '0308': '国際女性デー',
  '0314': 'ホワイトデー',
  '0321': 'ロックマンエグゼが発売された日',
  '0401': 'エイプリルフール',
  '0408': '花祭り',
  '0417': 'セーラーマーズの誕生日',
  '0420': 'MOTHER3が発売された日',
  '0610': '時の記念日',
  '0630': 'セーラームーンの誕生日',
  '0701': '山・海開き',
  '0706': 'セーラームーンの連載が始まった日',
  '0707': '七夕',
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

export const dayTextCommmon = (
  format: string,
  date?: string | undefined
): string => {
  return date ? dayjs(date).format(format) : dayjs().format(format);
};

export const YearAndMonthAndDateList = (
  yearAndMonth: string,
  isNeedDay?: boolean
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
