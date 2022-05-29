import { useCallback, useMemo, useState } from "react";

export const useCounter = () => {
  const [count, setCount] = useState(0);
  const [isShow, changeShow] = useState(true);

  const doubleCount = useMemo(() => {
    return count * 2;
  }, [count]);

  const onChangeCount = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  const onChangeShow = useCallback(() => {
    changeShow((prevVal) => !prevVal);
  }, []);

  const onResetCount = useCallback(() => {
    setCount(() => 0);
  }, []);

  return {
    count,
    doubleCount,
    isShow,
    onChangeCount,
    onChangeShow,
    onResetCount,
  };
};
