import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";
import "./notification.css";
import dueIcon from "../../../public/assets/dueIcon.svg"

function Notifications() {
  const { notifications, unreadCount, markAsRead, dismissNotification } =
    useContext(NotificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAsRead();
    }
  };

  const handleDismiss = (e, taskId) => {
    e.stopPropagation();
    dismissNotification(taskId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if deadline is today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    // Check if deadline is tomorrow
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return "Tomorrow";
    }

    // Format as relative date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="notifications-container">
      <button
        className="bell-btn"
        onClick={handleBellClick}
        title="View notifications"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <>
          <div
            className="notifications-overlay"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="notifications-dropdown">
            <div className="notifications-header">
              <h3>Task Notifications</h3>
              <button
                className="close-btn"
                onClick={() => setIsOpen(false)}
                title="Close notifications"
              >
                ✕
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="no-notifications">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.5"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <p>No task notifications</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="notification-item"
                    onClick={() => {
                      const taskId = notification._id;
                      const courseId = notification.course?._id || notification.course;
                      if (courseId && taskId) {
                        setIsOpen(false);
                        navigate(`/course/${courseId}?task=${taskId}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="notification-content">
                      <h4 className="notification-title">
                        {notification.title}
                      </h4>
                      <p className="notification-course">
                        {notification.course?.name || "No course"}
                      </p>
                      <div className="notification-meta">
                        <span className="deadline">
                          <img className='date-Icon' src={dueIcon} alt="Date Icon" /> {formatDate(notification.dueDate)}
                        </span>
                        <span
                          className={`priority priority-${notification.priority?.toLowerCase()}`}
                        >
                          {notification.priority}
                        </span>
                      </div>
                      <span
                        className={`status ${notification.status?.toLowerCase()}`}
                      >
                        {notification.status}
                      </span>
                    </div>
                    <button
                      className="dismiss-btn"
                      onClick={(e) => handleDismiss(e, notification._id)}
                      title="Dismiss notification"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;
