import { FlamePc } from "../../organisms/Flame/Pc";
import { isMobile } from "react-device-detect";

export function Top() {
  if (!isMobile) {
    return <FlamePc />;
  }

  return <div>まだ作ってないページ</div>;
}
