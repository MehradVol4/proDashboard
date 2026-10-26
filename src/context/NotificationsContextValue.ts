import { createContext } from "react";

export type AppNotification = {
  key: string;
  type: "new-booking" | "checked-in" | "checked-out" | "payment-confirmed";
  bookingId: number | string | null;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  isLive: boolean;
  markAllRead: () => void;
  // eslint-disable-next-line no-unused-vars
  markRead: (key: string) => void;
  clearAll: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
);
NotificationsContext.displayName = "NotificationsContext";

export default NotificationsContext;
