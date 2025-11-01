'use client';
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

interface LocationState {
	latitude: number | null;
	longitude: number | null;
	setLocation: (_latitude: number, _longitude: number) => void;
}

const initialState: LocationState = {
	latitude: null,
	longitude: null,
	setLocation: () => {},
};

const LocationContext = createContext<LocationState>(initialState);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
	const [latitude, setLatitude] = useState<LocationState['latitude']>(null);
	const [longitude, setLongitude] = useState<LocationState['longitude']>(null);

	const setLocation = useCallback(
		(newLatitude: number, newLongitude: number) => {
			setLatitude(newLatitude);
			setLongitude(newLongitude);
		},
		[],
	);

	const value = useMemo(
		() => ({ latitude, longitude, setLocation }),
		[latitude, longitude, setLocation],
	);

	return (
		<LocationContext.Provider value={value}>
			{children}
		</LocationContext.Provider>
	);
};

export const useLocation = () => {
	const context = useContext(LocationContext);
	if (!context) {
		throw new Error('useLocation must be used within a LocationProvider');
	}
	return context;
};
