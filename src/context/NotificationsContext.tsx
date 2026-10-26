import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useLocalStorageState from "../hooks/useLocalStorageState";
import { API_URL, getToken } from "../services/apiClient";
import NotificationsContext from "./NotificationsContextValue";

const MAX_NOTIFICATIONS = 50;
const RECONNECT_DELAY_MS = 5000;

function cabinLabel(booking) {
  return booking?.cabins?.name ? `Cabin ${booking.cabins.name}` : "a cabin";
}

function guestLabel(booking) {
  return booking?.guests?.fullName ?? "A guest";
}

function describe(event) {
  const booking = event?.booking;
  if (!booking) return null;

  const cabin = cabinLabel(booking);
  const guest = guestLabel(booking);

  if (event.type === "booking.created")
    return {
      type: "new-booking",
      title: "New booking",
      body: `${guest} booked ${cabin} for ${booking.numNights ?? "?"} nights`,
    };

  if (event.type !== "booking.updated") return null;

  // The API sends the previous row alongside the new one, so a real change can
  // be told apart from an unrelated edit.
  const previous = event.previous ?? {};

  if (booking.status === "checked-in" && previous.status !== "checked-in")
    return {
      type: "checked-in",
      title: "Guest checked in",
      body: `${guest} arrived at ${cabin}`,
    };

  if (booking.status === "checked-out" && previous.status !== "checked-out")
    return {
      type: "checked-out",
      title: "Guest checked out",
      body: `${guest} left ${cabin}`,
    };

  if (booking.isPaid && !previous.isPaid)
    return {
      type: "payment-confirmed",
      title: "Payment confirmed",
      body: `${guest} paid for ${cabin}`,
    };

  return null;
}

function NotificationsProvider({ children }) {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useLocalStorageState(
    [],
    "bookingNotifications"
  );
  const [isLive, setIsLive] = useState(false);

  const addNotification = useCallback(
    (entry) => {
      setNotifications((current) => {
        if (current.some((item) => item.key === entry.key)) return current;
        return [entry, ...current].slice(0, MAX_NOTIFICATIONS);
      });
    },
    [setNotifications]
  );

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    let source;
    let reconnectTimer;
    let isActive = true;

    function refreshBookingQueries(bookingId) {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["today-activity"] });
      queryClient.invalidateQueries({ queryKey: ["cabin-booked-ranges"] });
      if (bookingId !== undefined && bookingId !== null)
        queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    }

    function handleMessage(message) {
      let event;
      try {
        event = JSON.parse(message.data);
      } catch {
        return;
      }

      // Any change at all refreshes the tables, whether or not it is worth
      // announcing — that is what keeps two open tabs in step.
      refreshBookingQueries(event?.booking?.id ?? event?.id);

      const described = describe(event);
      if (!described) return;

      addNotification({
        key: `${event.booking.id}:${described.type}`,
        type: described.type,
        bookingId: event.booking.id,
        title: described.title,
        body: described.body,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }

    function connect() {
      if (!isActive) return;

      // EventSource cannot send an Authorization header, so the token travels
      // in the query string. The API verifies it the same way.
      source = new EventSource(
        `${API_URL}/events?token=${encodeURIComponent(token)}`
      );

      source.onopen = () => setIsLive(true);
      source.onmessage = handleMessage;

      source.onerror = () => {
        setIsLive(false);
        source.close();
        // The browser's own retry does not re-run our auth, so reconnect here.
        reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    }

    connect();

    return () => {
      isActive = false;
      setIsLive(false);
      clearTimeout(reconnectTimer);
      source?.close();
    };
  }, [queryClient, addNotification]);

  const markAllRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => (item.read ? item : { ...item, read: true }))
    );
  }, [setNotifications]);

  const markRead = useCallback(
    (key) => {
      setNotifications((current) =>
        current.map((item) =>
          item.key === key ? { ...item, read: true } : item
        )
      );
    },
    [setNotifications]
  );

  const clearAll = useCallback(
    () => setNotifications([]),
    [setNotifications]
  );

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLive,
        markAllRead,
        markRead,
        clearAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export { NotificationsProvider };
