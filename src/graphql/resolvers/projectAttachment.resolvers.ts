import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../generated";
import mime from "mime-types";
import storeUpload from "../../helper/storeUpload";
import { ProjectAttachmentDocumentType, PROJECT_ATTACHMENT_DOCUMENT_TYPE } from "../../helper/constant";
import { deleteObject, getSignedUrl } from "../../helper/awsS3";
import { getZohoContractEditorUrl } from "../../helper/zoho";
import createFileUploadNotification from "../../notification/fileUploadNotification";
import { sendFileUploadNoticeEmailQueue } from "../../queues/mailer.queues";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

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
    },
    formatted_filesize: async (parent,) => {
      if (parent.byte_size) {
        return formatBytes(parent.byte_size);
      }
      return null;
    },
    zoho_editor_url: async (parent, _, context) => {
      if (parent.document_type === PROJECT_ATTACHMENT_DOCUMENT_TYPE[ProjectAttachmentDocumentType.REDLINE_FILE] && parent.filename) {
        const mimeType = mime.lookup(parent.filename);
        if (mimeType !== 'application/pdf') {
          try {
            const user = await context.prisma.user.findFirstOrThrow({
              where: {
                id: context.req.user_id,
              },
            });
            const url = await getZohoContractEditorUrl(parent, user);
            return url;
          } catch {
            return null;
          }
        }
      }
      return null;
    },
  },
  Mutation: {
    uploadDocuments: async (parent, args, context) => {
      const { files, project_connection_id } = args;

      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }

      const  customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: project_connection_id,
        },
        include: {
          customer_connections: true,
          vendor_member_connections: true,
        },
      });
      if (!projectConnection) {
        throw new InternalError('Project connection not found');
      }

      let users;
      if (customer) {
        // user is customer
        users = await context.prisma.user.findMany({
          where: {
            id: {
              in: projectConnection.customer_connections.map(cc => cc.customer_id),
            },
          },
        });
      } else {
        // user is vendor member
        users = await context.prisma.user.findMany({
          where: {
            id: {
              in: projectConnection.vendor_member_connections.map(vmc => vmc.vendor_member_id),
            },
          },
        });
      }

      if (files) {
        const result = await Promise.all(files.map(async (f) => {
          const { filename, key, filesize, contextType } = await storeUpload(
            f,
            PROJECT_ATTACHMENT_DOCUMENT_TYPE[ProjectAttachmentDocumentType.FILE],
          );
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

        sendFileUploadNoticeEmailQueue.add({
          projectConnectionId: project_connection_id,
          uploaderUserId: context.req.user_id,
          isFinalContract: false,
        });

        return result.map((r) => ({
          ...r,
          byte_size: Number(r.byte_size) / 1000,
          document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[r.document_type],
        }));
      }

      await Promise.all(
        users.map(user => {
          createFileUploadNotification(context.req.user_id!, user.id, projectConnection.id);
        })
      );

      return []
    },
    uploadContract: async (parent, args, context) => {
      const { file, project_connection_id } = args;

      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }

      const  customer = await context.prisma.customer.findFirst({
        where: {
          user_id: context.req.user_id,
        },
      });

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: project_connection_id,
        },
        include: {
          customer_connections: true,
          vendor_member_connections: true,
        },
      });
      if (!projectConnection) {
        throw new InternalError('Project connection not found');
      }
      
      return await context.prisma.$transaction(async (trx) => {
        const existingContract = await context.prisma.projectAttachment.findFirst({
          where: {
            project_connection_id,
            document_type: ProjectAttachmentDocumentType.REDLINE_FILE,
          },
        });

        const { filename, key, filesize, contextType } = await storeUpload(
          file,
          PROJECT_ATTACHMENT_DOCUMENT_TYPE[ProjectAttachmentDocumentType.REDLINE_FILE],
        );

        let attachment;

        // If contract exist, replace with new version.
        if (existingContract) {
          attachment = await context.prisma.projectAttachment.update({
            data: {
              byte_size: filesize,
              filename,
              key,
            },
            where: {
              id: existingContract.id,
            },
          });
          // delete the old contract s3 object
          await deleteObject(existingContract.key);

          sendFileUploadNoticeEmailQueue.add({
            projectConnectionId: project_connection_id,
            uploaderUserId: context.req.user_id,
            isFinalContract: true,
            action: 'update',
          });
        } else {
          // Else create a new one.
          attachment = await context.prisma.projectAttachment.create({
            data: {
              byte_size: filesize,
              document_type: ProjectAttachmentDocumentType.REDLINE_FILE,
              filename,
              key,
              project_connection_id,
              content_type: contextType,
            }
          });

          sendFileUploadNoticeEmailQueue.add({
            projectConnectionId: project_connection_id,
            uploaderUserId: context.req.user_id,
            isFinalContract: true,
            action: 'upload',
          });
        }

        let users;
        if (customer) {
          // user is customer
          users = await context.prisma.user.findMany({
            where: {
              id: {
                in: projectConnection.customer_connections.map(cc => cc.customer_id),
              },
            },
          });
        } else {
          // user is vendor member
          users = await context.prisma.user.findMany({
            where: {
              id: {
                in: projectConnection.vendor_member_connections.map(vmc => vmc.vendor_member_id),
              },
            },
          });
        }

        await Promise.all(
          users.map(user => {
            createFileUploadNotification(context.req.user_id!, user.id, projectConnection.id);
          })
        );

        return {
          ...attachment,
          byte_size: Number(attachment.byte_size) / 1000,
          document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[attachment.document_type],
        };
      }, {
        timeout: 30000, // 30 seconds
      });
    },
    removeAttachment: async (parent, args, context) => {
      const { id } = args;
      return await context.prisma.$transaction(async (trx) => {
        const deletedAttachment = await trx.projectAttachment.delete({
          where: {
            id,
          },
        });

        await deleteObject(deletedAttachment.key);
        return {
          ...deletedAttachment,
          byte_size: Number(deletedAttachment.byte_size),
          document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[deletedAttachment.document_type],
        };
      })
    },
  },
};

export default resolvers;
