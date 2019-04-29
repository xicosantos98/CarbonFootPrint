var express = require('express')
var router = express.Router()

function verifyBody(body) {
    if (body.hasOwnProperty('description') && body.hasOwnProperty('quantity') && body.hasOwnProperty('month') 
    && body.hasOwnProperty('cost_type') && body.hasOwnProperty('organization') && body.hasOwnProperty('year')) {
        return true;
    } else {
        return false;
    }
}

router

    .use(function timeLog(req, res, next) {
        //console.log('Time: ', Date.now())
        next()
    })

    .get('/', function (req, res) {

        var count = c_instance.mfixcostsCount().toNumber();
        var costs_array = [];

        for (var i = 1; i <= count; i++) {
            var m_cost = c_instance.mfixcosts(i);
            var co2 = (m_cost[1] * Math.pow(10, -(m_cost[2]))).toFixed(m_cost[2])

            costs_array.push({
                id: m_cost[0], CO2eq: co2, description: m_cost[3], quantity: m_cost[4], month: m_cost[5], cost_type: m_cost[6],
                organization: m_cost[7], year: m_cost[8]
            })
        }

        if (costs_array.length == 0) {
            res.status(200).json({ warning: '0 mothly fix costs found' })
        } else {
            res.status(200).json(costs_array);
        }
    })

    .get('/:id', function (req, res) {

        if (req.params.id == null) {
            res.status(400).send({ message: 'Error, invalid request' })
        } else {
            var m_cost = c_instance.mfixcosts(req.params.id);
            if (cost[0].toNumber() == 0) {
                res.status(200).json({ message: 'Cost Type not found' })
            } else {
                var co2 = (m_cost[1] * Math.pow(10, -(m_cost[2]))).toFixed(m_cost[2])

                res.status(200).json({
                    id: m_cost[0], CO2eq: co2, description: m_cost[3], quantity: m_cost[4], month: m_cost[5], cost_type: m_cost[6],
                    organization: m_cost[7], year: m_cost[8]
                })
            }
        }
    })

    .post('/', function (req, res) {

        if (!verifyBody(req.body)) {
            res.status(400).send({ message: 'Error, invalid request' })
        } else {
            var cost = c_instance.costsTypes(req.body.cost_type);
            var co2perunit = (cost[1] * Math.pow(10, -(cost[2])))
            var num = co2perunit * req.body.quantity
            var exp = countDecimals(num);
            var co2eq = Math.round(num * Math.pow(10, exp));

            try {
                c_instance.addMonthlyFixCost(co2eq, exp, req.body.description, req.body.quantity,
                    req.body.month, req.body.cost_type, req.body.organization, req.body.year, { from: req.headers.address, gas: 3000000 })
                
                var org = c_instance.organizations(req.body.organization);
                var co2org = (org[1] * Math.pow(10, -(org[2]))) + num;
                var expOrg = countDecimals(co2org);
                var newco2eqOrg = Math.round(co2org * Math.pow(10, expOrg));
                
                c_instance.updateCO2org(org[0].toNumber(), newco2eqOrg, expOrg, { from: req.headers.address, gas: 3000000 });
                res.status(201).send({ message: 'Monthly Fix Cost created' });
            } catch (error) {
                res.status(403).send({ message: error.message });
            }

        }

    })

module.exports = router
