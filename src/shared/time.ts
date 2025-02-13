export const HOURS = [
	'00',
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
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
	'19',
	'20',
	'21',
	'22',
	'23',
] as const;
export const MINUTES = ['00', '30'] as const;

export type Hour = (typeof HOURS)[number];
export type Minute = (typeof MINUTES)[number];
