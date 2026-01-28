"use client";

import { type RefObject, useEffect } from "react";

export function useOutsideClick(
  // biome-ignore lint/suspicious/noExplicitAny: ref can be any element type
  ref: RefObject<any>,
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    }

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}
