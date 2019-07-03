var express = require("express");
var router = express.Router();

router

  .use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next();
  })

  .get("/", (req, res) => {
    var count = c_instance.productCostsCount().toNumber();
    var p_costs = [];

    for (var i = 1; i <= count; i++) {
      var p_cost = c_instance.productCosts(i);
      console.log(p_cost);
      var co2 = (p_cost[1] * Math.pow(10, -p_cost[2])).toFixed(p_cost[2]);

      p_costs.push({
        id: p_cost[0],
        CO2eq: co2,
        quantity: p_cost[3],
        id_cost_type: p_cost[4],
        m_activity: p_cost[5]
      });
    }

    if (p_costs.length == 0) {
      res.status(200).json({ warning: "0 production costs found" });
    } else {
      res.status(200).json(p_costs);
    }
  })

  .get("/:id", (req, res) => {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var p_cost = c_instance.productCosts(req.params.id);
      if (p_cost[0].toNumber() == 0) {
        res.status(200).json({ message: "Production Cost not found" });
      } else {
        var co2 = (p_cost[1] * Math.pow(10, -p_cost[2])).toFixed(p_cost[2]);
        res.status(200).json({
          id: p_cost[0],
          CO2eq: co2,
          quantity: p_cost[3],
          id_cost_type: p_cost[4],
          m_activity: p_cost[5]
        });
      }
    }
  })

  .post("/", (req, res) => {
    if (
      req.body.quantity == null ||
      req.body.cost_type == null ||
      req.body.m_activity == null
    ) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var cost = c_instance.costsTypes(req.body.cost_type);
      var co2perunit = (cost[1] * Math.pow(10, -cost[2])).toFixed(cost[2]);
      var num = co2perunit * req.body.quantity;
      num = num.toFixed(cost[2]);
      var exp = countDecimals(num);
      var co2eq = Math.round(num * Math.pow(10, exp));

      try {
        c_instance.addProductionCost(
          co2eq,
          exp,
          req.body.quantity,
          req.body.cost_type,
          req.body.m_activity
        );
        /*var m_activity = c_instance.mactivities(req.body.m_activity);
        var co2mactivity = m_activity[2] * Math.pow(10, -m_activity[4]) + num;
        var expMactivity = countDecimals(co2mactivity);
        var newCO2mactivity = Math.round(
          co2mactivity * Math.pow(10, expMactivity)
        );

        c_instance.updateCO2mactivity(
          m_activity[0].toNumber(),
          newCO2mactivity,
          expMactivity,
          { from: req.headers.address, gas: 3000000 }
        );*/
        res
          .status(201)
          .send({ message: "Production Cost added to monthly activity" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
