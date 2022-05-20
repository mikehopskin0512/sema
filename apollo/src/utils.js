import AWS from 'aws-sdk';
import fs from 'fs';

const s3 = new AWS.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
});

export const uploadImage = async (file) => {
  const blob = fs.readFileSync(file.path);
  const uploadedImage = await s3.upload({
    Bucket: process.env.AMAZON_S3_BUCKET_NAME,
    Key: file.filename,
    Body: blob,
  }).promise();
  return uploadedImage;
}
