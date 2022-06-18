import type { NextPage } from "next";
// import { Main } from "../components/organisms/Main";

let te: string = "asas";
let num: number = 0;
var saa: Array<string> = ["あいうえお"];
const aiueo = "aiueo" as string;

type strEnum = "black" | "white" | "red";
const val = "black" as strEnum;

type PokemonType =
  | "ノーマル"
  | "ほのお"
  | "みず"
  | "くさ"
  | "でんき"
  | "こおり"
  | "かくとう"
  | "どく"
  | "じめん"
  | "ひこう"
  | "エスパー"
  | "むし"
  | "いわ"
  | "ゴースト"
  | "ドラゴン"
  | "あく"
  | "はがね"
  | "フェアリー";

const Pt: PokemonType = "ノーマル";

const vsRaceValue: [string, number] = ["イーブイの進化系の種族値の合計", 525];

let PokeType = Pt;

const hydroPumpPp: unknown = 5;

function deoxysForm(val: unknown): string {
  if (typeof val === "number") return "ノーマルフォルム";
  else if (typeof val === "string") return "アタックフォルム";
  else if (typeof val === "boolean") return "ディフェンスフォルム";
  return "スピードフォルム";
}

let lg: number = hydroPumpPp;

const double = (x: number): number => {
  return x * 2;
};

const colors = (x: number): strEnum => {
  if (x < 0) return "black";
  else if (x === 0) return "white";
  else return "red";
};

const About: NextPage = () => {
  // const pageData = {
  //   meta: {
  //     title: "aboutページ",
  //     description: "aboutページの説明文",
  //   },
  //   content: {
  //     title: "パタヤビーチについての説明",
  //     description:
  //       "パタヤビーチとは笑う犬の冒険でネタとして話題になったあの場所です。",
  //   },
  // };
  // return <Main meta={pageData.meta} content={pageData.content} />;

  return (
    <div>
      {val}の{double(2)}の{colors(1)}
    </div>
  );
};

export default About;
