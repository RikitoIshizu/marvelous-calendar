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

export type HolidayAndSpecialDayException = {
  week: number;
  dayOfWeek: number;
  month: number;
  name: string;
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
  "0107": "人日の節句",
  "0111": "鏡開き",
  "0115": "小正月",
  "0201": "旧正月",
  "0203": "節分",
  "0208": "針供養",
  "0214": "バレンタインデー",
  "0303": "雛祭り",
  "0314": "ホワイトデー",
  "0401": "エイプリルフール",
  "0408": "花祭り",
  "0610": "時の記念日",
  "0701": "山・海開き",
  "0707": "七夕",
  "0806": "広島原爆の日",
  "0809": "長崎原爆の日",
  "0815": "終戦記念日",
  "0909": "重陽の節句",
  "1031": "ハロウィン",
  "1115": "七五三",
  "1225": "クリスマス",
  "1231": "大晦日",
};
