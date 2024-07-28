import React from 'react';
import './ResponseDisplay.css';

function ResponseDisplay({ reference, response }) {
    return (
        <div className="response-display">
          <h2>Response</h2>
          <p>
            {response}
            {reference && (
              <a href={reference} target="_blank" rel="noopener noreferrer" className="reference-link">
                <span className="reference-number">1</span>
              </a>
            )}
          </p>
        </div>
      );
    };

export default ResponseDisplay;
