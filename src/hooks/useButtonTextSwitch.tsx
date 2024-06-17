import { useState } from "react";

export const useButtonTextSwitch = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const changeIsShow = () => {
    setIsShow((isShow) => !isShow);
  };

  return { isShow, changeIsShow };
};
