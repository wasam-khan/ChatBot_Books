import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';

import './QueryInput.css';


function QueryInput({ onSubmit, onAudioRecorded}) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(query);
    setQuery('');
  };

  return (
    <form className="query-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Message..."
        />
                 
        <button type="submit" className="button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
          </svg>
        </button>
        <AudioRecorder onAudioRecorded={onAudioRecorded} />
        
      </div>
    </form>
  );
}

export default QueryInput;
