from flask import Flask, request, jsonify
import os
import base64
import pdf2image
import google.generativeai as genai
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure Google Gemini AI API Key
genai.configure(api_key="YOUR_GOOGLE_API_KEY")

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

# Function to validate file type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to extract first page of PDF as image (for Gemini API)
def convert_pdf_to_image(pdf_bytes):
    images = pdf2image.convert_from_bytes(pdf_bytes)
    first_page = images[0]

    # Convert to base64
    img_byte_arr = io.BytesIO()
    first_page.save(img_byte_arr, format='JPEG')
    return base64.b64encode(img_byte_arr.getvalue()).decode()

# Process uploaded resume and return ATS analysis
@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'file' not in request.files or 'job_description' not in request.form:
        return jsonify({"error": "Missing file or job description"}), 400
    
    file = request.files['file']
    job_description = request.form['job_description']

    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # Convert PDF to image if it's a PDF
    if file.filename.endswith('.pdf'):
        pdf_bytes = file.read()
        resume_content = convert_pdf_to_image(pdf_bytes)
    else:
        resume_content = file.read().decode('utf-8', errors='ignore')

    # Call Google Gemini API for ATS analysis
    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content([
        "You are an ATS Resume Checker. Evaluate this resume based on the provided job description. Provide a percentage match, missing keywords, and improvements.",
        resume_content,
        job_description
    ])

    return jsonify({"analysis": response.text})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
