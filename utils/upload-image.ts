import "server-only";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/utils/s3";

export const uploadImage = async (buffer: Buffer, key: string, type: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  } catch (e) {
    console.log(e);
  }

  return null;
};
