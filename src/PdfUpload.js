import React, { useState } from 'react';
import axios from 'axios';

function PdfUpload() {
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setUploadStatus('No file selected');
      return;
    }

    setLoading(true);
    setUploadStatus('');

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const res = await axios.post('http://127.0.0.1:5000/upload_pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('PDF uploaded successfully!');
      console.log(res.data); // You might want to handle response data here
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setUploadStatus('Failed to upload PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload PDF'}
      </button>
      {uploadStatus && <div>{uploadStatus}</div>}
    </div>
  );
}

export default PdfUpload;
