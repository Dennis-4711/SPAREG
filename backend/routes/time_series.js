const router = require('express').Router();
let time_series = require('../models/time_series.model');

function getOrObject(objectName, valueArray)
{
    if (valueArray) {
        orArray = []
        for (let value of valueArray) {
            // check for basic injections
            if (!value.includes("$")) orArray.push({[objectName]: { $regex: value.toLowerCase(), $options: "i"} })
        }
        if (orArray.length > 0) {
            orObject = { $or: orArray}
            return orObject
        }
    }
    return null
}

router.route('/').get((req, res) => {
    // create or-combinations for different parameters
    athOrObject = getOrObject("athlete_id",req.query.athletes)
    discOrObject = getOrObject("discipline",req.query.disciplines)
    spaceOrObject = getOrObject("space",req.query.spaces)
    // combine creat and-combination of or-combinations
    andArray = []
    if (athOrObject) andArray.push(athOrObject)
    if (discOrObject) andArray.push(discOrObject)
    if (spaceOrObject) andArray.push(spaceOrObject)
    if (andArray.length>0) andObject = { $and: andArray }
    else andObject={}
    console.log(JSON.stringify(andObject))
    time_series.find(andObject,{vector:0})
        .then(ts => res.json(ts))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res) => {
    console.log(req.params.id)
    if (Number.isInteger(parseInt(req.params.id))) {
        time_series.find({series_id: req.params.id})
        .then(ts => res.json(ts))
        .catch(err => res.status(400).json('Error: ' + err));
    }
    else res.status(400).json('Error: id must be of type integer');
});

module.exports = router;