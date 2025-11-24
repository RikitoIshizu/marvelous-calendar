import { useLoading } from '@/context/LoadingContext';

export const useAsyncLoading = <T, Args extends any[]>(
	func: (..._: Args) => Promise<T>,
) => {
	const { setIsLoading } = useLoading();

	const execute = async (...args: Args): Promise<T> => {
		try {
			setIsLoading(true);
			const result = await func(...args);
			return result;
		} catch (error) {
			throw new Error(`予期せぬエラーが発生しました。${String(error)}`);
		} finally {
			setIsLoading(false);
		}
	};

	return execute;
};
