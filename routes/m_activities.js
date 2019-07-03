var express = require("express");
var router = express.Router();

function verifyBody(body) {
  if (
    body.hasOwnProperty("description") &&
    body.hasOwnProperty("productQt") &&
    body.hasOwnProperty("month") &&
    body.hasOwnProperty("unit") &&
    body.hasOwnProperty("product_id") &&
    body.hasOwnProperty("organization") &&
    body.hasOwnProperty("year") &&
    body.hasOwnProperty("co2OutProd")
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

  .get("/organization/:idOrganization", function(req, res) {
    var orgMactivities = [];

    if (req.params.idOrganization == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var m_activities = c_instance.getOrgMactivities(
        req.params.idOrganization
      );

      if (m_activities.length == 0) {
        res.status(200).json({ message: "0 monthly activities found" });
      } else {
        for (var i = 0; i < m_activities.length; i++) {
          var id = m_activities[i].toNumber();
          var activity = c_instance.mactivities(id);

          var co2eq = (activity[2] * Math.pow(10, -activity[4])).toFixed(
            activity[4]
          );

          var p_quantities = c_instance.getProdQuantities(
            activity[0].toNumber()
          );

          var product_fp = c_instance.productFootPrints(activity[6].toNumber());
          var product = c_instance.products(product_fp[3].toNumber());
          var final_product = { id: product[0].toNumber(), name: product[1] };

          orgMactivities.push({
            id: activity[0],
            description: activity[1],
            CO2eq: co2eq,
            product_qt: activity[3],
            month: activity[5],
            productQuantities: p_quantities,
            output: final_product,
            id_organization: activity[7],
            id_unit: activity[8],
            id_year: activity[9],
            user: activity[10]
          });
        }

        if (orgMactivities.length == 0) {
          res
            .status(200)
            .json({ warning: "0 monthly activities found", length: 0 });
        } else {
          res.status(200).json(orgMactivities);
        }
      }
    }
  })

  .get("/:id", function(req, res) {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var activity = c_instance.mactivities(req.params.id);
      console.log(activity);
      if (activity[0].toNumber() == 0) {
        res.status(200).json({ message: "Monthly activity not found" });
      } else {
        var co2eq = (activity[2] * Math.pow(10, -activity[4])).toFixed(
          activity[4]
        );

        var p_quantities = c_instance.getProdQuantities(activity[0].toNumber());

        res.status(200).json({
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
        var year = parseInt(req.body.year);
        createYear(year, req.headers.address);

        var numAct = Number(req.body.co2activity);
        var expAct = countDecimals(numAct);
        var co2eqAct = Math.round(numAct * Math.pow(10, expAct));

        var numProd = Number(req.body.co2OutProd);
        var expProd = countDecimals(numProd);
        var co2eqProd = Math.round(numProd * Math.pow(10, expProd));

        c_instance.addFootPrintProd(
          co2eqProd,
          expProd,
          req.body.product_id,
          year,
          req.body.month,
          c_instance.mactivitiesCount().toNumber() + 1,
          {
            from: req.headers.address,
            gas: 3000000
          }
        );

        c_instance.addMonthlyActivity(
          req.body.description,
          req.body.productQt,
          req.body.month,
          [],
          c_instance.pfootPrintCount().toNumber(),
          req.body.organization,
          req.body.unit,
          year,
          co2eqAct,
          expAct,
          { from: req.headers.address, gas: 3000000 }
        );

        var new_ma = c_instance.mactivitiesCount().toNumber();

        var org = c_instance.organizations(req.body.organization);
        //console.log(org);
        var co2org = (org[1] * Math.pow(10, -org[2]) + numAct).toFixed(3);
        var expOrg = countDecimals(co2org);
        var newco2eqOrg = Math.round(co2org * Math.pow(10, expOrg));

        c_instance.updateCO2org(org[0].toNumber(), newco2eqOrg, expOrg, {
          from: req.headers.address,
          gas: 3000000
        });

        res.status(201).send({
          message: "Monthly activity created",
          id: new_ma
        });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  })

  .put("/productFootPrint", (req, res) => {
    if (req.body.co2 == null || req.body.p_footprint == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var num = req.body.co2;
      var exp = countDecimals(num);
      var co2eq = Math.round(num * Math.pow(10, exp));

      try {
        c_instance.updateCO2pfootprint(req.body.p_footprint, co2eq, exp, {
          from: req.headers.address,
          gas: 3000000
        });
        console.log(c_instance.productFootPrints(req.body.p_footprint));
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
