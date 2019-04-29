var express = require("express");
var router = express.Router();

function verifyBody(body) {
  if (
    body.hasOwnProperty("description") &&
    body.hasOwnProperty("co2") &&
    body.hasOwnProperty("unit")
  ) {
    return true;
  } else {
    return false;
  }
}

router

  .use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next();
  })

  .get("/", function(req, res) {
    console.log(req.headers);

    var count = c_instance.costsTypesCount().toNumber();
    var costs = [];

    for (var i = 1; i <= count; i++) {
      var cost = c_instance.costsTypes(i);
      var co2 = (cost[1] * Math.pow(10, -cost[2])).toFixed(cost[2]);

      costs.push({
        id: cost[0],
        CO2eq: co2,
        description: cost[3],
        unit: c_instance.units(cost[4].toNumber())[2]
      });
    }

    if (costs.length == 0) {
      res.status(200).json({ warning: "0 cost types found" });
    } else {
      res.status(200).json(costs);
    }
  })

  .get("/:id", function(req, res) {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var cost = c_instance.costsTypes(req.params.id);
      if (cost[0].toNumber() == 0) {
        res.status(200).json({ message: "Cost Type not found" });
      } else {
        var co2 = (cost[1] * Math.pow(10, -cost[2])).toFixed(cost[2]);
        res.status(200).json({
          id: cost[0],
          CO2eq: co2,
          description: cost[3],
          unit: c_instance.units(cost[4].toNumber())[2]
        });
      }
    }
  })

  .post("/", function(req, res) {
    if (!verifyBody(req.body)) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var num = req.body.co2;
      var exp = countDecimals(num) + 3;
      var co2eq = Math.round(num * Math.pow(10, exp));

      try {
        c_instance.addCostType(
          co2eq,
          exp,
          req.body.description,
          req.body.unit,
          [],
          [],
          { from: req.headers.address, gas: 3000000 }
        );
        res.status(201).send({ message: "Cost Type created" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
