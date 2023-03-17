import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetSignedUrl } from "@aws-sdk/s3-request-presigner";
import config from "../../src/config";

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
