'use client';
import { Button } from '@/components/parts/Button';
import { Schedule as TypeSchedule } from '@/lib/types';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { scheduleTextColor } from '@/lib/calendar';

export const Schedule = ({
	schedules,
	date,
	onOpenRegisterScheduleModal,
	onOpenModal,
	onDeleteSchedule,
}: {
	schedules: TypeSchedule[];
	date: string;
	onOpenRegisterScheduleModal: () => void;
	onOpenModal: Function;
	onDeleteSchedule: Function;
}) => {
	const shouldShowScheduleRegisterBtn = useMemo(() => {
		return dayjs(date).isAfter(dayjs());
	}, [date]);

	const confirmShouldDeleteSchedule = (id: number) => {
		window.confirm('本当に削除してもよろしいですか？') && onDeleteSchedule(id);
	};

	return (
		<section className="mt-4">
			<div className="flex">
				<h2 className="text-2xl font-bold mr-4">スケジュール</h2>
				{shouldShowScheduleRegisterBtn && (
					<Button
						text="登録"
						textColor="#fff"
						onEventCallBack={onOpenRegisterScheduleModal}
					/>
				)}
			</div>
			{schedules.length ? (
				<ul className="mt-4">
					{schedules.map((el) => {
						return (
							<li className="mt-1 flex items-center" key={el.id}>
								<p className={scheduleTextColor(el.scheduleTypes)}>
									{el.description}
								</p>
								<button
									className="ml-2 w-[80px] bg-[blue] text-[#fff] rounded-full"
									onClick={() => onOpenModal(el.id)}
								>
									編集
								</button>
								<button
									className="ml-2 w-[80px] bg-[red] text-[#fff] rounded-full"
									onClick={() => confirmShouldDeleteSchedule(el.id)}
								>
									削除
								</button>
							</li>
						);
					})}
				</ul>
			) : (
				<div className="mt-4">スケジュールは登録されていません。</div>
			)}
		</section>
	);
};
