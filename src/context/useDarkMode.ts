import { useContext } from "react";

import DarkModeContext from "./DarkModeContextValue";

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === null)
    throw new Error("useDarkMode was used outside of DarkModeProvider");
  return context;
}

export default useDarkMode;
