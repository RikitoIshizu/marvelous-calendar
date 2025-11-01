'use client';
import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useMemo,
	useState,
} from 'react';

interface LoadingContextType {
	isLoading: boolean;
	setIsLoading: (_isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);

	const value = useMemo(() => ({ isLoading, setIsLoading }), [isLoading]);

	return (
		<LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
	);
};

export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error('useLoading must be used within a LoadingProvider');
	}
	return context;
};
