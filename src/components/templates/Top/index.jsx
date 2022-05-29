// import { Main } from "/src/components/organisms/Main";
import { MetaData } from "/src/components/atoms/MetaData";
import styles from "./index.module.css";
import { Footer } from "/src/components/organisms/Footer";
import { Header } from "/src/components/organisms/Header";

export function Top(propData) {
  const { meta, posts } = propData;
  return (
    <div>
      <MetaData title={meta.title} description={meta.description} />
      <Header />
      <main>
        <h1 className={styles.title}>WelCome To, MYTube!</h1>
        <section className={styles.movieArea}>
          <h2 className={styles.smovieAreaTitle}>今日の動画</h2>
          <div className="w-24 m-4 p-4 rounded-sm bg-red-500 text-center text-white">
            あいうえ
          </div>
          {posts.length ? (
            <ol>
              {posts.map((el) => {
                return <li key={el.id}>{el.title}</li>;
              })}
            </ol>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
