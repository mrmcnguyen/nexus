'use client';
import { useNotifications } from "../contexts/NotificationContext";
import { NotificationToast } from "./NotificationToast";

export function NotificationContainer() {
    const { notifications, removeToastNotification } = useNotifications();
    
    console.log('Current notifications in container:', notifications);
  
    return (
      <div className="fixed top-2 right-2 z-[9999] space-y-2 min-w-[300px] p-2">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeToastNotification(notification.id)}
          />
        ))}
      </div>
    );
}