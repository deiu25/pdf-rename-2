import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Response from "./components/Response";
import "./App.css";

const App = () => {
  const [responses, setResponses] = useState([]);
  const [allFilesReady, setAllFilesReady] = useState(false);

  const handleUploadComplete = (data) => {
    setResponses(data);
    checkFilesReady();
  };

  const checkFilesReady = () => {
    fetch("/files-ready")
      .then((response) => response.json())
      .then((data) => {
        setAllFilesReady(data.all_files_ready);
      })
      .catch((error) => console.error("Error:", error));
  };

  const downloadAll = () => {
    window.location.href = '/download-all';
    setTimeout(() => {
        fetch('/cleanup', {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => console.log(data.message))
            .catch(error => console.error('Error:', error));
    }, 30000);
};

  return (
    <div className="bg-gray-900 font-sans leading-normal tracking-normal container mx-auto mt-10">
      <div className="container flex justify-center mx-auto p-4">
        <div className="w-full max-w-xl">
          <FileUpload onUploadComplete={handleUploadComplete} />
          <div className="flex items-center justify-between mb-4">
            {allFilesReady && (
              <button
                className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={downloadAll}
              >
                Download All as ZIP
              </button>
            )}
          </div>
          <Response responses={responses} />
        </div>
      </div>
    </div>
  );
};

export default App;
