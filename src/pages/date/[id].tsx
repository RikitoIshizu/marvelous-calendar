import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState, useCallback, useMemo } from 'react';
import Modal from 'react-modal';

import { Button } from '@/components/atoms/Button';
import { MetaData } from '@/components/atoms/MetaData';
import { InputTitle } from '@/components/molecules/InputTitle';
import { InputDescription } from '@/components/molecules/InputDescription';
import { ScheduleTypes } from '@/components/molecules/ScheduleTypes';

import { specialDays, scheduleTextColor } from '@/lib/calendar';
import {
  getScheduleDetail,
  deleteSchedule,
  updateSchedule,
} from '@/lib/supabase';
import type { Schedule } from '@/lib/types';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '62.5rem',
  },
};

function titleText(date: string): string {
  const today = dayjs();
  const selectDay = dayjs(date);
  const selectDayFormat = selectDay.format('YYYYMMDD');

  if (today.format('YYYYMMDD') === selectDayFormat) {
    return '今日の予定';
  } else if (today.add(1, 'day').format('YYYYMMDD') === selectDayFormat) {
    return '明日の予定';
  } else if (today.add(-1, 'day').format('YYYYMMDD') === selectDayFormat) {
    return '昨日の予定';
  } else if (selectDay.isBefore(today)) {
    return `${selectDay.format('YYYY年M月D日')}に追加された予定`;
  } else {
    return `${selectDay.format('YYYY年M月D日')}の予定`;
  }
}

export default function Date() {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[] | null>(null);

  // 編集用パラメータ
  const [editId, setEditId] = useState<Schedule['id'] | null>(null);
  const [editTitle, setEditTitle] = useState<Schedule['title']>('');
  const [editDescription, setEditDescription] =
    useState<Schedule['description']>('');
  const [editScheduleType, setEditScheduleType] = useState<
    Schedule['scheduleTypes'] | null
  >(null);

  // バリデーション
  const [titleError, setTitleError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');

  const router = useRouter();
  const dateParam: string | string[] | undefined = useRouter().query.id;
  const check: boolean = typeof dateParam === 'string' && !!dateParam;

  const date: string =
    typeof dateParam === 'string' && !!dateParam
      ? dayjs(dateParam).format('YYYY年M月D日')
      : '';
  const pageTitle: string = check ? `${date}の予定` : '';
  const pageDescription: string = check
    ? `${date}の予定を確認・変更・作成ができます。`
    : '';

  const onSetSchedules = useCallback(async () => {
    const date = router.query.id as string;
    const s = await getScheduleDetail(date);
    setSchedules(s);
  }, [router]);

  const specialDay = useMemo((): string => {
    const date = router.query.id as string;
    const md = dayjs(date).format('MMDD');

    return specialDays[md] ? specialDays[md] : '';
  }, []);

  const updSchedule = useCallback(
    async (e: FormEvent<Element>): Promise<void> => {
      e.preventDefault();

      setTitleError(
        !editTitle
          ? 'タイトルを入力しろ、ボケ、普通入力するだろ、アホかお前。'
          : ''
      );
      setDescriptionError(
        !editDescription
          ? 'スケジュールの詳細書かないバカはいないだろ、書け馬鹿野郎'
          : ''
      );

      if (editTitle && editDescription) {
        const response = await updateSchedule({
          id: Number(editId),
          title: editTitle,
          description: editDescription,
          scheduleTypes: Number(editScheduleType),
        });

        if (!response) {
          alert('スケジュール変更完了！');
          setTitleError('');
          setDescriptionError('');
          setIsOpen(false);
          onSetSchedules();
        }
      }
    },
    [editTitle, editDescription, editScheduleType, titleError, descriptionError]
  );

  const openModal = useCallback(
    (id: Schedule['id']): void => {
      const editSchedule = schedules?.filter((el) => el.id === id);

      if (!editSchedule?.length) return;

      setEditId(editSchedule[0].id);
      setEditTitle(editSchedule[0].title);
      setEditDescription(editSchedule[0].description);
      setEditScheduleType(editSchedule[0].scheduleTypes);
      setIsOpen(true);
    },
    [schedules]
  );

  const delSchedule = useCallback(
    async (id: Schedule['id']) => {
      setIsLoad(true);
      const response = await deleteSchedule(id);

      if (!response) {
        onSetSchedules();
        setIsLoad(false);
      }
    },
    [schedules]
  );

  useEffect(() => {
    router.isReady && onSetSchedules();
  }, [router]);

  return (
    <main>
      <MetaData title={pageTitle} description={pageDescription} />
      <section className="my-2 relative">
        {typeof dateParam === 'string' && !!dateParam && (
          <h1 className="text-4xl font-bold text-center">
            {titleText(dateParam)}
          </h1>
        )}
        <div className="w-[1000px] mx-auto">
          {specialDay && (
            <section>
              <h2 className="text-2xl font-bold">今日は何の日？</h2>
              <p className="mt-1">{specialDay}</p>
            </section>
          )}
          {schedules?.length ? (
            <section className="mt-4">
              <h2 className="text-2xl font-bold">登録されているスケジュール</h2>
              {schedules && (
                <ul>
                  {schedules.map((el) => {
                    return (
                      <li className="mt-1 flex items-center" key={el.id}>
                        <p className={scheduleTextColor(el.scheduleTypes)}>
                          {el.description}
                        </p>
                        <button
                          className="ml-2 w-[80px] bg-[blue] text-[#fff] rounded-full"
                          onClick={() => openModal(el.id)}
                        >
                          編集
                        </button>
                        <button
                          className="ml-2 w-[80px] bg-[red] text-[#fff] rounded-full"
                          onClick={() => delSchedule(el.id)}
                        >
                          削除
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ) : null}
          <div className="mt-6">
            <Link href="/" className="w-[100px] h-[50px] bg-[red]s">
              戻る
            </Link>
          </div>
        </div>
      </section>
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form onSubmit={(e: FormEvent<Element>) => updSchedule(e)}>
          <div className="">予定を編集</div>
          <ScheduleTypes
            type={editScheduleType}
            onEventCallBack={(e: string) => setEditScheduleType(Number(e))}
          />
          <InputTitle
            title={editTitle}
            titleError={titleError}
            onChangeTitle={(text: string) => setEditTitle(text)}
          />
          <InputDescription
            description={editDescription}
            descriptionError={descriptionError}
            onchangeDescription={(text: string) => setEditDescription(text)}
          />
          <div className="text-center mt-5">
            <Button
              type="submit"
              text="登録"
              buttonColor="#a7f3d0"
              underBarColor="#059669"
            />
          </div>
        </form>
      </Modal>
      {isLoad && <div className="fixed bg-white w-full h-full">読み込み中</div>}
    </main>
  );
}
