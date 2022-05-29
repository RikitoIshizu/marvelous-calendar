import Link from "next/link";
import classes from "./index.module.css";

export function Header() {
  const links = [
    { title: "トップページ", link: "/" },
    { title: "MYTubeについて", link: "/about/" },
    { title: "お気に入りチャンネルリスト", link: "/favorite/" },
    { title: "見たくないチャンネルリスト", link: "/hate/" },
  ];
  return (
    <div className={classes.header}>
      {links.map((el, index) => {
        return (
          <Link key={index} href={el.link}>
            <a href={el.link} className={classes.link}>
              {el.title}
            </a>
          </Link>
        );
      })}
    </div>
  );
}
