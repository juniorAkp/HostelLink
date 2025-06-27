import { Router } from "express";
import { getNotifications, markAllNotificationsAsRead, updateNotificationStatus } from "../../controllers/notifications";
import { protect } from "../../middleware/verify";

export const notificationsRouter: any = Router();

notificationsRouter.get("/get-user-notifications", protect, getNotifications);
notificationsRouter.patch("/update-notification-status/:id", protect, updateNotificationStatus);
notificationsRouter.patch("/mark-all-notifications-as-read", protect, markAllNotificationsAsRead);
