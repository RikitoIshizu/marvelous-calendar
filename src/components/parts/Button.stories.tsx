import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Button } from './Button';
import { Button as Btn } from '@/lib/types';

export default {
	title: 'Components/Button',
	component: Button,
	argTypes: {
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

const Template: StoryFn<Btn> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	text: 'Primary Button',
	buttonColor: '#1ea7fd',
	textColor: '#ffffff',
	width: '150',
	type: 'button',
	disabled: false,
};

export const Secondary = Template.bind({});
Secondary.args = {
	text: 'Secondary Button',
	buttonColor: '#e0e0e0',
	textColor: '#000000',
	width: '150',
	type: 'button',
	disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	text: 'Disabled Button',
	buttonColor: '#e0e0e0',
	textColor: '#a0a0a0',
	width: '150',
	type: 'button',
	disabled: false,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	text: 'Wide Button',
	buttonColor: '#ff6347',
	textColor: '#ffffff',
	width: '200',
	type: 'button',
	disabled: false,
};

export const SubmitButton = Template.bind({});
SubmitButton.args = {
	text: 'Submit',
	buttonColor: '#32cd32',
	textColor: '#ffffff',
	width: '150',
	type: 'submit',
	disabled: false,
};
