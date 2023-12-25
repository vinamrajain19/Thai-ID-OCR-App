// client/src/components/OcrHistory.js
import React, { useState, useEffect } from 'react';

const OcrHistory = () => {
    const [ocrHistory, setOcrHistory] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'success', 'failure'

    useEffect(() => {
        const fetchOcrHistory = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/ocr?status=${filter}`);
                const data = await response.json();
                setOcrHistory(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOcrHistory();
    }, [filter]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    return (
        <div>
            <h2>OCR History</h2>
            <label>
                Filter:
                <select value={filter} onChange={handleFilterChange}>
                    <option value="all">All</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                </select>
            </label>

            <ul>
                {ocrHistory.map((record) => (
                    <li key={record._id}>
                        <strong>Status:</strong> {record.status}, <strong>Timestamp:</strong> {record.timestamp}
                        <br />
                        <pre>{JSON.stringify(record.result, null, 2)}</pre>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OcrHistory;
