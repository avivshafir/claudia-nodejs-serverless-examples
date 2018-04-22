const pizzas = require("./data/pizzas.json");

const botBuilder = require("claudia-bot-builder");

const pizzaDetails = require("./handlers/pizza-details");
const orderPizza = require("./handlers/order-pizza");
const pizzaMenu = require("./handlers/pizza-menu");

const fbTemplate = botBuilder.fbTemplate;

const api = botBuilder(
  message => {
    if (message.postback) {
      const [action, pizzaId] = message.text.split("|");
      if (action === "DETAILS") {
        return pizzaDetails(pizzaId);
      } else if (action === "ORDER") {
        return orderPizza(pizzaId, message.sender);
      }
    }
    if (
      message.originalRequest.message.attachments.length &&
      message.originalRequest.message.attachments[0].payload.coordinates &&
      message.originalRequest.message.attachments[0].payload.coordinates.lat &&
      message.originalRequest.message.attachments[0].payload.coordinates.long
    ) {
      return saveLocation();
    }
    return [`Hello, here's our pizza menu:`, pizzaMenu()];
  },
  {
    platforms: ["facebook"]
  }
);

module.exports = api;
