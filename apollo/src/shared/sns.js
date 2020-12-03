import AWS from 'aws-sdk';
import logger from './logger';

AWS.config.update({
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

const sns = new AWS.SNS();

const publish = async (topicName, message, filter = '') => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: topicName,
  };

  if (filter) params.MessageAttributes = filter;

  const result = await sns.publish(params).promise();
  logger.info(`Message ${params.Message} sent to topic ${params.TopicArn} with MessageID ${result.MessageId}`);
  return result;
};

export { publish as default };
