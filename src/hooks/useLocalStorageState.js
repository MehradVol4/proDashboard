import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    if (typeof window === "undefined") return initialState;

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(
    function () {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore write errors (e.g. private mode, quota exceeded)
      }
    },
    [value, key]
  );

  return [value, setValue];
}

export default useLocalStorageState;
