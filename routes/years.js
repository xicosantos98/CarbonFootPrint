var express = require("express");
var router = express.Router();

router

  .get("/", function(req, res) {
    var count = c_instance.yearliesCount().toNumber();
    var years = [];

    for (var i = 1; i <= count; i++) {
      var year = c_instance.yearly(i);

      years.push({ id: year[0], year: year[1] });
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
        c_instance.addYear(req.body.year, {
          from: req.headers.address,
          gas: 3000000
        });
        res.status(201).send({ message: "Year created" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
