import { useEffect } from "react";

export const useChangeBgColor = () => {
  useEffect(() => {
    // マウント時の処理
    // console.log("マウント");
    document.body.style.backgroundColor = "lightblue";

    // アンマウント時の処理
    return () => {
      // console.log("アンマウント");
      document.body.style.backgroundColor = "";
    };
  }, []);
};
