const AWSXray = require("aws-xray-sdk-core");
const AWS = AWSXray.captureAWS(require("aws-sdk"));
const uuid = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient();

function saveOrder(request) {
  console.log("Save an order", request.body);
  const userData = request.context.authorizer.claims;
  console.log("User data", userData);

  let userAddress = request.body && request.body.address;
  if (!userAddress) {
    userAddress = JSON.parse(userData.address).formatted;
  }

  if (!request.body || !request.body.pizza || !userAddress)
    throw new Error(
      "To order pizza please provide pizza type and address where pizza should be delivered"
    );

  return docClient
    .put({
      TableName: "pizza-orders",
      Item: {
        orderId: uuid(),
        cognitoUsername: userData["cognito:username"],
        pizza: request.body.pizza,
        address: userAddress,
        orderStatus: "pending"
      }
    })
    .promise()
    .then(res => {
      console.log("Order is saved!", res);
      return res;
    })
    .catch(saveError => {
      console.log(`Oops, order is not saved :(`, saveError);
      throw saveError;
    });
}

module.exports = saveOrder;
