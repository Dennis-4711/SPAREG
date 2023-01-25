const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vectorSchema = new Schema({ 
    timestamp: { type: String, required: true },
    value: { type: Number , required: true }
})

const time_series_schema = new Schema({
    series_id: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    athlete_id: {
        type: Number,
        required: true,
        unique: false,
        trim: true
    },
    discipline: {
        type: String,
        required: true,
        trim: true
    },
    space: {
        type: String,
        required: true,
        trim: true
    },
    vector: {
        type: [vectorSchema],
        required: true
    },
    targetValue: {
        type: Number,
        required: true
    }       
});

const time_series = mongoose.model('time_series', time_series_schema);

module.exports = time_series;