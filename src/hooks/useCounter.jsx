import { useCallback, useState } from "react";

export const useCounter = () => {
  const [count, setCount] = useState(0);
  const onChangeCount = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return { count, onChangeCount };
};
