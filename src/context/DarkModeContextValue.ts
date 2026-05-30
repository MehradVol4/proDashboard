import { createContext } from "react";

export type DarkModeContextValue = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextValue | null>(null);
DarkModeContext.displayName = "DarkModeContext";

export default DarkModeContext;

