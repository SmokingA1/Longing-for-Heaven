import { useEffect } from "react";

export const useLockBodyScroll = (shouldLock: boolean) => {

  useEffect(() => {
    if (shouldLock) {
      // блокуємо прокрутку
      document.body.style.overflow = "hidden";
    } else {
      // повертаємо як було
      document.body.style.overflow = "";
    }
  }, [shouldLock]);
};
