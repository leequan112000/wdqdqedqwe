import { Context } from "../../types/context";
import { InternalError } from "../errors/InternalError";
import { Resolvers } from "../../generated";
import mime from "mime-types";
import storeUpload from "../../helper/storeUpload";
import { ProjectAttachmentDocumentType, PROJECT_ATTACHMENT_DOCUMENT_TYPE } from "../../helper/constant";
import { deleteObject, getSignedUrl } from "../../helper/awsS3";
import { getZohoContractEditorUrl } from "../../helper/zoho";
import { sendFileUploadNotificationQueue } from "../../queues/notification.queues";
import { Readable } from 'stream';
import UploadLimitTracker from '../../helper/uploadLimitTracker';
import { PublicError } from '../errors/PublicError';
import { byteToKB } from "../../helper/filesize";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

async function getBuffer(stream: Readable): Promise<{ buffer: Buffer, byteSize: number }> {
  let byteSize = 0;
  const chunks: any[] = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => {
      byteSize += chunk.length;
      chunks.push(chunk);
    });

    stream.on('end', () => {
      resolve({
        buffer: Buffer.concat(chunks),
        byteSize,
      })
    });

    stream.on('error', (err: Error) => {
      reject(err);
    });
  })
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

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: project_connection_id,
        }
      });
      if (!projectConnection) {
        throw new InternalError('Project connection not found');
      }

      const user = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
        },
      });

      let uploadLimitTracker: UploadLimitTracker;

      if (user?.customer?.biotech_id) {
        uploadLimitTracker = new UploadLimitTracker();
        await uploadLimitTracker.init(user.customer.biotech_id)
      }

      if (files) {
        const result = await Promise.allSettled(files.map(async (f) => {
          const uploadData = await f;

          if (uploadLimitTracker) {
            const stream = uploadData.createReadStream();
            const { byteSize } = await getBuffer(stream);
            const filesizeKB = byteToKB(byteSize);
            const canUpload = uploadLimitTracker.validateFilesize(filesizeKB);
            if (canUpload) {
              uploadLimitTracker.addUsed(filesizeKB)
            } else {
              throw new PublicError(`Not enought space - ${uploadData.filename}`)
            }
          }

          const { filename, key, filesize, contextType } = await storeUpload(
            uploadData,
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

        if (result.filter((r) => r.status === 'fulfilled').length > 0) {
          sendFileUploadNotificationQueue.add({
            projectConnectionId: project_connection_id,
            uploaderUserId: context.req.user_id,
            isFinalContract: false,
          });
        }

        return result.map((r) => {
          if (r.status === 'fulfilled') {
            return {
              success: true,
              data: {
                ...r.value,
                byte_size: Number(r.value.byte_size),
                document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[r.value.document_type],
              },
            };
          }

          return {
            success: false,
            error_message: r.reason.message,
          }
        });
      }

      return []
    },
    uploadContract: async (parent, args, context, info) => {
      const { file, project_connection_id } = args;

      if (!context.req.user_id) {
        throw new InternalError('Current user id not found');
      }

      const user = await context.prisma.user.findFirst({
        where: {
          id: context.req.user_id,
        },
        include: {
          customer: true,
        },
      });

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: project_connection_id,
        }
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

        const data = await file;
        const stream = data.createReadStream();

        // If biotech, check upload limit.
        if (user?.customer?.biotech_id) {
          const uploadLimitTracker = new UploadLimitTracker();
          await uploadLimitTracker.init(user.customer.biotech_id)
          uploadLimitTracker.deductUsed(byteToKB(existingContract?.byte_size || 0))

          const { byteSize } = await getBuffer(stream);

          const canUpload = uploadLimitTracker.validateFilesize(byteToKB(byteSize));

          if (!canUpload) {
            return {
              success: false,
              error_message: 'Not enough space',
            };
          }
        }

        const { filename, key, filesize, contextType } = await storeUpload(
          data,
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

          sendFileUploadNotificationQueue.add({
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

          sendFileUploadNotificationQueue.add({
            projectConnectionId: project_connection_id,
            uploaderUserId: context.req.user_id,
            isFinalContract: true,
            action: 'upload',
          });
        }

        return {
          success: true,
          data: {
            ...attachment,
            byte_size: Number(attachment.byte_size) / 1000,
            document_type: PROJECT_ATTACHMENT_DOCUMENT_TYPE[attachment.document_type],
          }
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
