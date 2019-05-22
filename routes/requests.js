var express = require("express");
var router = express.Router();

function verifyBody(body) {
  if (
    body.hasOwnProperty("org_name") &&
    body.hasOwnProperty("org_desc") &&
    body.hasOwnProperty("org_barea") &&
    body.hasOwnProperty("org_email")
  ) {
    return true;
  } else {
    return false;
  }
}

router

  .get("/", function(req, res) {
    var count = c_instance.requestsCount().toNumber();
    var requests = [];

    for (var i = 1; i <= count; i++) {
      var request = c_instance.requests(i);

      requests.push({
        id: request[0],
        user: request[1],
        accepted: request[2],
        org_name: request[3],
        org_desc: request[4],
        org_barea: request[5],
        org_email: request[6]
      });
    }

    if (requests.length == 0) {
      res.status(200).json({ warning: "0 requests found" });
    } else {
      res.status(200).json(requests);
    }
  })

  .get("/pending", function(req, res) {
    console.log(req.originalUrl);
    var count = c_instance.requestsCount().toNumber();
    var requests = [];

    for (var i = 1; i <= count; i++) {
      var request = c_instance.requests(i);
      if (!request[2]) {
        requests.push({
          id: request[0],
          user: request[1],
          accepted: request[2],
          org_name: request[3],
          org_desc: request[4],
          org_barea: request[5],
          org_email: request[6]
        });
      }
    }

    if (requests.length == 0) {
      res.status(200).json({ warning: "0 pending requests found", length: 0 });
    } else {
      res.status(200).json(requests);
    }
  })

  .get("/b_areas", function(req, res) {
    var file = require("../business_areas.json");
    var json = [];

    for (var i = 0; i < file.length; i++) {
      if (file[i][0].design == "1") {
        json.push({ Cod: file[i][1].design, Descricao: file[i][2].design });
      } else {
        if (json[json.length - 1].sub_cat) {
          json[json.length - 1].sub_cat.push({ Descricao: file[i][2].design });
        } else {
          json[json.length - 1].sub_cat = [];
          json[json.length - 1].sub_cat.push({ Descricao: file[i][2].design });
        }
      }
    }

    res.send(json);
  })

  .post("/", function(req, res) {
    if (!verifyBody(req.body)) {
      res.status(400).send({ message: "Error, invalid request" });
    } else {
      try {
        c_instance.addRequest(
          req.headers.address,
          req.body.org_name,
          req.body.org_desc,
          req.body.org_barea,
          req.body.org_email,
          { from: req.headers.address, gas: 3000000 }
        );
        res.status(201).send({ message: "Request created" });
      } catch (error) {
        res.status(403).send({ message: error.message });
      }
    }
  });

module.exports = router;
