const express = require("express");
const app = express();
const port = 3000;
const Web3 = require("web3");
var cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
var abijson,
  contractAddress = null;
var FootPrintInstance, contract;

var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

fs.readFile("./abi.json", handleFile);
function handleFile(err, data) {
  if (err) console.log(err);
  abijson = JSON.parse(data);
  contractAddress = "0x5a9b0098875e1ee6cb251b0308278f0721acbc74";

  console.log("Contract addres: " + contractAddress);
  initWeb3();
}

initWeb3 = function() {
  if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
  } else {
    // create an instance of web3 using the HTTP provider
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  web3.eth.defaultAccount = web3.eth.accounts[0];

  contract = web3.eth.contract(abijson);

  FootPrintInstance = contract.at("" + contractAddress);

  global.c_instance = FootPrintInstance;
  global.web3 = web3;

  web3.eth.getCoinbase(function(err, account) {
    if (err === null) {
      dAccount = account.toString();
    }
  });
};

countDecimals = function(value) {
  if (Math.floor(value) !== value)
    return value.toString().split(".")[1].length || 0;
  return 0;
};

createYear = function(year, address) {
  if (c_instance.existsYear(year)) {
    return;
  } else {
    c_instance.addYear(year, {
      from: address,
      gas: 3000000
    });
  }
};

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  if (req.method == "POST" || req.method == "PUT") {
    if (req.headers.address == null) {
      res.status(403).send({ message: "Address cannot be null" });
    } else {
      var response = c_instance.verifyUser(req.headers.address);

      switch (response) {
        case "not_registred":
          res
            .status(403)
            .send({ message: "Address not registred in the blockchain" });
          break;
        case "blocked":
          res.status(403).send({ message: "Address is blocked" });
          break;
        case "ok":
          next();
          break;
        default:
          res.status(403).send({ message: "error" });
          break;
      }
    }
  } else {
    next();
  }
});

var usersRoute = require("./routes/users");
var orgsRoute = require("./routes/organizations");
var prodsRoute = require("./routes/products");
var costTypeRoute = require("./routes/cost_type");
var mfixcostRoute = require("./routes/m_costs");
var yearsRoute = require("./routes/years");
var mactivitiesRoute = require("./routes/m_activities");
var pcostsRoute = require("./routes/p_costs");
var reqsRoute = require("./routes/requests");

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/organizations", orgsRoute);
app.use("/api/v1/products", prodsRoute);
app.use("/api/v1/cost_type", costTypeRoute);
app.use("/api/v1/m_costs", mfixcostRoute);
app.use("/api/v1/years", yearsRoute);
app.use("/api/v1/m_activities", mactivitiesRoute);
app.use("/api/v1/p_costs", pcostsRoute);
app.use("/api/v1/requests", reqsRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Listening on port ${port}!`));
