import React from 'react';
import './ResponseDisplay.css';
import { useState, useEffect } from 'react';

function ResponseDisplay({ reference, response }) {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < response.length) {
          const timeoutId = setTimeout(() => {
            setDisplayedText((prev) => prev + response[index]);
            setIndex((prev) => prev + 1);
          }, 30); // Adjust the delay for faster or slower typing
          return () => clearTimeout(timeoutId);
        }
      }, [index, response]);


    return (
        <div className="response-display">
        <h2>Response</h2>
        <p>{displayedText}</p>
        {index === response.length && reference && (
          <p className="reference-link">
            <a href={reference} target="_blank" rel="noopener noreferrer">
              <span className="reference-number">1</span>
            </a>
          </p>
        )}
      </div>
      );
    };

export default ResponseDisplay;
