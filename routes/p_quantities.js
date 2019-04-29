var express = require("express");
var router = express.Router();

router

  .use(function timeLog(req, res, next) {
    //console.log('Time: ', Date.now())
    next();
  })

  .get("/:id", (req, res) => {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var p_quantity = c_instance.productsQuantities(req.params.id);
      if (p_quantity[0].toNumber() == 0) {
        res.status(200).json({ message: "Cost Type not found" });
      } else {
        res.status(200).json({
          id: p_quantity[0],
          quantity: p_quantity[1],
          id_FootPrint: p_quantity[2],
          id_MActivity: p_quantity[3]
        });
      }
    }
  })

  .post("/", (req, res) => {
    if (
      req.body.quantity == null ||
      req.body.p_footprint == null ||
      req.body.m_activity == null
    ) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var product = c_instance.productFootPrints(req.body.p_footprint);
      var co2product = (product[1] * Math.pow(10, -product[2])).toFixed(
        product[2]
      );
      var num = co2product * req.body.quantity;

      try {
        c_instance.addProdQuantity(
          req.body.quantity,
          req.body.p_footprint,
          req.body.m_activity,
          { from: req.headers.address, gas: 3000000 }
        );
        var m_activity = c_instance.mactivities(req.body.m_activity);
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
        );
        res.status(201).send({ message: "Product quantity created" });
      } catch (error) {}
    }
  });
