export type Button = {
  text: string;
  buttonColor?: string;
  width?: string;
  underBarColor?: string;
  textColor?: string;
  onEventCallBack: Function;
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
  type: string;
  memo: string;
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
