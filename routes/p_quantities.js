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
        res
          .status(200)
          .json({
            id: p_quantity[0],
            quantity: p_quantity[1],
            id_FootPrint: p_quantity[2],
            id_MActivity: p_quantity[3]
          });
      }
    }
  });
