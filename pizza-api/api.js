"use strict";

var Api = require("claudia-api-builder");
const getPizzas = require("./handlers/get-pizzas");
const createOrder = require("./handlers/create-order");
const updateOrder = require("./handlers/update-order");
const deleteOrder = require("./handlers/delete-order");
const updateDeliveryStatus = require("./handlers/update-delivery-status");
const getSignedUrl = require("./handlers/generate-presigned-url");

var api = new Api();

api.registerAuthorizer("userAuthentication", {
  providerARNs: [process.env.userPoolArn]
});

api.get("/", () => "Welcome to Pizza API");

api.get("/pizzas", () => {
  return getPizzas();
});

api.get(
  "/pizzas/{id}",
  request => {
    return getPizzas(request.pathParams.id);
  },
  {
    error: 404
  }
);

api.post(
  "/orders",
  request => {
    return createOrder(request.body);
  },
  {
    error: 400,
    success: 201,
    cognitoAuthorizer: "userAuthentication"
  }
);

api.delete(
  "/orders/{id}",
  request => {
    return deleteOrder(request.pathParams.id);
  },
  {
    error: 400,
    cognitoAuthorizer: "userAuthentication"
  }
);

api.put(
  "/orders/{id}",
  request => {
    return updateOrder(request.pathParams.id, request.body);
  },
  {
    error: 400,
    cognitoAuthorizer: "userAuthentication"
  }
);

api.post("/delivery", request => updateDeliveryStatus(request.body), {
  success: 200,
  error: 400,
  cognitoAuthorizer: "userAuthentication"
});

api.get(
  "upload-url",
  request => {
    return getSignedUrl();
  },
  {
    error: 400
  }
);

module.exports = api;
