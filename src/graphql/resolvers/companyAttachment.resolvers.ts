import { Context } from '../../types/context';
import { Resolvers } from '../generated';
import storeUpload from '../../helper/storeUpload';
import { deleteObject, getSignedUrl } from '../../helper/awsS3';
import { Readable } from 'stream';
import { PublicError } from '../errors/PublicError';
import {
  CompanyAttachmentDocumentType,
  COMPANY_ATTACHMENT_DOCUMENT_TYPE,
} from '../../helper/constant';
import invariant from '../../helper/invariant';
import { formatBytes } from '../../helper/filesize';

const resolvers: Resolvers<Context> = {
  CompanyAttachment: {
    vendor_company: async (parent, _, context) => {
      invariant(parent.vendor_company_id, 'Vendor company id not found.');

      return await context.prisma.vendorCompany.findFirst({
        where: {
          id: parent.vendor_company_id,
        },
      });
    },
    signed_url: async (parent) => {
      invariant(parent.key, 'Company attachment key not found.');

      return await getSignedUrl(parent.key);
    },
    formatted_filesize: async (parent) => {
      if (parent.byte_size) {
        return formatBytes(parent.byte_size);
      }
      return null;
    },
  },
  Mutation: {
    uploadCompanyAttachment: async (parent, args, context) => {
      const { file, vendor_company_id } = args;
      const currectUserId = context.req.user_id;

      invariant(currectUserId, 'Current user id not found.');

      const vendorCompany = await context.prisma.vendorCompany.findFirst({
        where: {
          id: vendor_company_id,
        },
      });
      invariant(vendorCompany, 'Vendor company not found.');

      const data = await file;
      const { filename, key, filesize, contentType } = await storeUpload(
        data,
        COMPANY_ATTACHMENT_DOCUMENT_TYPE[
          CompanyAttachmentDocumentType.VENDOR_COMPANY_FILE
        ],
      );

      const existingAttachment =
        await context.prisma.companyAttachment.findFirst({
          where: {
            vendor_company_id: vendorCompany.id,
            document_type: CompanyAttachmentDocumentType.VENDOR_COMPANY_FILE,
          },
        });

      invariant(
        filesize <= 10000000,
        new PublicError('File size must be less than 10MB.'),
      );

      let attachment;
      if (existingAttachment) {
        attachment = await context.prisma.companyAttachment.update({
          data: {
            byte_size: filesize,
            filename,
            key,
            uploader_id: currectUserId,
            content_type: contentType,
          },
          where: {
            id: existingAttachment.id,
          },
        });

        await deleteObject(existingAttachment.key);
      } else {
        attachment = await context.prisma.companyAttachment.create({
          data: {
            byte_size: filesize,
            document_type: CompanyAttachmentDocumentType.VENDOR_COMPANY_FILE,
            filename,
            key,
            vendor_company_id,
            uploader_id: currectUserId,
            content_type: contentType,
          },
        });
      }

      return {
        success: true,
        data: {
          ...attachment,
          byte_size: Number(attachment.byte_size) / 1000,
          document_type:
            COMPANY_ATTACHMENT_DOCUMENT_TYPE[attachment.document_type],
          contentType,
        },
      };
    },
    removeCompanyAttachment: async (parent, args, context) => {
      const { id } = args;
      const deletedAttachment = await context.prisma.companyAttachment.delete({
        where: {
          id: id,
        },
      });
      invariant(deletedAttachment, 'Attachment not found.');

      await deleteObject(deletedAttachment.key);
      return {
        ...deletedAttachment,
        byte_size: Number(deletedAttachment.byte_size),
        document_type:
          COMPANY_ATTACHMENT_DOCUMENT_TYPE[deletedAttachment.document_type],
      };
    },
  },
};

export default resolvers;
