import { useContext } from "react";

import NotificationsContext from "./NotificationsContextValue";

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === null)
    throw new Error(
      "useNotifications was used outside of NotificationsProvider"
    );
  return context;
}

export default useNotifications;
