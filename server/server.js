// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const cors = require('cors');


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
const dbConfig = require('./config/dbConfig');

//app.use(express.json());

app.use(express.json({ limit: '10mb' }));

// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}


app.use(cors());


// Routes
app.use('/api/ocr', require('./routes/ocr'));

app.listen(port, () => console.log(`Server running on port ${port}`));
