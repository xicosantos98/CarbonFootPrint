var express = require("express");
var router = express.Router();

function verifyBody(body) {
  if (
    body.hasOwnProperty("description") &&
    body.hasOwnProperty("productQt") &&
    body.hasOwnProperty("month") &&
    body.hasOwnProperty("unit") &&
    body.hasOwnProperty("output_product") &&
    body.hasOwnProperty("organization") &&
    body.hasOwnProperty("year")
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
    var count = c_instance.mactivitiesCount().toNumber();
    var m_activities = [];

    for (var i = 1; i <= count; i++) {
      var activity = c_instance.mactivities(i);

      var co2eq = (activity[2] * Math.pow(10, -activity[4])).toFixed(
        activity[4]
      );

      var p_quantities = c_instance.getProdQuantities(activity[0].toNumber());

      m_activities.push({
        id: activity[0],
        description: activity[1],
        CO2eq: co2eq,
        product_qt: activity[3],
        month: activity[5],
        productQuantities: p_quantities,
        output: activity[6],
        id_organization: activity[7],
        id_unit: activity[8],
        id_year: activity[9],
        user: activity[10]
      });
    }

    if (m_activities.length == 0) {
      res.status(200).json({ warning: "0 monthly activities found" });
    } else {
      res.status(200).json(m_activities);
    }
  })

  .get("/:id", function(req, res) {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var activity = c_instance.mactivities(req.params.id);
      if (activity[0].toNumber() == 0) {
        res.status(200).json({ message: "Monthly activity not found" });
      } else {
        var co2eq = (activity[2] * Math.pow(10, -activity[4])).toFixed(
          activity[4]
        );

        var p_quantities = c_instance.getProdQuantities(activity[0].toNumber());

        m_activities.push({
          id: activity[0],
          description: activity[1],
          CO2eq: co2eq,
          product_qt: activity[3],
          month: activity[5],
          productQuantities: p_quantities,
          output: activity[6],
          id_organization: activity[7],
          id_unit: activity[8],
          id_year: activity[9],
          user: activity[10]
        });
      }
    }
  })

  .post("/", (req, res) => {
    if (!verifyBody(req.body)) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      try {
        c_instance.addMonthlyActivity(
          req.body.description,
          req.body.productQt,
          req.body.month,
          [],
          req.body.output_product,
          req.body.organization,
          req.body.unit,
          req.body.year,
          { from: req.headers.address, gas: 3000000 }
        );
        res.status(201).send({ message: "Monthly activity created" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
