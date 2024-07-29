import React, { useState, useEffect } from 'react';

const AudioRecorder = ({ onAudioRecorded }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
      });
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);

      mediaRecorder.ondataavailable = (e) => {
        const audioBlob = new Blob([e.data], { type: 'audio/wav' });
        onAudioRecorded(audioBlob);
      };
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="audio-recorder">
      <button
        className="record-button"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
      >
        {isRecording ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            width="24"
            height="24"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="256"
                y1="501.49"
                x2="256"
                y2="11.49"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#aaaaa9" />
                <stop offset="1" stopColor="#dddfdd" />
              </linearGradient>
              <linearGradient
                id="linear-gradient-2"
                x1="256"
                y1="353.37"
                x2="256"
                y2="155.47"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#771314" />
                <stop offset="1" stopColor="#d82027" />
              </linearGradient>
            </defs>
            <path
              d="M255.85,501c135.09,0,245-110.21,245-245S390.94,11,255.85,11C121.06,11,11.15,121.21,11.15,256S121.06,501,255.85,501Z"
              fillRule="evenodd"
              fill="url(#linear-gradient)"
            />
            <path
              d="M255.85,26.11c123.54,0,224,100.13,224,223.67,0,2.07-.3,4.15-.3,6.22C476.26,135.43,377.32,38.55,255.85,38.55,134.68,38.55,35.74,135.43,32.48,256a43.62,43.62,0,0,1-.3-6.22C32.18,126.24,132.61,26.11,255.85,26.11Z"
              fill="#eff0ef"
              fillRule="evenodd"
            />
            <path
              d="M255.85,354.95c54.81,0,99.24-44.44,99.24-98.95s-44.44-98.95-99.24-98.95a98.95,98.95,0,0,0,0,197.89Z"
              fillRule="evenodd"
              fill="url(#linear-gradient-2)"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path
              className="cls-1"
              d="M256,396.8a128.14,128.14,0,0,1-128-128v-128a128,128,0,0,1,256,0v128A128.14,128.14,0,0,1,256,396.8Z"
              fill="#d9e4e8"
            />
            <g opacity="0.14">
              <path
                className="cls-3"
                d="M256,0a139.81,139.81,0,0,0-32,3.74C286.15,18.33,332.8,74.36,332.8,140.8v128c0,66.44-46.65,122.47-108.8,137.06a139.81,139.81,0,0,0,32,3.74c77.44,0,140.8-63.36,140.8-140.8v-128C396.8,63.36,333.44,0,256,0Z"
                fill="#17292d"
              />
            </g>
            <path
              className="cls-4"
              d="M448,262.4a12.8,12.8,0,0,0-25.6,0c0,87.45-67.8,159.36-153.6,165.91V409c71.5-6.52,128-67.08,128-140.21v-128C396.8,63.36,333.44,0,256,0S115.2,63.36,115.2,140.8v128c0,73.13,56.5,133.69,128,140.21v19.3C157.4,421.76,89.6,349.85,89.6,262.4a12.8,12.8,0,0,0-25.6,0C64,364,143.28,447.35,243.2,454V486.4H140.8a12.8,12.8,0,0,0,0,25.6H371.2a12.8,12.8,0,0,0,0-25.6H268.8V454C368.72,447.35,448,364,448,262.4Zm-307.2,6.4h38.4a12.8,12.8,0,0,0,0-25.6H140.8V217.6h38.4a12.8,12.8,0,1,0,0-25.6H140.8V166.4h38.4a12.8,12.8,0,1,0,0-25.6H140.8a115.2,115.2,0,1,1,230.4,0H332.8a12.8,12.8,0,1,0,0,25.6h38.4V192H332.8a12.8,12.8,0,1,0,0,25.6h38.4v25.6H332.8a12.8,12.8,0,0,0,0,25.6h38.4a115.2,115.2,0,0,1-230.4,0Z"
              fill="#141f38"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AudioRecorder;
