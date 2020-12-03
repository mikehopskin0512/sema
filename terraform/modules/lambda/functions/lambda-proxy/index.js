const AWS = require("aws-sdk");
const stepFunction = new AWS.StepFunctions({
  endpoint: process.env.ENDPOINT,
  region: process.env.REGION,
});

module.exports.handler = async (event) => {
  const stateMachineArn = process.env.STATEMACHINE_ARN;
  try {
    for (const item of event.Records) {
      const { Message: input } = JSON.parse(item.body);
      console.log("Received sFn input: ", JSON.stringify(input, null, 2));

      const result = await stepFunction
        .startExecution({
          stateMachineArn,
          input,
        })
        .promise();
      console.log(
        `State machine ${stateMachineArn} executed successfully`,
        result
      );
    }
  } catch (error) {
    console.log(`State machine ${stateMachineArn} execution failed`, error);
    throw error;
  }
};
