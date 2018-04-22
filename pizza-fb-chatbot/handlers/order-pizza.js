"use strict";

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const pizzas = require("../data/pizzas.json");
const pizzaMenu = require("./pizza-menu");
const saveLocation = require("./handlers/save-location");
const uuid = require("uuid/v4");
const fbTemplate = require("claudia-bot-builder").fbTemplate;

function orderPizza(pizzaId, sender) {
  const pizza = pizzas.find(pizza => pizza.id == pizzaId);

  return docClient
    .put({
      TableName: "pizza-orders",
      Item: {
        orderId: uuid(),
        pizza: pizzaId,
        orderStatus: "in-progress",
        platform: "fb-messenger-chatbot",
        user: sender
      }
    })
    .promise()
    .then(res => {
      return new fbTemplate.Text(
        "Where do you want your pizza to be delivered?"
      )
        .addQuickReplyLocation()
        .get();
    })
    .catch(err => {
      console.log(err);

      return [
        "Oh! Something went wrong. Can you please try again?",
        pizzaMenu()
      ];
    });
}

module.exports = orderPizza;
