import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from '@aws-sdk/lib-storage'
import { randomUUID } from "crypto";
import { extname } from 'path';
import mime from 'mime-types';
import { s3Client } from "./awsS3";
import config from "../../src/config";

export default async function storeUpload(upload: any) {
  try {
    const { createReadStream, filename } = await upload.file;
    const mimeType = mime.lookup(filename);
    const contextType = typeof mimeType === 'string' ? mimeType : undefined;

    const key = `${process.env.NODE_ENV}/${randomUUID()}${extname(filename)}`;
    const s3Upload = new Upload({
      client: s3Client,
      params: {
        Body: createReadStream(),
        Bucket: config.s3.bucket,
        Key: key,
        ContentType: contextType,
      },
    });

    await s3Upload.done();

    const headObjectCommand = new HeadObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
    });
    const headObjectResp = await s3Client.send(headObjectCommand)

    return {
      key,
      filename,
      filesize: headObjectResp.ContentLength || 0,
      contextType,
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
