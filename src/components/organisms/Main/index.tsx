import styles from "/src/styles/Home.module.css";
import { MetaData } from "/src/components/atoms/MetaData";

import { ContentTop } from "/src/components/organisms/ContentTop";
import { Footer } from "/src/components/organisms/Footer";
import { Header } from "/src/components/organisms/Header";
import { Links } from "/src/components/organisms/Links";

import { useArray } from "/src/hooks/useArray";
import { useCounter } from "/src/hooks/useCounter";

export function Main({ meta, content }) {
  const {
    text,
    array,
    changeText,
    addArrayData,
    reduceArrayData,
    resetArrayData,
  } = useArray();

  const { title, description } = meta;

  const {
    count,
    doubleCount,
    onChangeCount,
    isShow,
    onChangeShow,
    onResetCount,
  } = useCounter();

  return (
    <div>
      <MetaData title={title} description={description} />
      <main className={styles.main}>
        <Header />
        <ContentTop title={content.title} desc={content.description} />
        <div className={styles.countArea}>
          {isShow ? (
            <>
              <div className="flex mb-2">
                <div className="mr-2">
                  <span className="mr-2">カウント数</span>
                  <span className="text-xl">{count}</span>
                </div>
                <div>
                  <span className="mr-2">2倍のカウント数</span>
                  <span className="text-xl">{doubleCount}</span>
                </div>
              </div>
            </>
          ) : null}
          <div>
            <button
              onClick={onChangeShow}
              className="border-2 border-black mr-2"
            >
              カウント{isShow ? "非表示" : "表示"}
            </button>
            {isShow ? (
              <>
                <button
                  onClick={onChangeCount}
                  className="border-2 border-black"
                >
                  カウント
                </button>
                {count ? (
                  <button
                    onClick={onResetCount}
                    className="border-2 border-black ml-2"
                  >
                    リセット
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
        <input text="text" value={text} onChange={changeText} />
        <button onClick={addArrayData}>配列を増やす</button>
        {array.length ? (
          <div>
            <button onClick={reduceArrayData}>配列を減らす</button>
          </div>
        ) : null}
        {array.length >= 2 ? (
          <div>
            <button onClick={resetArrayData}>配列をリセット</button>
          </div>
        ) : null}
        {array.length ? (
          <ul>
            {array.map((element, index) => {
              return <li key={index}>{element}</li>;
            })}
          </ul>
        ) : null}
        <Links />
      </main>
      <Footer />
    </div>
  );
}
