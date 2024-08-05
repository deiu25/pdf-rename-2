from flask import Flask, request, jsonify, send_from_directory, send_file, after_this_request
import pdfplumber
import re
import os
import zipfile
from flask_cors import CORS

app = Flask(__name__, static_folder='build', static_url_path='/')
CORS(app)

UPLOAD_FOLDER = 'uploaded_files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
all_files_ready = False

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def extract_series_number(content):
    match = re.search(r'Fattura fiscale:\s*(\S+)', content)
    if match:
        return match.group(1)
    return None

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    global all_files_ready
    all_files_ready = False 
    uploaded_files = request.files.getlist('files[]')
    responses = []
    for file in uploaded_files:
        if file and file.filename.endswith('.pdf'):
            new_filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(new_filename)  
            try:
                with pdfplumber.open(new_filename) as pdf:
                    content = pdf.pages[0].extract_text()
                series_number = extract_series_number(content)
                if series_number:
                    final_filename = f"{series_number}.pdf"
                    final_path = os.path.join(app.config['UPLOAD_FOLDER'], final_filename)
                    if os.path.exists(final_path): 
                        responses.append({'error': f'File {final_filename} already exists.'})
                        os.remove(new_filename)  
                    else:
                        os.rename(new_filename, final_path)
                        responses.append({'new_name': final_filename, 'download_url': f'/download/{final_filename}'})
                else:
                    responses.append({'error': 'Series number not found'})
                    os.remove(new_filename) 
            except Exception as e:
                responses.append({'error': str(e)})
                if os.path.exists(new_filename):
                    os.remove(new_filename)
        else:
            responses.append({'error': 'Invalid file format'})
    all_files_ready = True  
    return jsonify(responses)


@app.route('/download-all', methods=['GET'])
def download_all_files():
    zip_filename = 'All_PDFs.zip'
    zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)

    with zipfile.ZipFile(zip_path, 'w') as zf:
        for root, dirs, files in os.walk(app.config['UPLOAD_FOLDER']):
            for file in files:
                if file.endswith('.pdf'):
                    zf.write(os.path.join(root, file), file)

    return send_file(zip_path, as_attachment=True)

@app.route('/cleanup', methods=['POST'])
def cleanup_files():
    try:
        zip_filename = 'All_PDFs.zip'
        zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)
        if os.path.exists(zip_path):
            os.remove(zip_path)
        for root, dirs, files in os.walk(app.config['UPLOAD_FOLDER']):
            for file in files:
                file_path = os.path.join(root, file)
                if file.endswith('.pdf'):
                    os.remove(file_path)
        return jsonify({'status': 'success', 'message': 'Files cleaned up successfully.'}), 200
    except Exception as e:
        app.logger.error('Eroare la ștergerea fișierelor: %s', str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/files-ready', methods=['GET'])
def check_files_ready():
    global all_files_ready
    return jsonify({'all_files_ready': all_files_ready})

@app.route('/<path:path>', methods=['GET'])
def serve_file(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)