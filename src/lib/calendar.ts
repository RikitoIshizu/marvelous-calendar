import dayjs from "dayjs";
import { HolidayAndSpecialDayException } from "./types";

export const holiday: Record<string, string> = {
  "0101": "元日",
  "0211": "建国記念日",
  "0223": "天皇誕生日",
  "0321": "春分の日",
  "0429": "昭和の日",
  "0503": "憲法記念日",
  "0504": "みどりの日",
  "0505": "こどもの日",
  "0811": "山の日",
  "0923": "秋分の日",
  "1103": "文化の日",
  "1123": "勤労感謝の日",
};

export const holidayAndSpecialDayException: HolidayAndSpecialDayException[] = [
  {
    week: 2,
    dayOfWeek: 1,
    month: 1,
    name: "成人の日",
  },
  {
    week: 2,
    dayOfWeek: 0,
    month: 5,
    name: "母の日",
  },
  {
    week: 3,
    dayOfWeek: 0,
    month: 6,
    name: "父の日",
  },
  {
    week: 3,
    dayOfWeek: 1,
    month: 7,
    name: "海の日",
  },
  {
    week: 3,
    dayOfWeek: 1,
    month: 9,
    name: "敬老の日",
  },
  {
    week: 2,
    dayOfWeek: 1,
    month: 10,
    name: "スポーツの日",
  },
];

export const specialDays: Record<string, string> = {
  "0106": "セーラーサターンの誕生日",
  "0107": "人日の節句",
  "0111": "鏡開き",
  "0115": "小正月",
  "0127": "セーラーウラヌスの誕生日",
  "0201": "旧正月",
  "0203": "節分",
  "0208": "針供養",
  "0214": "バレンタインデー",
  "0303": "雛祭り",
  "0306": "セーラーネプチューンの誕生日",
  "0308": "国際女性デー",
  "0314": "ホワイトデー",
  "0401": "エイプリルフール",
  "0408": "花祭り",
  "0417": "セーラーマーズの誕生日",
  "0420": "MOTHER3が発売された日",
  "0610": "時の記念日",
  "0630": "セーラームーンの誕生日",
  "0701": "山・海開き",
  "0706": "セーラームーンの連載が始まった日",
  "0707": "七夕",
  "0727": "MOTHERが発売された日",
  "0806": "広島原爆の日",
  "0809": "長崎原爆の日",
  "0815": "終戦記念日",
  "0827": "MOTHER2が発売された日",
  "0909": "重陽の節句",
  "0910": "セーラーマーキュリーの誕生日",
  "1022": "セーラーヴィーナスの誕生日",
  "1029": "セーラープルートの誕生日",
  "1031": "ハロウィン",
  "1115": "七五三",
  "1119": "国際男性デー",
  "1205": "セーラージュピターの誕生日",
  "1225": "クリスマス",
  "1231": "大晦日",
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
    const addYear: string = dayjs(yearAndMonth).add(i, "year").format("YYYY");
    yearList = [...yearList, addYear];
  }

  for (let i = 1; i <= 12; i++) {
    const addMonth = i.toString().padStart(2, "0");
    monthList = [...monthList, addMonth];
  }

  if (isNeedDay) {
    return { yearList, monthList, dayList };
  }

  return { yearList, monthList };
};

export const amountOfDay = (yearAndMonth: string) => {
  const startMonth: string = dayjs(yearAndMonth)
    .startOf("month")
    .format("YYYY-MM-DD");
  const endMonth: string = dayjs(yearAndMonth)
    .endOf("month")
    .format("YYYY-MM-DD");

  return dayjs(endMonth).diff(startMonth, "day") + 1;
};

export const monthList = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];