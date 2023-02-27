import { Notification, User } from "@prisma/client";
import { Context } from "../../context";

export default {
  Notification: {
    user: async (parent: Notification, _: void, context: Context): Promise<User | null> => {
      return await context.prisma.user.findFirst({
        where: {
          id: parent.user_id
        }
      })
    },
  },
};
