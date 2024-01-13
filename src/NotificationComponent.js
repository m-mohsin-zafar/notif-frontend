// src/NotificationComponent.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./NotificationComponent.css"; // Import the CSS file for styling

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState({ 'unread': [], 'read': []});
  const userId = "100"; // Replace with the actual user ID

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      query: { userId },
    });

    // Listen for notifications
    socket.on("notification", (notificationData) => {
        // console.log(notificationData);
      setNotifications(notificationData);
    });

    return () => {
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3001/mark-notification-as-read/${userId}/${notificationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Notification marked as read successfully, update the state or perform any other action
        console.log(`Notification ${notificationId} marked as read`);
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {notifications['unread'].map((notification, index) => (
        <div key={index} className="notification">
          <div className="notification-header">
            <p>{notification.id}</p>
          </div>
          <div className="notification-body">
            <p>{notification.text}</p>
          </div>
          <div className="notification-footer">
            <button onClick={() => markAsRead(notification.id)}>
              Mark as Read
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;
