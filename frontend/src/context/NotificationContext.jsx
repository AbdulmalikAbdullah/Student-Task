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
      // Count unread notifications (all assigned tasks, regardless of status)
      setUnreadCount(res.data.length);
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
      setNotifications(prev => {
        const index = prev.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = updatedTask;
          return updated;
        }
        return prev;
      });
      // Update unread count based on current notifications
      setUnreadCount(prev => {
        const isTaskInList = notifications.some(t => t._id === updatedTask._id);
        if (isTaskInList) {
          // Task is already in list, count remains the same
          return prev;
        } else {
          // New task added, increment count
          return prev + 1;
        }
      });
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
    setUnreadCount(prev => Math.max(0, prev - 1));
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
