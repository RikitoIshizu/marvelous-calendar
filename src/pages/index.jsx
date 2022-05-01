import { Main } from "/src/components/organisms/Main";

export default function Home(props) {
  const pageData = {
    meta: {
      title: "トップページ",
      description: "トップページの説明文",
    },
    content: {
      title: "パタヤビーチへようこそ！",
      description: "パタヤビーチとは〜",
    },
  };
  console.log(props);
  console.log("作動さよ");
  return (
    <Main
      meta={pageData.meta}
      content={pageData.content}
      // {...props.counter}
      // {...props.inputArray}
    />
  );
}
