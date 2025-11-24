import { FindIp } from '@/types/types';

const findIpApiKey = process.env.FIND_IP_API_KEY;

export const getCoordinate = async (): Promise<
	Pick<FindIp['location'], 'latitude' | 'longitude'>
> => {
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
		throw new Error(`予期せぬエラーが発生しました。${String(error)}`);
	}
};
