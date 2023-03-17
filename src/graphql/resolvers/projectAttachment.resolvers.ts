import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../generated";
import storeUpload from "../../../src/helper/storeUpload";
import { ProjectAttachmentDocumentType } from "../../../src/helper/constant";
import { getSignedUrl } from "../../../src/helper/awsS3";

const resolvers: Resolvers<Context> = {
  ProjectAttachment: {
    project_connection: async (parent, _, context) => {
      if (!parent.project_connection_id) {
        throw new InternalError("Project connection id not found.");
      }
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id,
        },
      });
    },
    signed_url: async (parent) => {
      if (!parent.key) {
        throw new InternalError('Key not found');
      }
      return await getSignedUrl(parent.key);
    }
  },
  Mutation: {
    uploadDocuments: async (parent, args, context) => {
      const { files, project_connection_id } = args;
      if (files) {
        const result = await Promise.all(files.map(async (f) => {
          const { filename, key, filesize, contextType } = await storeUpload(f, 'documents');
          const attachment = await context.prisma.projectAttachment.create({
            data: {
              byte_size: filesize,
              document_type: ProjectAttachmentDocumentType.FILE,
              filename,
              key,
              project_connection_id,
              content_type: contextType,
            }
          });

          return attachment;
        }));
        return result.map((r) => ({
          ...r,
          byte_size: Number(r.byte_size) / 1000,
        }));
      }
      return []
    },
    uploadContract: async (parent, args, context) => {
      const { file, project_connection_id } = args;

      const existingContract = await context.prisma.projectAttachment.findFirst({
        where: {
          project_connection_id,
          document_type: ProjectAttachmentDocumentType.FINAL_CONTACT,
        },
      });

      const { filename, key, filesize, contextType } = await storeUpload(file, 'final_contracts');

      let attachment;

      // If contract exist, replace with new version.
      if (existingContract) {
        attachment = await context.prisma.projectAttachment.update({
          data: {
            byte_size: filesize,
            filename,
          },
          where: {
            id: existingContract.id,
          },
        });
      } else {
        // Else create a new one.
        attachment = await context.prisma.projectAttachment.create({
          data: {
            byte_size: filesize,
            document_type: ProjectAttachmentDocumentType.FINAL_CONTACT,
            filename,
            key,
            project_connection_id,
            content_type: contextType,
          }
        });
      }

      return {
        ...attachment,
        byte_size: Number(attachment.byte_size) / 1000,
      };
    }
  },
};

export default resolvers;
