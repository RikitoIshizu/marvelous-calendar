import classes from "./index.module.css";
import { useCallback, useState } from "react";

const links = [
  {
    title: "Documentation",
    description: "Find in-depth information about Next.js features and API.",
    links: "https://nextjs.org/docs/",
  },
  {
    title: "Learn",
    description: "Learn about Next.js in an interactive course with quizzes!",
    links: "https://nextjs.org/learn/",
  },
  {
    title: "Examples",
    description: "Discover and deploy boilerplate example Next.js projects.",
    links: "https://github.com/vercel/next.js/tree/canary/examples/",
  },
  {
    title: "Deploy",
    description:
      "Instantly deploy your Next.js site to a public URL with Vercel.",
    links:
      "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
  },
];

export function Links() {
  const [items, setItems] = useState(links);

  const removeLink = useCallback(() => {
    setItems((prevArray) => {
      const newArray = prevArray.filter(
        (el, index) => index < prevArray.length - 1
      );
      return newArray;
    });
  }, []);

  return (
    <div>
      <div className={classes.linkSetting}>
        <h2>リンク設定</h2>
        <div className={classes.buttons}>
          <button onClick={removeLink}>減らす</button>
        </div>
      </div>
      <div className={classes.grid}>
        {items.map((el, index) => {
          return (
            <a key={index} href={el.links} className={classes.card}>
              <h2>{el.title} &rarr;</h2>
              <p>{el.description}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
