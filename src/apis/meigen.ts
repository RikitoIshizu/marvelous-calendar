import { Quote } from '@/types/types';

export const getQuote = async (amount?: number): Promise<Quote[]> => {
	try {
		const response = await fetch(
			`https://meigen.doodlenote.net/api/json.php?c=${amount || 1}`,
		);
		const data = (await response.json()) as Quote[];

		if (data?.length) return data;

		throw new Error('名言が取得できませんでした。多分、API側の問題です。');
	} catch (error) {
		throw new Error(
			`名言が取得できませんでした。多分、API側の問題です。 ${String(error)}`,
		);
	}
};
