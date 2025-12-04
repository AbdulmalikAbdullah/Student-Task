import "./notification.css";
import { createPortal } from "react-dom";

function Notification({ message, type }) {
    const node = (
        <div className={`notification-${type}`}>
            {message}
        </div>
    );
    return createPortal(node, document.body);
}

export default Notification;