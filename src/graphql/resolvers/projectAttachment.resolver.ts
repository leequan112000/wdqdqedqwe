import { ProjectAttachment, ProjectConnection } from "@prisma/client";
import { Context } from "../../context";

export default {
  ProjectAttachment: {
    project_connection: async (parent: ProjectAttachment, _: void, context: Context): Promise<ProjectConnection | null> => {
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id
        }
      })
    },
  },
};
