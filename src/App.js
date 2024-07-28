import React, { useState } from 'react';
import QueryInput from './QueryInput';
import ResponseDisplay from './ResponseDisplay';
import axios from 'axios';
import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [query1, setquery] = useState('')
  const [reference, setReference] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state


  

const handleQuerySubmit = async (query) => {

  setLoading(true); // Start loading
  setquery(query)
  try {
    const res = await axios.post('http://127.0.0.1:5000/generate_response', { query });
      setResponse(res.data.response);
      setReference(res.data.reference);
      setError(null);

      if (res.status !== 200) {
        throw new Error('Network response was not ok');
      }

      
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching the response.');
      setResponse(null);
      setReference(null);
    }
    finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="App">
      <h1>Query Input</h1>
      <QueryInput onSubmit={handleQuerySubmit} />
      {query1 && <div className='displayQuery'><h2>User</h2> {query1}</div>}
      {loading && <div className="loader">Loading...</div>}
      
      {!loading && response && (
        <div className='displayResponse'>
        <ResponseDisplay response={response} reference={reference} />
        </div>
      )}
      
    </div>
  );
}

export default App;
