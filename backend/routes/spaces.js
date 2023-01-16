const router = require('express').Router();
let time_series = require('../models/time_series.model');

router.route('/').get((req, res) => {
    time_series.distinct("space")
    .then(ts => res.json(ts))
    .catch(err => res.status(400).json('Error: ' + err));
     console.log("endpoint /time_series/space has been accessed")
});

module.exports = router;