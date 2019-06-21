var express = require("express");
var router = express.Router();

function verifyBody(body) {
  if (
    body.hasOwnProperty("name") &&
    body.hasOwnProperty("desc") &&
    body.hasOwnProperty("barea") &&
    body.hasOwnProperty("email") &&
    body.hasOwnProperty("address")
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
    var count = c_instance.organizationsCount().toNumber();
    var organizations = [];

    for (var i = 1; i <= count; i++) {
      var org = c_instance.organizations(i);
      var name = org[3];

      if (
        req.query.name &&
        !name.toLowerCase().match(req.query.name.toLowerCase())
      ) {
        continue;
      } else {
        var co2eq = (org[1] * Math.pow(10, -org[2])).toFixed(org[2]);
        var prods = c_instance.getOrgProducts(org[0].toNumber());
        var m_activities = c_instance.getOrgMactivities(org[0].toNumber());
        var fix_costs = c_instance.getOrgFixCosts(org[0].toNumber());

        organizations.push({
          id: org[0].toNumber(),
          CO2eq: co2eq,
          name: org[3],
          description: org[4],
          business_area: org[5],
          email: org[6],
          mproducts: prods,
          monthly_activities: m_activities,
          monthly_fix_costs: fix_costs
        });
      }
    }

    if (organizations.length == 0) {
      res.status(200).json({ warning: "0 organizations found", length: 0 });
    } else {
      res.status(200).json(organizations);
    }
  })

  .get("/:id", function(req, res) {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var organization = c_instance.organizations(req.params.id);
      console.log(organization);
      if (organization[0].toNumber() == 0) {
        res.status(200).json({ message: "Organization not found" });
      } else {
        var co2eq = (organization[1] * Math.pow(10, -organization[2])).toFixed(
          organization[2]
        );
        var id_prods = c_instance.getOrgProducts(organization[0].toNumber());
        var prods = [];

        for (var i = 0; i < id_prods.length; i++) {
          var prod = c_instance.products(id_prods[i].toNumber());
          prods.push({ id: id_prods[i], name: prod[1], description: prod[2] });
        }

        var m_activities = c_instance.getOrgMactivities(
          organization[0].toNumber()
        );
        var fix_costs = c_instance.getOrgFixCosts(organization[0].toNumber());

        res.status(200).json({
          id: organization[0].toNumber(),
          CO2eq: co2eq,
          name: organization[3],
          description: organization[4],
          business_area: organization[5],
          email: organization[6],
          products: prods,
          monthly_activities: m_activities,
          monthly_fix_costs: fix_costs
        });
      }
    }
  })

  .post("/", function(req, res) {
    if (!verifyBody(req.body)) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      try {
        c_instance.addOrganization(
          req.body.name,
          req.body.desc,
          req.body.barea,
          req.body.email,
          req.body.address,
          [],
          [],
          [],
          { from: req.headers.address, gas: 3000000 }
        );
        res.status(201).send({ message: "Organization created" });
      } catch (error) {
        //var errorMessage = error.message.toString().substring('VM Exception while processing transaction: revert'.length + 1);
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
