// import { buttonStyles } from "./index";
import { ButtonStyleInput, ButtonStyle } from '../../../lib/types';

async function test(title: string, callback: Function) {
	try {
		await callback();
		console.log(title);
	} catch (error) {
		console.error(error);
		console.error('エラー発見修正箇所あり');
	}
}

function expect(result: ButtonStyleInput) {
	return {
		toBe(expected: ButtonStyle) {
			if (result !== expected) {
				throw Error(`間違えちゃったね〜罰ゲーム！生クリーム一気飲み〜♪`);
			}
		},
	};
}

function buttonStyles(props: ButtonStyleInput) {
	return {
		width: props.width ? `${props.width}px` : '150px',
		backgroundColor: props.buttonColor ? props.buttonColor : 'rgb(3 105 161);',
		color: props.textColor ? props.textColor : '',
		borderBottom: props.underBarColor
			? `5px solid ${props.underBarColor}`
			: '5px solid rgb(3 105 161)',
	};
}

const buttonText: ButtonStyleInput = {
	buttonColor: '#a7f3d0',
	underBarColor: '#059669',
};

test('button collor', () => {
	expect(buttonStyles(buttonText)).toBe({
		width: '150px',
		backgroundColor: '#a7f3d0',
		borderBottom: '#059669',
		color: '',
	});
});
