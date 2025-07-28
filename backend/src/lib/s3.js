import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadBase64ToS3 = async (base64Image) => {
  try {
    const buffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const contentType = base64Image.match(/data:(.*);base64/)?.[1] || "image/jpeg";

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `chat-images/${uuidv4()}.jpg`,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: contentType,
    };

    const { Location } = await s3.upload(params).promise();
    return Location; // public URL of uploaded image
  } catch (err) {
    console.error("S3 upload error:", err);
    throw new Error("Failed to upload image to S3");
  }
};
