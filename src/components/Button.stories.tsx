import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Button } from './Button';
import { Button as Btn } from 'types/types';

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
	text: 'Default',
};

export const Secondary = Template.bind({});
Secondary.args = {
	text: 'Secondary Button',
	buttonColor: 'bg-[#e0e0e0]',
	textColor: 'text-[#000000]',
	type: 'button',
	disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	text: 'Disabled Button',
	buttonColor: 'bg-[#e0e0e0]',
	textColor: 'text-[#a0a0a0]',
	type: 'button',
	disabled: false,
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
	text: 'Wide Button',
	buttonColor: 'bg-[#ff6347]',
	textColor: 'text-[#ffffff]',
	width: 'w-[200px]',
	type: 'button',
	disabled: false,
};

export const SubmitButton = Template.bind({});
SubmitButton.args = {
	text: 'Submit',
	buttonColor: 'bg-[#32cd32]',
	textColor: 'text-[#ffffff]',
	type: 'submit',
	disabled: false,
};
