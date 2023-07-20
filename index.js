const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();
const userController = require('./controllers/userController')
const PORT = process.env.PORT || 5000

const app = express();


mongoose.set('strictQuery', false);
async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the database");
        // Continue with your code here
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        // Handle the error appropriately
    }
}

connectToDatabase();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', userController);

// connect backend app
app.listen(PORT, () => console.log('Server is connected successfully'))