/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { Notification } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function showNotification() {
  const notification = {
    title: 'My App Notification',
    body: 'This is a notification from the app',
  };

  const notificationInstance = new Notification(notification);
  notificationInstance.show(); // 알림을 표시합니다.
}
