import fetch from 'node-fetch';
import { FindIp } from 'types/types';

const findIpApiKey = process.env.FINDIP_API_KEY;

export const getCoordinate = async () => {
	try {
		const ipResponse = await fetch('https://api.ipify.org?format=json');
		const ipAddress = (await ipResponse.json()) as { ip?: string };

		const coordinateResponse = await fetch(
			`https://api.findip.net/${ipAddress.ip}/?token=${findIpApiKey}`,
		);

		const coordinate = (await coordinateResponse.json()) as FindIp;

		return {
			latitude: coordinate.location.latitude,
			longitude: coordinate.location.longitude,
		};
	} catch (error) {
		throw new Error(`予期せぬエラーが発生しました。${JSON.stringify(error)}`);
	}
};
