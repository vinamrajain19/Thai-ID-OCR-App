// src/App.js
import React, { useCallback, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import axios from 'axios';
import * as ImageJS from 'image-js';

import './App.css';



function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");
  const [error, setError] = useState(null);
  const [ocrHistory, setOcrHistory] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterIdentificationNo, setFilterIdentificationNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [extractedFields, setExtractedFields] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [filtersActive, setFiltersActive] = useState(false);



  // Not able to implement Pre processing part in a good manner

  const preprocessImage = (imageDataUrl) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Convert the image to ImageJS format
        const img = await ImageJS.Image.load(imageDataUrl);

        // Apply brightness and contrast adjustments
        const adjustedImg = img
          .brightness(0.2)
          .contrast(1.2);

        // Increase size
        const enlargedWidth = adjustedImg.width * 2;
        const enlargedHeight = adjustedImg.height * 2;
        adjustedImg.resize({ width: enlargedWidth, height: enlargedHeight });


        adjustedImg.filter({ blur: 2 }); // Adjust the blur value as needed

        // Fix DPI
        const dpi = 300;
        const scaleFactor = dpi / 96;
        adjustedImg.resize({ width: enlargedWidth * scaleFactor, height: enlargedHeight * scaleFactor });

        // Extract the processed image as a data URL
        const processedImageDataUrl = adjustedImg.toDataURL('image/png');
        resolve(processedImageDataUrl);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Not able to implement Pre processing part in a good manner

  const handleImageDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setError(null);

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB.');
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // Convert the image to ImageJS format
          const img = await ImageJS.Image.load(reader.result);


          const preprocessedImg = img
            .resize({ width: 800 }); // Adjust width as needed

          // Use the preprocessed image with Tesseract
          const { data: { text } } = await Tesseract.recognize(preprocessedImg.toDataURL(), 'eng');

          //console.log(text);
          const extractedData = parseOCRResults(text);
          setExtractedFields(extractedData);
          setTextResult(JSON.stringify(extractedData, null, 2));

          // Send data to the server and get the returned ID
          const response = await sendExtractedDataToServer(extractedData);

          localStorage.setItem('ocrRecordId', response.data.id);

          // Set the returned ID in the state
          setSelectedRecordId(response.data.id);
        } catch (error) {
          console.error('Error:', error);
          setError('Error processing image.');
        }
      };

      reader.readAsDataURL(file);
    }
  }, []);

  // Use useEffect to log the value of selectedRecordId after it's updated
  useEffect(() => {
    console.log(selectedRecordId);
  }, [selectedRecordId]);

  const sendExtractedDataToServer = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ocr', data);
      console.log('Server response:', response.data);
      return response;
    } catch (error) {
      console.error('Error sending data to the server:', error);
      return null;
    }
  };

  const parseOCRResults = (ocrText) => {
    const Identification_Number = ocrText.match(/(\d{1,2}\s?\d{4,5}\s?\d{5}\s?\d{2}\s?\d)/);
    const name = ocrText.match(/Miss\s(\w+)/);
    const Last_name = ocrText.match(/Last name\s(\w+)/);
    const date_of_birth = ocrText.match(/Date of Birth\s(\d{2}\s\w+\.\s\d{4})/);
    const date_of_issue = ocrText.match(/Date of Issue\s(\d{2}\/\d{2}\/\d{4})/);
    const date_of_expiry = ocrText.match(/Date of Expiry\s(\d{4}-\d{2}-\d{2})/);

    return {
      Identification_Number: Identification_Number ? Identification_Number[1] : "",
      Name: name ? name[1] : "",
      Last_name: Last_name ? Last_name[1] : "",
      Date_of_Birth: date_of_birth ? date_of_birth[1] : "",
      Date_of_Issue: date_of_issue ? date_of_issue[1] : "",
      Date_of_Expiry: date_of_expiry ? (date_of_expiry[1]) : "",
    };
  };

  const fetchOcrHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ocr', {
        params: { name: filterName, identificationNo: filterIdentificationNo },
      });
      setOcrHistory(response.data);
    } catch (error) {
      console.error('Error fetching OCR history:', error);
    }
  };

  const deleteOcrRecord = async () => {
    try {
      const id = localStorage.getItem('ocrRecordId');
      await axios.delete(`http://localhost:5000/api/ocr/${id}`);

      // Reset state values for the image and extracted text
      setSelectedImage(null);
      setTextResult("");
      setExtractedFields({});
      setSelectedRecordId(null);

      // Clear the local storage record ID
      localStorage.removeItem('ocrRecordId');
    } catch (error) {
      console.error('Error deleting OCR record:', error);
    }
  };


  const handleFilterChange = () => {
    fetchOcrHistory();
    setFiltersActive(true);

  };

  const handleEdit = (recordId) => {
    setSelectedRecordId(recordId);
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      // Check if selectedRecordId is not null before making the save request
      const id = localStorage.getItem('ocrRecordId');
      if (id !== null) {
        // Check if a similar record already exists in the backend
        const existingRecordResponse = await axios.get(`http://localhost:5000/api/ocr/${id}`);
        const existingRecord = existingRecordResponse.data;

        if (existingRecord) {
          // Update the existing record
          await axios.put(`http://localhost:5000/api/ocr/${id}`, {

            Identification_Number: extractedFields.Identification_Number,
            name: extractedFields.name,
            Last_name: extractedFields.Last_name,
            date_of_birth: extractedFields.date_of_birth,
            date_of_issue: extractedFields.date_of_issue,
            date_of_expiry: extractedFields.date_of_expiry,
          });
        } else {
          // Handle the case where the existing record is not found
          console.error('Existing record not found for editing');
        }

        // Refetch OCR history to update the frontend
        fetchOcrHistory();
        setEditMode(false);
        setSelectedRecordId(null); // Reset the selectedRecordId after saving
      } else {
        console.warn('selectedRecordId is null. Save request skipped.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  return (
    <div className="app-container">
      <h1>Thai ID OCR App</h1>


      <div className="content-container">
        <Dropzone onDrop={handleImageDrop} accept="image/*" maxFiles={1} maxSize={2 * 1024 * 1024}>
          {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
            >
              <input {...getInputProps()} />
              <p>Drag & drop an image here, or click to select one.</p>
              {isDragReject && <p className="error-text">File type not supported</p>}
              {error && <p className="error-text">{error}</p>}
            </div>
          )}
        </Dropzone>

        <div className="result-container">
          {selectedImage && (
            <div className="result-image">
              <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
            </div>
          )}
          {textResult && (
            <div className="result-text">
              <div>
                <h2>Extracted Fields</h2>
                <ul>
                  {Object.entries(extractedFields).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
              {editMode ? (
                <div>
                  {Object.entries(extractedFields).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setExtractedFields({ ...extractedFields, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                  <button onClick={handleSave}>Save</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => handleEdit(selectedRecordId)}>Edit</button>
                  <button onClick={() => deleteOcrRecord()}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Filter by Name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by Identification No."
          value={filterIdentificationNo}
          onChange={(e) => setFilterIdentificationNo(e.target.value)}
        />

        <button onClick={handleFilterChange}>Apply Filters</button>
      </div>

      {filtersActive && (
        <div className="ocr-history-container">
          <h2>OCR History</h2>
          <ul>
            {ocrHistory.map((item) => (
              <li key={item._id}>
                <span>Name: {item.name},</span>
                <span>Last Name: {item.Last_name},</span>
                <span>Identification Number: {item.Identification_Number}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;