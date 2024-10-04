"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: process.env.AWS_REGION,
});

export async function getUploadS3PresignedUrl({
  bucketName,
  key,
}: {
  bucketName: string;
  key: string;
}) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn: 60 * 60 });
}
