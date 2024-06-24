import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';
import { fromBuffer } from 'detect-file-type';
import { extname } from 'path';
import mime from 'mime-types';
import { s3Client } from './awsS3';
import config from '../config';

type UploadParamType = {
  filename: string;
  createReadStream: () => any;
};

export default async function storeUpload(
  upload: UploadParamType,
  path: string = '',
  isPublic: boolean = false,
) {
  try {
    const { createReadStream, filename } = upload;
    const mimeType = mime.lookup(filename);
    const contentType = typeof mimeType === 'string' ? mimeType : undefined;

    const key = `${process.env.APP_ENV}/${path ? `${path}/` : ''}${randomUUID()}${extname(filename)}`;
    const s3Upload = new Upload({
      client: s3Client,
      params: {
        Body: createReadStream(),
        Bucket: isPublic ? config.s3.publicBucket : config.s3.bucket,
        Key: key,
        ContentType: contentType,
        ...(isPublic ? { ACL: 'public-read' } : {}),
      },
    });

    await s3Upload.done();

    const headObjectCommand = new HeadObjectCommand({
      Bucket: isPublic ? config.s3.publicBucket : config.s3.bucket,
      Key: key,
    });
    const headObjectResp = await s3Client.send(headObjectCommand);

    return {
      key,
      filename,
      bucket: isPublic ? config.s3.publicBucket : config.s3.bucket,
      filesize: headObjectResp.ContentLength || 0,
      contentType,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getFileExtFromBuffer = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    fromBuffer(buffer, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result.ext);
    });
  });
};
