import { SearchParams } from '@/types/types';

//
export const checkSearchParams = (searchParams: SearchParams) => {
	// 数値ではなかったら、エラー
	if (isNaN(Number(searchParams.year)) || isNaN(Number(searchParams.month))) {
		throw new Error('年月日が数値ではありません。');
	}

	// if (Number(searchParams.year) < 1970) {
	// 	throw new Error('年の値が不正です。1970年以降で指定してください。');
	// }

	// 月が1から12の間でなかったら、エラー
	if (Number(searchParams.month) < 1 || Number(searchParams.month) > 12) {
		throw new Error('月の値が不正です。1から12の間で指定してください。');
	}
};
