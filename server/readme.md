 # OCR API with Express and MongoDB

This project provides a simple RESTful API for managing OCR (Optical Character Recognition) data using Express and MongoDB. It includes routes for creating, updating, retrieving, and deleting OCR records.

## Prerequisites

- Node.js and npm installed
- MongoDB installed and running

## Installation

Install the dependencies:

```
npm install
```

## Database Setup

1. Create a MongoDB database named `ocr-db`.
2. Create a collection named `ocr-records` in the `ocr-db` database.

## API Routes

The API provides the following routes:

- `/api/ocr`:
  - **POST**: Create a new OCR record.
  - **GET**: Retrieve all OCR records with optional filtering by name or identification number.
  - **PUT**: Update an existing OCR record.
  - **DELETE**: Delete an OCR record by ID.
- `/api/ocr/:id`:
  - **GET**: Retrieve a specific OCR record by ID.

## Usage

To use the API, you can send HTTP requests to the specified routes. For example, to create a new OCR record, you can send a POST request to `/api/ocr` with the following JSON payload:

```json
{
  "name": "John Doe",
  "Identification_Number": "123456789",
  "date_of_birth": "1990-01-01",
  "date_of_issue": "2023-01-01",
  "date_of_expiry": "2025-01-01"
}
```

The API will respond with a JSON object containing the result of the operation. In this case, it will return the newly created OCR record with an assigned ID.

##  The OcrRecordSchema

The `OcrRecordSchema` object defines the structure of the `OcrRecord` model. Each property in the schema represents a field in the MongoDB document.

```javascript
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

