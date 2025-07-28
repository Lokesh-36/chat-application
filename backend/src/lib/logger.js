import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST before accessing any process.env

import winston from "winston";
import WinstonCloudWatch from "winston-cloudwatch"

const logger = winston.createLogger({
  transports: [
    new WinstonCloudWatch({
      logGroupName: process.env.CLOUDWATCH_GROUP_NAME,
      logStreamName: process.env.CLOUDWATCH_STREAM_NAME,
      awsRegion: process.env.AWS_REGION,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
      jsonMessage: true,
    }),
  ],
});

export default logger;
