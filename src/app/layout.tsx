import { ReactNode } from 'react';
import 'styles/globals.css';
import 'tailwindcss/tailwind.css';
import { LocationProvider } from '../context/LocationContext';

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
				<LocationProvider>{children}</LocationProvider>
			</body>
		</html>
	);
}
