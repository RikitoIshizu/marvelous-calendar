import { Main } from "/src/components/organisms/Main";

export default function About(props) {
  const pageData = {
    meta: {
      title: "aboutページ",
      description: "aboutページの説明文",
    },
    content: {
      title: "パタヤビーチについての説明",
      description:
        "パタヤビーチとは笑う犬の冒険でネタとして話題になったあの場所です。",
    },
  };
  console.log(props);
  return <Main meta={pageData.meta} content={pageData.content} />;
}
