import { describe, expect, it, test } from 'vitest';
import { amountOfDay, dayTextCommmon, scheduleTextColor } from './calendar';

describe('calendar.tsのテスト', () => {
	describe('scheduleTextColor', () => {
		it('引数が1の時は、text-red-500', () => {
			expect(scheduleTextColor(1)).toBe('text-red-500');
		});
		it('引数が2の時は、text-sky-500', () => {
			expect(scheduleTextColor(2)).toBe('text-sky-500');
		});
		it('引数が3の時は、text-emerald-500', () => {
			expect(scheduleTextColor(3)).toBe('text-emerald-500');
		});
		it('引数が4の時は、text-lime-800', () => {
			expect(scheduleTextColor(4)).toBe('text-lime-800');
		});
		it('引数が5の時は、text-yellow-600', () => {
			expect(scheduleTextColor(5)).toBe('text-yellow-600');
		});
		it('それ以外の時は、text-gray-500', () => {
			expect(scheduleTextColor(8)).toBe('text-gray-500');
		});
	});

	describe('amountOfDay', () => {
		it('31日ある月', () => {
			expect(amountOfDay('202405')).toBe(31);
		});
		it('30日ある月', () => {
			expect(amountOfDay('202404')).toBe(30);
		});
		describe('2月', () => {
			it('28日しかない年', () => {
				expect(amountOfDay('202302')).toBe(28);
			});
			it('閏年', () => {
				expect(amountOfDay('202402')).toBe(29);
			});
		});
	});

	describe('dayTextCommmon', () => {
		it('年だけを取得', () => {
			expect(dayTextCommmon('YYYY', '20210525')).toBe('2021');
		});
		it('月だけを取得', () => {
			expect(dayTextCommmon('MM', '20210525')).toBe('05');
		});
		it('日だけを取得', () => {
			expect(dayTextCommmon('DD', '20210525')).toBe('25');
		});
		it('年と月を取得', () => {
			expect(dayTextCommmon('YYYYMM', '20210525')).toBe('202105');
		});
		it('月と日を取得', () => {
			expect(dayTextCommmon('MMDD', '20210525')).toBe('0525');
		});
	});
});
