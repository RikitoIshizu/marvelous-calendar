import React from "react";

type Props = {
  title: string;
  titleError: string;
  onChangeTitle: Function;
};

export function InputTitle(props: Props): React.ReactElement {
  const { title, titleError, onChangeTitle } = props;

  return (
    <div className="mt-3">
      <div className="flex">
        <label htmlFor="title" className="mr-2">
          タイトル:
        </label>
        <input
          name="title"
          value={title}
          className="resize-none border-2 rounded-lg border-slate-900 w-[300px]"
          placeholder="スケジュールのタイトルを入力"
          onChange={(e) => {
            onChangeTitle(e.target.value);
          }}
        />
      </div>
      {titleError && <p className="text-xs text-[red]">{titleError}</p>}
    </div>
  );
}
