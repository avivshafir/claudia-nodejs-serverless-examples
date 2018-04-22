"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

function saveLocation(userId, coordinates) {
  return docClient
    .scan({
      TableName: "pizza-orders",
      Limit: 1,
      FilterExpression: `user = :u, orderStatus: :s`,
      ExpressionAttributeNames: {
        ":u": { S: userId },
        ":s": { S: "in-progress" }
      }
    })
    .promise()
    .then(result => result.Items[0])
    .then(order => {
      return docClient
        .update({
          TableName: "pizza-orders",
          Key: {
            orderId: order.orderId
          },
          UpdateExpression: "set orderStatus = :s, coords=:c",
          ExpressionAttributeValues: {
            ":s": "pending",
            ":c": coordinates
          },
          ReturnValues: "ALL_NEW"
        })
        .promise();
    });
}

module.exports = saveLocation;
