// import { Main } from "/src/components/organisms/Main";
import { Top } from "/src/components/templates/Top";
import { useCallback, useEffect, useState } from "react";

export default function Index(props) {
  const [posts, setPosts] = useState([]);
  console.log(posts);

  const getPosts = useCallback(async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const json = await res.json();
    setPosts(json);
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const pageData = {
    meta: {
      title: "MYTube",
      description:
        "MYTubeは自分の見たいYouTubeチャンネルだけを表示できるチャンネルです。",
    },
    content: {
      title: "Welcome to MYTube!",
      description:
        "あなたのお気にいりのYouTube動画だけを観ることができる素晴らしいテレビです。",
    },
  };

  return <Top meta={pageData.meta} posts={posts} />;
}
