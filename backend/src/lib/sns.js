// src/lib/sns.js
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const sns = new AWS.SNS({
  region: process.env.AWS_REGION,
});

export const notifyAdminNewUser = async (fullName, email) => {
  const params = {
    Subject: "New User Signup Notification",
    Message: `A new user has signed up:\n\nName: ${fullName}\nEmail: ${email}`,
    TopicArn: process.env.SNS_TOPIC_ARN,
  };

  try {
    await sns.publish(params).promise();
    console.log("SNS notification sent to admin.");
  } catch (error) {
    console.error("Failed to send SNS notification:", error.message);
  }
};
