import AWS from 'aws-sdk';
import fs from 'fs';

const s3 = new AWS.S3({
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
});

export const uploadImage = async (file, bucketName = 'avatars') => {
  try {
    const blob = fs.readFileSync(file.path);
    const bucket = bucketName === 'avatars' ?
      process.env.AMAZON_S3_AVATARS_BUCKET_NAME :
      process.env.AMAZON_S3_INFOGRAPHICS_BUCKET_NAME;
    const uploadedImage = await s3.upload({
      Bucket: bucket,
      Key: file.filename,
      Body: blob,
    }).promise();
    return uploadedImage;
  } catch (e) {
    console.log(e);
  }
}
