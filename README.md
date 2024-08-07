PDF Renamer is a web application designed to automate the task of renaming PDF files based on a specific field within each document. Developed using Flask for the backend and React for the frontend, this tool simplifies what was previously a day-long manual process into a matter of minutes.

Features
File Upload: Users can easily upload files through the web interface.
File Saving: Uploaded files are saved in a dynamically created folder if it doesn't already exist.
Serial Number Identification: The application processes each PDF, extracting text from the first page to identify the document's serial number.
File Renaming: Each file is renamed using the identified serial number, enhancing organization and accessibility.
Error Handling: Robust error handling ensures any issues (e.g., invalid format, file existence conflicts, processing errors) are captured and reported.
JSON Response: After processing, the application outputs a JSON response detailing the results of the renaming operation.
ZIP File Creation: A ZIP file containing all processed PDFs is automatically generated.
ZIP File Download: Users can download the ZIP file directly from the application.
File Deletion: To optimize storage, the ZIP file and all processed PDFs are deleted post-download.

The motivation behind PDF Renamer was to drastically reduce the time spent on manual data management tasks. Leveraging the power of Python and modern web technologies, this application turns a cumbersome full-day task into a swift, automated process.

Run the command to install the dependencies:
pip install -r requirements.txt

Run the application:
python app.py
