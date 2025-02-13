import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Props, Radio } from './Radio';

export default {
	title: 'Components/Radio',
	component: Radio,
	argTypes: {
		name: { control: 'text' },
		id: { control: 'text' },
		inputName: { control: 'text' },
		onEventCallBack: { action: 'clicked' },
		selectedId: { control: 'text' },
	},
} as Meta;

const Template: StoryFn<Props> = (args) => <Radio {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	name: 'ラベル名',
	id: '1',
	inputName: 'labelname',
	selectedId: '1',
	onEventCallBack: (id: string) => alert(id),
};
