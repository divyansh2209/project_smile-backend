const userController = require('express').Router();
const Result = require('../models/User')
const json2csv = require('json2csv').parse;
const { MongoClient } = require('mongodb');
const ExcelJS = require('exceljs');
const fs = require('fs');

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
    const { userId, partOneAns , resultThree, ResultTwo } = req.body;

    try {
        const result = new Result({
            userId,
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

// const exportUser = async (req, res) => {
//     const workbook = new ExcelJS.Workbook(); // Create a new workbook
//     const worksheet = workbook.addWorksheet("My Users"); // New Worksheet
//     const path = "./files"; // Path to download excel

//     // Column for data in excel. Key must match data key
//     worksheet.columns = [
//         { header: "S no.", key: "s_no", width: 10 },
//         { header: "Username", key: "userId", width: 10 },
//         { header: "Part_1-A", key: "partOneAns.A", width: 10 },
//         { header: "Part_1-B", key: "partOneAns.B", width: 10 },
//         { header: "Part_1-C", key: "partOneAns.C", width: 10 },
//         { header: "Part_2-Set1", key: "ResultTwo.set1", width: 10 },
//         { header: "Part_2-Set2", key: "ResultTwo.set2", width: 10 },
//         { header: "Part_2-Set3", key: "ResultTwo.set3", width: 10 },
//         { header: "Part_2-Set4", key: "ResultTwo.set4", width: 10 },
//         { header: "Part_3", key: "resultThree", width: 10 },
//     ];

//     try {
//         const results = await Result.find();

//         // Looping through User data
//         let counter = 1;
//         results.forEach((user) => {
//             const rowData = {
//                 s_no: counter,
//                 userId: user.userId,
//                 resultThree: user.resultThree,
//             };

//             worksheet.addRow(rowData); // Add data in worksheet
//             counter++;
//         });

//         // Making first line in excel bold
//         worksheet.getRow(1).eachCell((cell) => {
//             cell.font = { bold: true };
//         });

//         const buffer = await workbook.xlsx.writeBuffer();
//         res.set('Content-Disposition', 'attachment; filename="users.xlsx"');
//         res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//         res.send(buffer);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

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
