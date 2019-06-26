var express = require("express");
var router = express.Router();

router
  .get("/", function(req, res) {
    var count = c_instance.unitsCount().toNumber();
    var units = [];

    for (var i = 1; i <= count; i++) {
      var unit = c_instance.units(i);
      units.push({
        id: unit[0],
        mesure: unit[1],
        initials: unit[2],
        base: unit[3],
        exp: unit[4],
        unit: unit[5],
        negative: unit[6]
      });
    }

    if (units.length == 0) {
      res.status(200).json({ warning: "0 units found" });
    } else {
      res.status(200).json(units);
    }
  })

  .get("/categories", (req, res) => {
    // Weight
    // Liquid volume
    // Length
    // Energy
    // Packaging

    var categories = [];
    categories.push({
      Type: "Weight",
      Units: [
        c_instance.units(1),
        c_instance.units(2),
        c_instance.units(3),
        c_instance.units(4)
      ]
    });
    categories.push({
      Type: "Volume",
      Units: [
        c_instance.units(5),
        c_instance.units(6),
        c_instance.units(7),
        c_instance.units(8),
        c_instance.units(9)
      ]
    });

    categories.push({
      Type: "Length",
      Units: [c_instance.units(10), c_instance.units(11), c_instance.units(12)]
    });

    categories.push({
      Type: "Energy",
      Units: [c_instance.units(13), c_instance.units(14)]
    });

    categories.push({
      Type: "Packaging",
      Units: [c_instance.units(15), c_instance.units(16)]
    });

    res.status(200).json(categories);
  })

  .post("/", function(req, res) {
    try {
      c_instance.addUnit(
        req.body.mesure,
        req.body.initials,
        req.body.base,
        req.body.exp,
        req.body.unit,
        req.body.negative,
        {
          from: req.headers.address,
          gas: 3000000
        }
      );
      res.status(201).send({ message: "Unit created" });
    } catch (error) {
      res.status(403).send({ message: error.message });
    }
  });

module.exports = router;
