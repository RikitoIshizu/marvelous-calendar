import styles from "/src/styles/Home.module.css";

import { MetaData } from "/src/components/atoms/MetaData";

import { ContentTop } from "/src/components/organisms/ContentTop";
import { Footer } from "/src/components/organisms/Footer";
import { Header } from "/src/components/organisms/Header";
import { Links } from "/src/components/organisms/Links";

// import { useButtonTextSwitch } from "/src/hooks/useButtonTextSwitch";

export function Main(props) {
  // const { isShow, changeIsShow } = useButtonTextSwitch();
  //
  // const {
  //   text,
  //   array,
  //   changeText,
  //   addArrayData,
  //   reduceArrayData,
  //   resetArrayData,
  // } = useArray();

  return (
    <div>
      <MetaData title={props.meta.title} description={props.meta.description} />
      <main className={styles.main}>
        <Header />
        <ContentTop
          title={props.content.title}
          desc={props.content.description}
        />
        <div className={styles.countArea}>
          <div>{props.count}</div>
          <button onClick={props.onChangeCount}>カウント</button>
        </div>
        {/* <input text="text" value={props.text} onChange={props.changeText} />
        <button onClick={changeIsShow}>{isShow ? "表示" : "非表示"}</button>
        <button onClick={props.LinksaddArrayData}>配列を増やす</button>
        {props.array.length ? (
          <div>
            <button onClick={props.reduceArrayData}>配列を減らす</button>
          </div>
        ) : null}
        {props.array.length >= 2 ? (
          <div>
            <button onClick={props.resetArrayData}>配列をリセット</button>
          </div>
        ) : null}
        {props.array.length ? (
          <ul>
            {props.array.map((element, index) => {
              return <li key={index}>{element}</li>;
            })}
          </ul>
        ) : null} */}
        <Links />
      </main>
      <Footer />
    </div>
  );
}
