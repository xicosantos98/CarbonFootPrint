var express = require("express");
var router = express.Router();

router
  .get("/", function(req, res) {
    var count = c_instance.getYearsCount().toNumber();
    var years = [];

    for (var i = 0; i < count; i++) {
      var year = c_instance.arrayYears(i);

      years.push({ id: year });
    }

    if (years.length == 0) {
      res.status(200).json({ warning: "0 years found" });
    } else {
      res.status(200).json(years);
    }
  })

  .post("/", function(req, res) {
    if (!req.body.year) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      try {
        var year = parseInt(req.body.year);
        if (c_instance.existsYear(year)) {
          res.status(400).send({ message: "Error, invalid request" });
        } else {
          c_instance.addYear(year, {
            from: req.headers.address,
            gas: 3000000
          });
          res.status(201).send({ message: "Year created" });
        }
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
