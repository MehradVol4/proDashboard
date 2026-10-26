import { useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi2";
import { formatDistanceToNow } from "date-fns";

import ButtonIcon from "./ButtonIcon";
import useOutsideClick from "../hooks/useOutsideClick";
import { useNotifications } from "../context/useNotifications";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Badge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  min-width: 1.8rem;
  height: 1.8rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background-color: var(--color-red-700);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 36rem;
  max-height: 44rem;
  overflow-y: auto;
  background-color: var(--surface-1);
  border: 1px solid var(--border-1);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(12px);
  z-index: 100;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1.2rem 1.6rem;
  border-bottom: 1px solid var(--border-1);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1.2rem;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-brand-600);
  cursor: pointer;

  &:disabled {
    color: var(--color-grey-400);
    cursor: not-allowed;
  }
`;

const LiveDot = styled.span`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 999px;
  background-color: ${(props) =>
    props.$isLive ? "var(--color-green-700)" : "var(--color-grey-400)"};
  display: inline-block;
`;

const Item = styled.button`
  width: 100%;
  text-align: left;
  background: ${(props) =>
    props.$unread ? "var(--surface-2)" : "transparent"};
  border: none;
  border-bottom: 1px solid var(--border-1);
  padding: 1.2rem 1.6rem;
  cursor: pointer;
  display: grid;
  gap: 0.4rem;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--color-grey-100);
  }
`;

const ItemTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const ItemBody = styled.span`
  font-size: 1.3rem;
  color: var(--color-grey-600);
`;

const ItemTime = styled.span`
  font-size: 1.1rem;
  color: var(--color-grey-500);
`;

const EmptyState = styled.p`
  padding: 2.4rem 1.6rem;
  font-size: 1.3rem;
  color: var(--color-grey-500);
  text-align: center;
`;

function relativeTime(value) {
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return "";
  }
}

function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, isLive, markAllRead, markRead, clearAll } =
    useNotifications();

  const close = useCallback(() => setIsOpen(false), []);
  const ref = useOutsideClick(close);

  function handleOpenBooking(notification) {
    markRead(notification.key);
    close();
    if (notification.bookingId)
      navigate(`/bookings/${notification.bookingId}`);
  }

  return (
    <Wrapper ref={ref}>
      <ButtonIcon
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
          unreadCount
            ? `Activity — ${unreadCount} unread`
            : "Activity"
        }
      >
        <HiOutlineBell />
      </ButtonIcon>

      {unreadCount > 0 && (
        <Badge>{unreadCount > 9 ? "9+" : unreadCount}</Badge>
      )}

      {isOpen && (
        <Panel>
          <PanelHeader>
            <span>
              <LiveDot $isLive={isLive} />{" "}
              {isLive ? "Live activity" : "Not connected"}
            </span>
            <HeaderActions>
              <TextButton
                type="button"
                onClick={markAllRead}
                disabled={!unreadCount}
              >
                Mark all read
              </TextButton>
              <TextButton
                type="button"
                onClick={clearAll}
                disabled={!notifications.length}
              >
                Clear
              </TextButton>
            </HeaderActions>
          </PanelHeader>

          {notifications.length === 0 ? (
            <EmptyState>
              Nothing yet. New bookings, check-ins and payments will show up
              here as they happen.
            </EmptyState>
          ) : (
            notifications.map((notification) => (
              <Item
                key={notification.key}
                type="button"
                $unread={!notification.read}
                onClick={() => handleOpenBooking(notification)}
              >
                <ItemTitle>{notification.title}</ItemTitle>
                <ItemBody>{notification.body}</ItemBody>
                <ItemTime>{relativeTime(notification.createdAt)}</ItemTime>
              </Item>
            ))
          )}
        </Panel>
      )}
    </Wrapper>
  );
}

export default NotificationsMenu;
