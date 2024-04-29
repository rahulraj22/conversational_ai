import React, { useState } from 'react';

const SpeechToText = ({setQuestion}) => {
    // const [output, setOutput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognition = new window.webkitSpeechRecognition || window.SpeechRecognition();

    recognition.continuous = true; // Continuous speech recognition
    recognition.lang = 'en-US'; // Set language

    recognition.onstart = () => {
        setQuestion('Listening...');
        setIsListening(true);
    };

    recognition.onerror = event => {
        setQuestion('Error occurred in recognition: ' + event.error);
    };

    recognition.onresult = event => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setQuestion(transcript);
    };

    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
        }
    };

    return (
        <div>
            <button onClick={toggleListening} className="bg-red-300 rounded-3xl p-2 m-2 hover:bg-red-100">
                {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
        </div>
    );
};

export default SpeechToText;
