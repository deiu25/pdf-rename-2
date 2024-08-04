// src/components/FileUpload.js
import React, { useState } from 'react';

const FileUpload = ({ onUploadComplete }) => {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const uploadFiles = () => {
        setLoading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i], files[i].name);
        }

        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                onUploadComplete(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    };

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">Upload a PDF file</h1>
            <div className="mb-4">
                <input type="file" accept=".pdf" multiple onChange={handleFileChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="flex items-center justify-between">
                <button onClick={uploadFiles} disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline relative">
                    Upload
                    {loading && (
                        <div className="absolute inset-0 flex justify-center items-center bg-blue-500 bg-opacity-75">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </div>
                    )}
                </button>
                <button id="downloadAllBtn" className="hidden bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Download All as ZIP
                </button>
            </div>
        </div>
    );
};

export default FileUpload;
