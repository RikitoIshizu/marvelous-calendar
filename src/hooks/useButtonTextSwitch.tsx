import { useState } from "react";

export const useButtonTextSwitch = () => {
  const [isShow, setIsShow] = useState(false);
  const changeIsShow = () => {
    setIsShow((isShow) => !isShow);
  };

  return { isShow, changeIsShow };
};
