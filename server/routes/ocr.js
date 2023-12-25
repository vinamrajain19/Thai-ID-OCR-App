// routes/ocr.js
const express = require('express');
const OcrRecord = require('../models/OcrRecord');

const router = express.Router();

// Create a new OCR record
router.post('/', async (req, res) => {
    const {
        Identification_Number,
        name,
        Last_name,
        date_of_birth,
        date_of_issue,
        date_of_expiry,
    } = req.body;

    try {
        const ocrRecord = new OcrRecord({
            name: name || undefined,
            Last_name: Last_name || undefined,
            Identification_Number: Identification_Number || undefined,
            date_of_issue: date_of_issue || undefined,
            date_of_expiry: date_of_expiry || undefined,
            date_of_birth: date_of_birth || undefined,
            status: 'success', // Provide a default status value
        });

        await ocrRecord.save();

        res.json({ result: 'OCR data saved successfully', id: String(ocrRecord._id) });
    } catch (error) {
        console.error(error);

        const ocrRecord = new OcrRecord({
            status: 'failure',
            error: error.message,
        });

        await ocrRecord.save();

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an existing OCR record
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {
        Identification_Number,
        name,
        Last_name,
        date_of_birth,
        date_of_issue,
        date_of_expiry,
        status,
    } = req.body;

    try {
        const ocrRecord = await OcrRecord.findById(id);


        if (!ocrRecord) {
            return res.status(404).json({ error: 'OCR record not found' });
        }

        // Update the record fields
        ocrRecord.name = name || ocrRecord.name;
        ocrRecord.Last_name = Last_name || ocrRecord.Last_name;
        ocrRecord.Identification_Number = Identification_Number || ocrRecord.Identification_Number;
        ocrRecord.date_of_issue = date_of_issue || ocrRecord.date_of_issue;
        ocrRecord.date_of_expiry = date_of_expiry || ocrRecord.date_of_expiry;
        ocrRecord.date_of_birth = date_of_birth || ocrRecord.date_of_birth;
        ocrRecord.status = status || ocrRecord.status;

        // Save the updated record
        await ocrRecord.save();

        res.json({ result: 'OCR data updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve and display OCR data with filtering options


router.get('/', async (req, res) => {
    const { name, identificationNo } = req.query;
    //console.log(name);

    // Create a filter object based on the provided parameters
    const filter = {};

    if (name) {
        filter.name = new RegExp(name, 'i'); // Case-insensitive regex match for name
    }

    if (identificationNo) {
        filter.Identification_Number = new RegExp(identificationNo, 'i'); // Case-insensitive regex match for identificationNo
    }



    try {
        const records = await OcrRecord.find(filter);
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete OCR records
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    //console.log(id);
    try {
        await OcrRecord.findByIdAndDelete(id);
        res.json({ result: 'OCR record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve a specific OCR record by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const ocrRecord = await OcrRecord.findById(id);

        if (!ocrRecord) {
            return res.status(404).json({ error: 'OCR record not found' });
        }

        res.json(ocrRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
