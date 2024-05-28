import { Context } from "../../types/context";
import { Resolvers } from "../generated";
import mime from "mime-types";
import storeUpload from "../../helper/storeUpload";
import { ProjectAttachmentDocumentType, PROJECT_ATTACHMENT_DOCUMENT_TYPE } from "../../helper/constant";
import { deleteObject, getSignedUrl } from "../../helper/awsS3";
import { getZohoContractEditorUrl } from "../../helper/zoho";
import { Readable } from 'stream';
import UploadLimitTracker from '../../helper/uploadLimitTracker';
import { PublicError } from '../errors/PublicError';
import { byteToKB, formatBytes } from "../../helper/filesize";
import { toDollar } from "../../helper/money";
import { getFilenameWithVersion } from "../../helper/documentUpload";
import invariant from "../../helper/invariant";
import { bulkContractUpdateNoticeEmail, bulkContractUploadNoticeEmail, bulkDocumentUploadNoticeEmail } from "../../mailer";
import { getReceiversByProjectConnection } from "../../queues/utils";
import { app_env } from "../../environment";
import { createNotificationQueueJob } from "../../queues/notification.queues";
import createFinalContractUploadNotificationJob from "../../notification/finalContractUploadNotification";
import createFileUploadNotificationJob from "../../notification/fileUploadNotification";

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
      invariant(parent.project_connection_id, 'Project connection id not found.');
      return await context.prisma.projectConnection.findFirst({
        where: {
          id: parent.project_connection_id,
        },
      });
    },
    milestone: async (parent, _, context) => {
      invariant(parent.milestone_id, 'Milestone id not found.');
      const milestone = await context.prisma.milestone.findFirst({
        where: {
          id: parent.milestone_id,
        },
      });

      return milestone
        ? {
          ...milestone,
          amount: toDollar(milestone.amount.toNumber())
        }
        : null;
    },
    signed_url: async (parent) => {
      invariant(parent.key, 'Key not found.');
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
      const currectUserId = context.req.user_id;

      invariant(currectUserId, 'Current user id not found.');

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: project_connection_id,
        }
      });
      invariant(projectConnection, 'Project connection not found.');

      const user = await context.prisma.user.findFirst({
        where: {
          id: currectUserId,
        },
        include: {
          customer: true,
        },
      });

      invariant(user, 'Current user not found');

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
            invariant(canUpload, new PublicError(`Not enought space - ${uploadData.filename}`));
            uploadLimitTracker.addUsed(filesizeKB);
          }

          // Handle same name upload
          if (uploadData.filename) {
            const fullFilename: string = uploadData.filename;
            const projectAttachment = await context.prisma.projectAttachment.findFirst({
              where: {
                filename: fullFilename,
                project_connection_id: project_connection_id,
                document_type: ProjectAttachmentDocumentType.FILE,
              },
            });

            if (projectAttachment) {
              const versionedFilename = await getFilenameWithVersion(fullFilename, 1, project_connection_id);
              uploadData.filename = versionedFilename;
            }
          }

          const { filename, key, filesize, contentType } = await storeUpload(
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
              content_type: contentType,
              uploader_id: currectUserId,
            }
          });

          return attachment;
        }));

        if (result.filter((r) => r.status === 'fulfilled').length > 0) {
          const {
            receivers,
            projectConnection,
            senderCompanyName,
          } = await getReceiversByProjectConnection(project_connection_id, currectUserId);
          const emailData = receivers.map((r) => ({
            emailData: {
              login_url: `${app_env.APP_URL}/app/project-connection/${project_connection_id}`,
              receiver_full_name: `${r.first_name} ${r.last_name}`,
              project_title: projectConnection.project_request.title,
              company_name: senderCompanyName,
            },
            receiverEmail: r.email,
          }));
          const notificationData = receivers.map((r) => {
            return createFileUploadNotificationJob({
              sender_id: currectUserId,
              recipient_id: r.id,
              project_connection_id,
              project_title: projectConnection.project_request.title,
              sender_fullname: `${user.first_name} ${user.last_name}`
            })
          })
          bulkDocumentUploadNoticeEmail(emailData)
          createNotificationQueueJob({ data: notificationData })
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
      const currectUserId = context.req.user_id;

      invariant(currectUserId, 'Current user id not found.');

      const user = await context.prisma.user.findFirst({
        where: {
          id: currectUserId,
        },
        include: {
          customer: true,
        },
      });

      invariant(user, 'Current user not found.')

      const projectConnection = await context.prisma.projectConnection.findFirst({
        where: {
          id: project_connection_id,
        }
      });
      invariant(projectConnection, 'Project connection not found.');

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

        const { filename, key, filesize, contentType } = await storeUpload(
          data,
          PROJECT_ATTACHMENT_DOCUMENT_TYPE[ProjectAttachmentDocumentType.REDLINE_FILE],
        );

        const {
          receivers,
          projectConnection,
          senderCompanyName,
        } = await getReceiversByProjectConnection(project_connection_id, currectUserId);
        // Prepare email data
        const emailData = receivers.map((r) => ({
          emailData: {
            login_url: `${app_env.APP_URL}/app/project-connection/${project_connection_id}`,
            receiver_full_name: `${r.first_name} ${r.last_name}`,
            project_title: projectConnection.project_request.title,
            company_name: senderCompanyName,
          },
          receiverEmail: r.email,
        }));
        // Prepare notification data
        const notificationData = receivers.map((r) => {
          return createFinalContractUploadNotificationJob({
            sender_id: user.id,
            recipient_id: r.id,
            project_connection_id,
            project_title: projectConnection.project_request.title,
            sender_fullname: `${user.first_name} ${user.last_name}`
          })
        })

        let attachment;

        // If contract exist, replace with new version.
        if (existingContract) {
          attachment = await context.prisma.projectAttachment.update({
            data: {
              byte_size: filesize,
              filename,
              key,
              uploader_id: currectUserId,
            },
            where: {
              id: existingContract.id,
            },
          });
          // delete the old contract s3 object
          await deleteObject(existingContract.key);

          bulkContractUploadNoticeEmail(emailData)
        } else {
          // Else create a new one.
          attachment = await context.prisma.projectAttachment.create({
            data: {
              byte_size: filesize,
              document_type: ProjectAttachmentDocumentType.REDLINE_FILE,
              filename,
              key,
              project_connection_id,
              content_type: contentType,
              uploader_id: currectUserId,
            }
          });

          bulkContractUpdateNoticeEmail(emailData)
        }
        // Send notification
        createNotificationQueueJob({ data: notificationData })

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
