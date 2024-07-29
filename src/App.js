import React, { useState } from 'react';
import QueryInput from './QueryInput';
import ResponseDisplay from './ResponseDisplay';
import AudioRecorder from './AudioRecorder'; // Import the AudioRecorder component
import QueryCard from './QueryCard'; // Adjust the path as needed

import axios from 'axios';
import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [query1, setquery] = useState('')
  const [reference, setReference] = useState(null);
  const [book,setBook] = useState(null)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state




  const handleCardClick = (query) => {
    setquery(query);
    handleQuerySubmit(query);
    
  };

  const handleInputChange = (e) => {
    setquery(e.target.value);
   
  };

const handleQuerySubmit = async (query) => {

  setLoading(true); // Start loading
  setquery(query)

  try {
    const res = await axios.post('http://127.0.0.1:5000/generate_response', { query });
      setResponse(res.data.response);
      setReference(res.data.reference);
      setBook(res.data.book);
      setError(null);

      if (res.status !== 200) {
        throw new Error('Network response was not ok');
      }

      
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching the response.');
      setResponse(null);
      setReference(null);
      setBook(null);
    }
    finally {
      setLoading(false); // End loading
    }
  };

  const handleAudioRecorded = async (audioBlob) => {
    setLoading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob,'audio.wav');
      const res = await axios.post('http://127.0.0.1:5000/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data.transcription)
      setquery(res.data.transcription);
      handleQuerySubmit(res.data.transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setError('An error occurred while transcribing the audio.');
      setResponse(null);
      setReference(null);
      setBook(null);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className='app'>
      <div className="cards-container">
        <QueryCard query="How to grow a fail business" onClick={handleCardClick} />
        <QueryCard query="Habits a successful person must have" onClick={handleCardClick} />
        <QueryCard query="Avoiding stress in life" onClick={handleCardClick} />
      </div>
      <div className="content">
        {query1 && <div className="displayQuery"><h2>User</h2> {query1}</div>}
        {loading && <div className="loader">Loading...</div>}
        {!loading && response && (
          <div className="displayResponse">
            <ResponseDisplay response={response} reference={reference} book={book} />
          </div>
        )}
      </div>
      <QueryInput onSubmit={handleQuerySubmit} onAudioRecorded={handleAudioRecorded} />
    </div>
  );
}

export default App;
