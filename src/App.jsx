import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { useSpeechSynthesis } from "react-speech-kit"

function App() {
  const { speak } = useSpeechSynthesis();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take upto 10 seconds");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCGAJjwK9sKCtTIuZSnOaiXHgf3oHxGvMc",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });
      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }
  let utterance;

  // Function to start speaking
  const startSpeaking = (text) => {
    text = text.replace(/\s*\*+\s*/g, '');
    // If speech synthesis is already speaking, stop it
    if (utterance && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // Create a new speech synthesis utterance
    utterance = new SpeechSynthesisUtterance(text);

    // Start speaking
    speechSynthesis.speak(utterance);
  };

  // Function to stop speaking
  const stopSpeaking = () => {
    // If speech synthesis is speaking, stop it
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  };

  const text_to_audio_hindi = (answer) => {
    axios
      .get(`http://api.voicerss.org/?key=cb5c186f2a2e4e19825aff1daa84b66e&hl=hi-in&src=${answer}`, {
        responseType: 'blob' // Set responseType to 'blob' to receive binary data
      })
      .then((response) => {
        // Create an audio element
        const audioElement = new Audio();
        
        // Create a URL for the blob response data
        const audioUrl = URL.createObjectURL(response.data);
        
        // Set the audio element's src to the blob URL
        audioElement.src = audioUrl;
        
        // Append the audio element to the document body or a specific container
        document.body.appendChild(audioElement);
        
        // Play the audio
        audioElement.play();
        
        // Clean up after audio finishes playing
        audioElement.addEventListener('ended', () => {
          document.body.removeChild(audioElement);
          URL.revokeObjectURL(audioUrl);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="bg-white h-screen p-3">
        <form
          onSubmit={generateAnswer}
          className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 py-2"
        >
          <a href="https://github.com/rahulraj22" target="_blank">
            <h1 className="text-3xl text-center">Conversational AI</h1>
            <p className="text-xs">Using Google Gemini API</p>
          </a>
          <textarea
            required
            className="border rounded w-11/12 my-2 min-h-fit p-3"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-300 p-3 rounded-md hover:bg-blue-400 transition-all duration-300"
            disabled={generatingAnswer}
          >
            Generate answer
          </button>
        </form>
        <div className="w-full md:w-2/3 m-auto text-center rounded bg-gray-50 my-1">
          {/* <ReactMarkdown className="p-3">{answer}</ReactMarkdown> */}
          <p>{answer}</p>
          <button className="bg-red-300 rounded-3xl p-2 m-2 hover:bg-red-100" onClick={() => text_to_audio_hindi(answer)}>Hindi Speaking</button>
          <button className="bg-amber-200 rounded-3xl p-2 m-2 hover:bg-amber-100" onClick={() => !isAudioOn && startSpeaking(answer)}>Start Speaking</button>
          <button className="bg-red-200 rounded-3xl p-2 hover:bg-red-100" onClick={() => isAudioOn && stopSpeaking()}>Stop Speaking</button>
        </div>
      </div>
    </>
  );
}

export default App;

// AIzaSyCGAJjwK9sKCtTIuZSnOaiXHgf3oHxGvMc