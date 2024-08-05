// src/components/Response.js
import React from "react";

const Response = ({ responses }) => {
    return (
      <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {responses.map((response, index) => (
          <div key={index} className={response.error ? "text-red-500" : "text-green-400"}>
            {response.error ? response.error : `File processed: ${response.new_name}`}
          </div>
        ))}
      </div>
    );
  };
  
export default Response;
