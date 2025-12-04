import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axiosConfig.js";
import socket from "../api/socket.js";

export const NotificationContext = createContext();

export function NotificationProvider({ children, user }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get("/tasks/notifications/user");
      setNotifications(res.data || []);
      // Count tasks that are still pending
      const unread = res.data.filter(task => task.status === "Pending").length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  // Setup socket listeners
  useEffect(() => {
    if (!user?.id) return;

    // Join user's personal notification room
    socket.emit("joinUser", user.id);

    // Listen for new task assignments
    socket.on("taskAssigned", (task) => {
      console.log("New task assigned:", task);
      setNotifications(prev => [task, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Listen for task updates (deadline changes, status changes, etc.)
    socket.on("taskUpdated", (updatedTask) => {
      console.log("Task updated:", updatedTask);
      setNotifications(prev => {
        const index = prev.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = updatedTask;
          return updated;
        }
        return prev;
      });
      // Update unread count if status changed
      const unread = notifications.filter(t => t._id !== updatedTask._id && t.status === "Pending").length;
      setUnreadCount(updatedTask.status === "Pending" ? unread + 1 : unread);
    });

    return () => {
      socket.off("taskAssigned");
      socket.off("taskUpdated");
    };
  }, [user?.id]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const dismissNotification = useCallback((taskId) => {
    setNotifications(prev => prev.filter(t => t._id !== taskId));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        dismissNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
