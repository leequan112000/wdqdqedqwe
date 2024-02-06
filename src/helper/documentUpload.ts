import { prisma } from '../prisma';
import { ProjectAttachmentDocumentType } from './constant';

export const getFilenameWithVersion = async (fullFilename: string, version: number, projectConnectionId: string): Promise<string> => {
  const [filenameWithoutExt, ext] = fullFilename.split('.');

  const newFullFilename = `${filenameWithoutExt} (${version}).${ext}`;

  const foundAttachment = await prisma.projectAttachment.findFirst({
    where: {
      filename: newFullFilename,
      project_connection_id: projectConnectionId,
      document_type: ProjectAttachmentDocumentType.FILE,
    },
  });

  if (!foundAttachment) {
    return newFullFilename;
  }

  return getFilenameWithVersion(fullFilename, version + 1, projectConnectionId);
}
