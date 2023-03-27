import { Request, Response } from 'express';
import { deleteObject } from '../../helper/awsS3';
import { ProjectAttachmentDocumentType } from '../../helper/constant';
import { PROJECT_ATTACHMENT_DOCUMENT_TYPE } from '../../helper/constant';
import storeUpload from '../../helper/storeUpload';
import { prisma } from '../../connectDB';
import { Readable } from 'stream';

interface MulterRequest extends Request {
  file?: any;
}

export const zohoWebhook = async (req: MulterRequest, res: Response): Promise<void> => {
  const { file_id } = req.body;
  const existingContract = await prisma.projectAttachment.findFirst({
    where: {
      id: file_id,
    },
  });

  try {
    const fileContent = {
      file: {
        ...req.file,
        filename: req.file.originalname,
        createReadStream: () => {
          return Readable.from(req.file.buffer);
        },
      }
    }

    const { filename, key, filesize } = await storeUpload(
      fileContent,
      PROJECT_ATTACHMENT_DOCUMENT_TYPE[ProjectAttachmentDocumentType.REDLINE_FILE],
    );

    let attachment;

    // If contract exist, replace with new version.
    if (existingContract) {
      attachment = await prisma.projectAttachment.update({
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
    }

    // TODO: Notify the vendor members when customers update the contract
    // TODO: Send notification email to vendor side members

    res.status(200).send("Saved!");
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: 400, message: `Webhook Error: ${error}` });
  }
};
