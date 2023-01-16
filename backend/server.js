const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true});
const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const time_series_router = require('./routes/time_series');
const disciplines_router = require('./routes/disciplines');
const spaces_router = require('./routes/spaces');
const athletes_router = require('./routes/athletes');

app.use('/time_series', time_series_router);
app.use('/disciplines', disciplines_router);
app.use('/spaces', spaces_router);
app.use('/athletes', athletes_router);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});