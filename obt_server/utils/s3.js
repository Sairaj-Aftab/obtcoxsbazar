import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Helper function to delete an existing file
export const deleteExistingFile = async (fileKey) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileKey,
  };
  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

export async function uploadFile(files, fileNamesWithFolders, fileKeys = []) {
  if (!files || !fileNamesWithFolders) {
    throw new Error("No files provided for upload.");
  }

  // Normalize inputs to arrays
  const fileArray = Array.isArray(files) ? files : [files];
  const fileNameArray = Array.isArray(fileNamesWithFolders)
    ? fileNamesWithFolders
    : [fileNamesWithFolders];
  const fileKeyArray = Array.isArray(fileKeys) ? fileKeys : [fileKeys];

  if (fileArray.length !== fileNameArray.length) {
    throw new Error("Each file must have a corresponding filename.");
  }

  // Delete existing files if fileKeys are provided
  if (fileKeyArray.length > 0) {
    await Promise.all(fileKeyArray.map((key) => deleteExistingFile(key)));
  }

  // Upload each file
  const uploadPromises = fileArray.map(async (file, index) => {
    if (file.size > 300 * 1024) {
      throw new Error(`Max file size exceeded for ${file.originalname}`);
    }

    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: fileNameArray[index],
      ContentType: file.mimetype,
    };

    return s3Client.send(new PutObjectCommand(uploadParams));
  });

  const res = await Promise.all(uploadPromises);
  return res;
}

export async function getObjectSignedUrl(key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
  const command = new GetObjectCommand(params);
  const seconds = 18000;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });

  return url;
}
