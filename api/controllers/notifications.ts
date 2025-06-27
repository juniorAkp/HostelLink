import { Response, Request } from "express";
import { getNotificationsByUserId, markAllNotificationsAsReadfromDb, updateNotificationStatusfromDb } from "../models/notifications";

export const getNotifications = async (req: Request, res: Response) => { 
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(400).json({ message: "unauthorized", success:false });
  }
  try { 
    const notifications =  await getNotificationsByUserId(userId as number)
    return res.status(200).json({ notifications, success: true });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}

export const updateNotificationStatus = async (req: Request, res: Response) => { 
  const userId = req.user?.userId as number;
  const notificationId = req.params.id as unknown as number;
  if (!userId || !notificationId) {
    return res.status(400).json({ message: "unauthorized", success:false });
  }
  try {
    await updateNotificationStatusfromDb(userId, notificationId);
    return res.status(200).json({ message: "Notification status updated", success: true });
  } catch (error) {
    console.error("Error updating notification status:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}

export const markAllNotificationsAsRead = async (req: Request, res: Response) => { 
  const userId = req.user?.userId as number;
  if (!userId) {
    return res.status(400).json({ message: "unauthorized", success:false });
  }
  try {
    await markAllNotificationsAsReadfromDb(userId);
    return res.status(200).json({ message: "All notifications marked as read", success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}