import { useCallback, useState } from "react";

export const useArray = () => {
  const [text, setText] = useState("");
  const [array, setArray] = useState([]);
  const changeText = useCallback((e) => {
    const { value } = e.target;
    if (value.length >= 6) {
      alert("5文字以内で入力しないと月に代わってお仕置きよ！");
    } else {
      setText(value.trim());
    }
  }, []);

  // const addArrayData = useCallback(() => {
  //   if (!text) {
  //     alert(
  //       "テキストと入力してからボタン押さないと木星に代わってヤキ入れるよ？"
  //     );
  //   } else {
  //     setArray((prevArray) => [...prevArray, text]);
  //     setText("");
  //   }
  // }, [text]);

  const reduceArrayData = useCallback(() => {
    setArray((prevArray) => {
      const amount = prevArray.length;
      return prevArray.filter((arr, index) => index + 1 < amount);
    });
  }, []);

  const resetArrayData = useCallback(() => {
    setArray(() => {
      return [];
    });
  }, []);

  return {
    text,
    array,
    changeText,
    // addArrayData,
    reduceArrayData,
    resetArrayData,
  };
};
