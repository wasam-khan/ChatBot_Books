import React from 'react';
import './ResponseDisplay.css';
import { useState, useEffect } from 'react';
import svg from './speaker-sketch-loud-volume-interface-tool-svgrepo-com.svg';




function ResponseDisplay({ reference, response , book }) {
    const [displayedText, setDisplayedText] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

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

      const handleSpeak = () => {
        if ('speechSynthesis' in window) {
          if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
          } else {
            const utterance = new SpeechSynthesisUtterance(response);
            // utterance.lang = language;
            // console.log(utterance.lang);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
            
            // Reset the isSpeaking flag when the speech ends
            utterance.onend = () => {
              setIsSpeaking(false);
            };
          }
        } else {
          alert('Sorry, your browser does not support text to speech!');
        }
      }


    return (
        <div className="response-display">
        <h2>Response</h2>
        <p>{displayedText}</p>
        <button onClick={handleSpeak}>
          <img src={svg} alt="Speak" style={{ width: '18px', height: '18px' }} />
        </button>
        {index === response.length && reference && (
          <p className="reference-link">
            <a href={reference} target="_blank" rel="noopener noreferrer">
              <span className="reference-number">1 </span>
              
            </a>
            {book}
          </p>
        )}
        
      </div>
      );
    };

export default ResponseDisplay;
