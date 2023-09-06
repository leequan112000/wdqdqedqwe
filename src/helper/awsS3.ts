import { GetObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../config";

export const s3Client = new S3Client({
  credentials: config.s3.credentials,
  region: config.s3.region,
});

export const getSignedUrl = async (key: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });

  const signedUrl = await s3GetSignedUrl(s3Client, getObjectCommand, { expiresIn: 60 * 60 })
  return signedUrl;
}

export const deleteObject = async (key: string, isPublic = false) => {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: isPublic ? config.s3.publicBucket : config.s3.bucket,
    Key: key,
  });
  return await s3Client.send(deleteObjectCommand);
}
