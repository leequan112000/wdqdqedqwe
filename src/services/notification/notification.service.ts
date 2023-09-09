import { Notification } from "@prisma/client"
import { ServiceContext } from "../../types/context";

type MarkNotificationsAsReadArgs = {
  notifications: Notification[];
}

const markNotificationsAsRead = async (args: MarkNotificationsAsReadArgs, context: ServiceContext) => {
  const { notifications } = args;

  const notificationIds = notifications.map((n) => n.id);
  const readAt = new Date();

  const updateTasks = notificationIds.map(async (id) => {
    return await context.prisma.notification.update({
      where: {
        id,
      },
      data: {
        read_at: readAt,
      },
    });
  });

  const updatedNotifications = await Promise.all(updateTasks);

  return updatedNotifications;
}

const notificationService = {
  markNotificationsAsRead,
}

export default notificationService;
