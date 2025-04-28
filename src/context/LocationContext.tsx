'use client';
import { ReactNode, createContext, useContext, useState } from 'react';

interface LocationState {
	latitude: number | null;
	longitude: number | null;
	// eslint-disable-next-line no-unused-vars
	setLocation: (latitude: number, longitude: number) => void;
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

	const setLocation = (newLatitude: number, newLongitude: number) => {
		setLatitude(newLatitude);
		setLongitude(newLongitude);
	};

	return (
		<LocationContext.Provider value={{ latitude, longitude, setLocation }}>
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
