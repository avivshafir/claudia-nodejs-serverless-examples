const pizzas = require("./data/pizzas.json");

const botBuilder = require("claudia-bot-builder");
const fbTemplate = botBuilder.fbTemplate;

const api = botBuilder(
  message => {
    if (message.postback) {
      const [action, pizzaId] = message.text.split("|");
      if (action === "DETAILS") {
        const pizza = pizzas.find(pizza => pizza.id == pizzaId);
        return [
          `${pizza.name} has following ingredients: ` +
            pizza.ingredients.join(", "),
          new fbTemplate.Button("What else can I do for you?")
            .addButton("Order", `ORDER|${pizzaId}`)
            .addButton("Show all pizzas", "ALL_PIZZAS")
            .get()
        ];
      } else if (action === "ORDER") {
        const pizza = pizzas.find(pizza => pizza.id == pizzaId);
        return `Thanks for ordering ${
          pizza.name
        }! I will let you know as soon as your pizza is ready.`;
      }
    }

    const reply = new fbTemplate.Generic();

    pizzas.forEach(pizza => {
      reply
        .addBubble(pizza.name)
        .addImage(pizza.image)
        .addButton("Details", `DETAILS|${pizza.id}`)
        .addButton("Order", `ORDER|${pizza.id}`);
    });

    return [`Hello, here's our pizza menu:`, reply.get()];
  },
  {
    platforms: ["facebook"]
  }
);

module.exports = api;
