import Link from "next/link";
import classes from "./index.module.css";

export function Header() {
  return (
    <div className={classes.header}>
      <Link href="/">
        <a href="/about" className={classes.link}>
          トップページ
        </a>
      </Link>
      <Link href="/about">
        <a href="/about" className={classes.link}>
          このサイトについて
        </a>
      </Link>
    </div>
  );
}
