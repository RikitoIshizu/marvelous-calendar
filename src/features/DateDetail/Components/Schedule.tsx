'use client';
import { Button } from 'components/Button';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { scheduleTextColor } from 'shared/calendar';
import { Schedule as TypeSchedule } from 'types/types';

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
				<h2 className="text-3xl font-bold mr-4">スケジュール</h2>
				{shouldShowScheduleRegisterBtn && (
					<Button
						text="登録"
						textColor="text-[#fff]"
						onEventCallBack={onOpenRegisterScheduleModal}
					/>
				)}
			</div>
			{schedules?.length ? (
				<ul className="mt-4">
					{/* <li className="flex">
						<div className="mr-4 font-bold w-8">時間</div>
						<div className="mr-4 font-bold">予定名</div>
						<div className="font-bold">予定の詳細</div>
					</li> */}
					{schedules.map((el) => {
						return (
							<li className="mt-2 flex items-center" key={el.id}>
								<div className="mr-4">
									{el.start_hour}:{el.start_minute}~{el.end_hour}:
									{el.end_minute}
								</div>
								<h3
									className={`text-2xl mr-4 font-bold ${scheduleTextColor(el.scheduleTypes!)}`}
								>
									{el.title}
								</h3>
								<div className="text-md">{el.description}</div>
								{shouldShowScheduleRegisterBtn && (
									<Button
										text="編集"
										width="w-[80px]"
										textColor="text-[#fff]"
										buttonColor="bg-[blue]"
										otherClasses="ml-4"
										onEventCallBack={() => onOpenModal(el.id)}
									/>
								)}
								<Button
									text="削除"
									width="w-[80px]"
									textColor="text-[#fff]"
									buttonColor="bg-[red]"
									otherClasses="ml-4"
									onEventCallBack={() => confirmShouldDeleteSchedule(el.id)}
								/>
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
