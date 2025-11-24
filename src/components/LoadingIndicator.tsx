'use client';
import { useLoading } from '@/context/LoadingContext';
import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingIndicator: React.FC = () => {
	const { isLoading } = useLoading();

	if (!isLoading) return null;

	return (
		<div className="flex justify-center items-center fixed top-0 z-50 bg-white w-full h-full opacity-80">
			<ClipLoader size={150} color="#36d7b7" />
		</div>
	);
};

export default LoadingIndicator;
