var express = require("express");
var router = express.Router();

function verifyBody(body) {
  if (
    body.hasOwnProperty("name") &&
    body.hasOwnProperty("description") &&
    body.hasOwnProperty("intermediate") &&
    body.hasOwnProperty("organization") &&
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
    var count = c_instance.productsCount().toNumber();
    var products = [];

    for (var i = 1; i <= count; i++) {
      var prod = c_instance.products(i);
      var name = prod[1];

      if (
        req.query.name &&
        !name.toLowerCase().match(req.query.name.toLowerCase())
      ) {
        continue;
      } else {
        var footprintarray = [];
        var prodsFootPrint = c_instance.getFootPrintsProd(i);
        for (var x = 0; x < prodsFootPrint.length; x++) {
          var footprint = c_instance.productFootPrints(
            prodsFootPrint[x].toNumber()
          );
          var num = (footprint[1] * Math.pow(10, -footprint[2])).toFixed(
            footprint[2]
          );

          footprintarray.push({
            id: prodsFootPrint[x].toNumber(),
            CO2eq: num,
            MonthlyActivity: footprint[6]
          });
        }

        var organization = c_instance.organizations(prod[5].toNumber());

        products.push({
          id: prod[0],
          name: prod[1],
          description: prod[2],
          unit: prod[3],
          intermediate_product: prod[4],
          organization: { id: organization[0], name: organization[3] },
          product_foot_prints: footprintarray
        });
      }
    }

    if (products.length == 0) {
      res.status(200).json({ warning: "0 products found", length: 0 });
    } else {
      res.status(200).json(products);
    }
  })

  .get("/:id", function(req, res) {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var prod = c_instance.products(req.params.id);
      if (prod[0].toNumber() == 0) {
        res.status(200).json({ message: "Product not found" });
      } else {
        var prodsFootPrint = c_instance.getFootPrintsProd(req.params.id);
        var footprintarray = [];

        for (var i = 0; i < prodsFootPrint.length; i++) {
          var footprint = c_instance.productFootPrints(
            prodsFootPrint[i].toNumber()
          );
          var num = (footprint[1] * Math.pow(10, -footprint[2])).toFixed(
            footprint[2]
          );

          footprintarray.push({ id: prodsFootPrint[i].toNumber(), CO2eq: num });
        }

        res.status(200).json({
          id: prod[0],
          name: prod[1],
          description: prod[2],
          unit: prod[3],
          intermediate_product: prod[4],
          organization: prod[5],
          product_foot_prints: footprintarray
        });
      }
    }
  })

  .get("/organization/:id", function(req, res) {
    if (req.params.id == null) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var org = c_instance.organizations(req.params.id);
      if (org[0].toNumber() == 0) {
        res.status(200).json({ message: "Organization not found" });
      } else {
        var productsOrg = c_instance.getOrgProducts(req.params.id);
        var org = c_instance.organizations(req.params.id);

        var footprintarray = [];
        for (var i = 0; i < productsOrg.length; i++) {
          var prod = c_instance.products(productsOrg[i].toNumber());

          if (
            req.query.search &&
            !prod[1].toLowerCase().match(req.query.search.toLowerCase())
          ) {
            continue;
          } else {
            var prodsFootPrint = c_instance.getFootPrintsProd(
              productsOrg[i].toNumber()
            );

            if (prodsFootPrint.length > 0) {
              for (var x = 0; x < prodsFootPrint.length; x++) {
                var footprint = c_instance.productFootPrints(
                  prodsFootPrint[x].toNumber()
                );

                var num = (footprint[1] * Math.pow(10, -footprint[2])).toFixed(
                  footprint[2]
                );

                footprintarray.push({
                  id: prodsFootPrint[x].toNumber(),
                  CO2eq: num,
                  month: footprint[5],
                  year: footprint[4],
                  organization: org[3],
                  product: prod[1]
                });
              }
            } else {
              continue;
            }
          }
        }
        if (footprintarray.length == 0) {
          res.status(200).json({
            warning: "Organization without product footprints",
            length: 0
          });
        } else {
          res.status(200).json(footprintarray);
        }
      }
    }
  })

  .get("/external/:id", function(req, res) {
    var count = c_instance.productsCount().toNumber();
    var products = [];

    for (var i = 1; i <= count; i++) {
      var prod = c_instance.products(i);
      var name = prod[1];
      var organization = c_instance.organizations(prod[5].toNumber());

      if (
        req.query.search &&
        !name.toLowerCase().match(req.query.search.toLowerCase())
      ) {
        continue;
      } else if (organization[0].toNumber() == req.params.id) {
        continue;
      } else {
        var prodsFootPrint = c_instance.getFootPrintsProd(i);
        for (var x = 0; x < prodsFootPrint.length; x++) {
          var footprint = c_instance.productFootPrints(
            prodsFootPrint[x].toNumber()
          );
          var num = (footprint[1] * Math.pow(10, -footprint[2])).toFixed(
            footprint[2]
          );

          products.push({
            id: prodsFootPrint[x].toNumber(),
            CO2eq: num,
            month: footprint[5],
            year: footprint[4],
            organization: organization[3],
            product: name
          });
        }
      }
    }

    if (products.length == 0) {
      res.status(200).json({ warning: "0 products found", length: 0 });
    } else {
      res.status(200).json(products);
    }
  })

  .get("/final/footprints", (req, res) => {
    var count = c_instance.productsCount().toNumber();
    var products = [];

    for (var i = 1; i <= count; i++) {
      var prod = c_instance.products(i);
      var name = prod[1];
      var organization = c_instance.organizations(prod[5].toNumber());

      if (
        req.query.search &&
        !name.toLowerCase().match(req.query.search.toLowerCase())
      ) {
        continue;
      } else if (Boolean(prod[4]) == true) {
        continue;
      } else {
        var prodsFootPrint = c_instance.getFootPrintsProd(i);
        for (var x = 0; x < prodsFootPrint.length; x++) {
          var footprint = c_instance.productFootPrints(
            prodsFootPrint[x].toNumber()
          );
          var num = (footprint[1] * Math.pow(10, -footprint[2])).toFixed(
            footprint[2]
          );

          products.push({
            id: prodsFootPrint[x].toNumber(),
            CO2eq: num,
            month: footprint[5],
            year: footprint[4],
            organization: organization[3],
            name: name
          });
        }
      }
    }

    if (products.length == 0) {
      res.status(200).json({ warning: "0 products found", length: 0 });
    } else {
      res.status(200).json(products);
    }
  })

  .get("/tree/:id", async (req, res) => {
    var result = await getTree(req.params.id);
    res.status(201).json(result);
  })

  .post("/", function(req, res) {
    if (!verifyBody(req.body)) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      try {
        c_instance.addProduct(
          req.body.name,
          req.body.description,
          req.body.intermediate == "true",
          req.body.organization,
          req.body.unit,
          [],
          { from: req.headers.address, gas: 3000000 }
        );

        var new_prod = c_instance.productsCount().toNumber();
        var co2eqProd = 0;
        var expProd = 0;

        if (Number(req.body.co2eqProd) > 0) {
          var numProd = Number(req.body.co2eqProd);
          expProd = countDecimals(numProd);
          co2eqProd = Math.round(numProd * Math.pow(10, expProd));

          c_instance.addFootPrintProd(
            co2eqProd,
            expProd,
            new_prod,
            req.body.year,
            req.body.month,
            0,
            {
              from: req.headers.address,
              gas: 3000000
            }
          );
        }

        res.status(201).send({ message: "Product created" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  })

  .post("/footprint", function(req, res) {
    if (
      req.body.co2 == null ||
      req.body.product == null ||
      req.body.year == null ||
      req.body.month == null
    ) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var num = req.body.co2;
      var exp = countDecimals(num);
      var co2eq = Math.round(num * Math.pow(10, exp));

      try {
        var year = parseInt(req.body.year);
        createYear(year, req.headers.address);
        c_instance.addFootPrintProd(
          co2eq,
          exp,
          req.body.product,
          year,
          req.body.month,
          0,
          {
            from: req.headers.address,
            gas: 3000000
          }
        );
        res.status(201).send({ message: "Product footprint created" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

async function getTree(id) {
  var footprint = c_instance.productFootPrints(id);
  var co2eq = (footprint[1] * Math.pow(10, -footprint[2])).toFixed(
    footprint[2]
  );
  var id = footprint[3].toNumber();
  var product = c_instance.products(id);
  var name_product = product[1];
  var idMA = footprint[6].toNumber();
  var p_quantities = c_instance.getProdQuantities(idMA);

  var obj_prod = {
    name: name_product,
    attributes: {
      //"Product CO2eq": co2eq,
      //"Monthly Activity CO2eq": co2eqMA,
      //Organization: org[3]
    },
    children: []
  };

  obj_prod.attributes["Product CO2eq"] = co2eq;

  if (Number(idMA) == 0) {
    obj_prod.attributes["Organization"] = "Matéria prima";
  } else {
    var m_activity = c_instance.mactivities(idMA);
    var co2eqMA = (m_activity[2] * Math.pow(10, -m_activity[4])).toFixed(
      m_activity[4]
    );
    var org = c_instance.organizations(m_activity[7].toNumber());
    obj_prod.attributes["Organization"] = org[3];
    obj_prod.attributes["Monthly Activity CO2eq"] = co2eqMA;
  }

  if (p_quantities.length > 0) {
    var p_inputs = [];

    for (const qtd of p_quantities) {
      var quantity = c_instance.productsQuantities(qtd.toNumber());
      p_inputs.push(quantity[2].toNumber());
    }

    for (let i = 0; i < p_inputs.length; i++) {
      var newObj = await getTree(p_inputs[i]);
      obj_prod.children.push(newObj);
    }
  }

  return obj_prod;
}

module.exports = router;
