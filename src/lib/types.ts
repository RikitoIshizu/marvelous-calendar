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
