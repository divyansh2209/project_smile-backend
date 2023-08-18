const userController = require('express').Router();
const Result = require('../models/User')
const json2csv = require('json2csv').parse;

userController.get('/users', async (req, res) => {
    try {
        const results = await Result.find();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

userController.get('/api/users/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await Result.findOne({ username });
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Result not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

userController.post('/api/results', async (req, res) => {
    console.log(req.body);
    const { userId, email , partOne ,partOneAns , resultThree, ResultTwo } = req.body;
    try {
        const result = new Result({
            userId,
            email,
            partOne,
            partOneAns,
            resultThree,
            ResultTwo
        });

        await result.save();
        res.json(result);
    } catch (error) {
        res.status(500).json(error.message);
    }
});


const exportDataToCSV = async (req, res) => {
    try {
        const data = await Result.find({}).toArray();
        const csv = json2csv(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).send('Error exporting data');
    }
};

// Admin route
userController.get('/admin', exportDataToCSV);


// userController.post('/admin', exportUser);

module.exports = userController
