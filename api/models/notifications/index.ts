import { sql } from "../../config/db";

//get notifications by user id
export const getNotificationsByUserId = async (userId: number) => {
  try {
    const notifications = await sql`
      SELECT n.id, n.message, n.status, n.created_at
      FROM notifications n
      WHERE n.user_id = ${userId}
      ORDER BY n.created_at DESC;
    `;
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications by user ID:", error);
    throw new Error("Could not fetch notifications");
  }
}

//update notification status
export const updateNotificationStatusfromDb = async (userId: number, notificationId: number) => {
  try {
    await sql`
      UPDATE notifications
      SET status = 'read'
      WHERE id = ${notificationId} AND user_id = ${userId};
    `;
  } catch (error) {
    console.error("Error updating notification status:", error);
    throw new Error("Could not update notification status");
  }
}

//mark all notifications as read
export const markAllNotificationsAsReadfromDb = async (userId: number) => {
  try {
    await sql`
      UPDATE notifications
      SET status = 'read'
      WHERE user_id = ${userId} AND status = 'unread';
    `;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Could not mark all notifications as read");
  }
}