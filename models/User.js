const mongoose = require('mongoose');
const { Schema } = mongoose;

const resultModel = new Schema({
    userId: String,
    email: String,
    partOne: String,
    partOneAns: {
        A: Number,
        B: Number,
        C: Number,
    },
    resultThree: String ,
    ResultTwo: {
        set1: Number,
        set2: Number,
        set3: Number,
        set4: Number
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Result', resultModel);