import { LocationProvider } from 'context/LocationContext';
import { ReactNode } from 'react';
import 'styles/globals.css';
import 'tailwindcss/tailwind.css';

import { LoadingProvider } from 'context/LoadingContext';
import LoadingIndicator from 'components/LoadingIndicator';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<link rel="icon" href="/favicon.ico" />
				<title>おもいでをおもいだせるカレンダー</title>
				<meta
					name="description"
					content="ぼくがかんがえた すごい カレンダー だよ。"
				/>
			</head>
			<body>
				<LocationProvider>
					<LoadingProvider>
						<LoadingIndicator />
						{children}
					</LoadingProvider>
				</LocationProvider>
			</body>
		</html>
	);
}
