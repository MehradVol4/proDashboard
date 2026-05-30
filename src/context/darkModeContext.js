import { createContext } from "react";

const DarkModeContext = createContext(null);
DarkModeContext.displayName = "DarkModeContext";

export default DarkModeContext;

// Named export so `import { DarkModeProvider } from "./context/DarkModeContext"`
// works on case-insensitive filesystems (Windows) where this file is resolved.
export { DarkModeProvider } from "./DarkModeContext.jsx";
