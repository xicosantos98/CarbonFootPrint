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
      var prodsFootPrint = c_instance.getFootPrintsProd(i);

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

      products.push({
        id: prod[0],
        name: prod[1],
        description: prod[2],
        unit: prod[3],
        intermediate_product: prod[4],
        organization: prod[5],
        product_foot_prints: footprintarray
      });
    }

    if (products.length == 0) {
      res.status(200).json({ warning: "0 products found" });
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
      req.body.year == null
    ) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      var num = req.body.co2;
      var exp = countDecimals(num);
      var co2eq = Math.round(num * Math.pow(10, exp));

      try {
        var year = parseInt(req.body.year);
        createYear(year, req.headers.address);
        c_instance.addFootPrintProd(co2eq, exp, req.body.product, year, {
          from: req.headers.address,
          gas: 3000000
        });
        res.status(201).send({ message: "Product footprint created" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
