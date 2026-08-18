import {
  createContext,
  useContext,
  useState,
} from "react";

const NotificationContext = createContext(null);

const MAX_NOTIFICATIONS = 20;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  function notify(message) {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      time: Date.now(),
      unread: true,
    };

    setNotifications((previous) =>
      [notification, ...previous].slice(
        0,
        MAX_NOTIFICATIONS
      )
    );
  }

  function dismissNotification(id) {
    setNotifications((previous) =>
      previous.filter(
        (notification) => notification.id !== id
      )
    );
  }

  function clearNotifications() {
    setNotifications([]);
  }

  function markAllRead() {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.unread
          ? { ...notification, unread: false }
          : notification
      )
    );
  }

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        notify,
        dismissNotification,
        clearNotifications,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  return useContext(NotificationContext);
}
