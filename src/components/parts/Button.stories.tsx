// Button.stories.tsx

import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Button } from './Button';
import { Button as Btn } from '@/lib/types';

// メタデータの定義
export default {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		underBarColor: { control: 'color' },
		buttonColor: { control: 'color' },
		textColor: { control: 'color' },
		width: { control: { type: 'number', min: 50, max: 300, step: 10 } },
		type: {
			control: {
				type: 'select',
				options: ['button', 'submit', 'reset'],
			},
		},
		onEventCallBack: { action: 'clicked' },
		disabled: { control: 'boolean' },
		text: { control: 'text' },
	},
} as Meta;

// テンプレートの作成
const Template: StoryFn<Btn> = (args) => <Button {...args} />;

// 各ストーリーの定義

export const Primary = Template.bind({});
Primary.args = {
	text: 'Primary Button',
	underBarColor: '#1ea7fd',
	buttonColor: '#1ea7fd',
	textColor: '#ffffff',
	width: '150',
	type: 'button',
	disabled: false,
};

export const Secondary = Template.bind({});
Secondary.args = {
	text: 'Secondary Button',
	underBarColor: '#e0e0e0',
	buttonColor: '#e0e0e0',
	textColor: '#000000',
	width: '150',
	type: 'button',
	disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	text: 'Disabled Button',
	underBarColor: '#e0e0e0',
	buttonColor: '#e0e0e0',
	textColor: '#a0a0a0',
	width: '150',
	type: 'button',
	disabled: false,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	text: 'Wide Button',
	underBarColor: '#ff6347',
	buttonColor: '#ff6347',
	textColor: '#ffffff',
	width: '200',
	type: 'button',
	disabled: false,
};

export const SubmitButton = Template.bind({});
SubmitButton.args = {
	text: 'Submit',
	underBarColor: '#32cd32',
	buttonColor: '#32cd32',
	textColor: '#ffffff',
	width: '150',
	type: 'submit',
	disabled: false,
};
