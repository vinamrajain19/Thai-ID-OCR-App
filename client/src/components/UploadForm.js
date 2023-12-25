// client/src/components/UploadForm.js
import React, { useState } from 'react';

const UploadForm = ({ onUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/ocr', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            onUpload(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Upload Thai ID Card Image</h2>
            <input type="file" onChange={handleFileChange} accept=".png, .jpg, .jpeg" />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadForm;
