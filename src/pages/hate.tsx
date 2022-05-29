import { Main } from "/src/components/organisms/Main";

export default function About(props) {
  const pageData = {
    meta: {
      title: "見たくないYoutuberページ",
      description: "favroriteページの説明文",
    },
    content: {
      title: "チャンネル非表示のページ",
      description:
        "パタヤビーチとは笑う犬の冒険でネタとして話題になったあの場所です。",
    },
  };
  return (
    <Main
      meta={pageData.meta}
      content={pageData.content}
      counter={props.counter}
      inputArray={props.inputArray}
    />
  );
}
