import { useLoading } from 'context/LoadingContext';

// eslint-disable-next-line no-unused-vars
export const useAsyncLoading = <T>(func: (...args: any[]) => Promise<T>) => {
	const { setIsLoading } = useLoading();

	const execute = async (...args: any[]) => {
		try {
			setIsLoading(true);
			const result = await func(...args);
			return result;
		} finally {
			setIsLoading(false);
		}
	};

	return execute;
};
