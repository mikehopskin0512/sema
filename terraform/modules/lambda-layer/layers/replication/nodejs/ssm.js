const aws = require('aws-sdk');

const ssm = new aws.SSM();

module.exports.getSecret = async (toDecrypt) => {
  const params = {
    Name: toDecrypt,
    WithDecryption: true,
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};
