const mongoose = require('mongoose');

const OcrRecordSchema = new mongoose.Schema({
    name: String,
    Last_name: String,
    Identification_Number: String,
    date_of_issue: Date,
    date_of_expiry: Date,
    date_of_birth: Date,
    status: {
        type: String,
        enum: ['success', 'failure'],
        required: true,
    },
    error: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const OcrRecord = mongoose.model('OcrRecord', OcrRecordSchema);

module.exports = OcrRecord;
