import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const VoiceControl = ({ onVoiceCommand, speechEnabled, setSpeechEnabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    if ('webkitSpeechRecognition' in window && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      // Initialize speech recognition
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        onVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak('Sorry, I couldn\'t understand that. Please try again.');
      };

      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis;
    }
  }, [onVoiceCommand]);

  const speak = useCallback((text) => {
    if (!speechEnabled || !synthRef.current || !isSupported) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [speechEnabled, isSupported]);

  const startListening = () => {
    if (recognitionRef.current && !isListening && isSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <UnsupportedMessage>
        <p>Voice control is not supported in this browser. Please use Chrome or Edge for voice features.</p>
      </UnsupportedMessage>
    );
  }

  return (
    <VoiceControlContainer>
      <VoiceButton
        onClick={isListening ? stopListening : startListening}
        $isActive={isListening}
        $type="microphone"
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? '🎙️' : '🎤'}
        <span>{isListening ? 'Stop' : 'Listen'}</span>
      </VoiceButton>

      <VoiceButton
        onClick={() => setSpeechEnabled(!speechEnabled)}
        $isActive={speechEnabled}
        $type="speaker"
        aria-label={speechEnabled ? 'Disable speech' : 'Enable speech'}
      >
        {speechEnabled ? '🔊' : '🔇'}
        <span>{speechEnabled ? 'On' : 'Off'}</span>
      </VoiceButton>

      <StatusIndicator>
        <StatusDot $isActive={isListening} $type="listening" />
        <span>{isListening ? 'Listening...' : 'Ready'}</span>
      </StatusIndicator>

      <StatusIndicator>
        <StatusDot $isActive={isSpeaking} $type="speaking" />
        <span>{isSpeaking ? 'Speaking...' : 'Silent'}</span>
      </StatusIndicator>
    </VoiceControlContainer>
  );
};

const VoiceControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #e0e0e0;
`;

const VoiceButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => 
    props.$type === 'microphone' 
      ? (props.$isActive ? '#f44336' : '#2196f3')
      : (props.$isActive ? '#4caf50' : '#757575')
  };
  background: ${props => 
    props.$type === 'microphone' 
      ? (props.$isActive ? '#f44336' : '#2196f3')
      : (props.$isActive ? '#4caf50' : '#757575')
  };
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  ${props => props.$isActive && props.$type === 'microphone' && `
    animation: pulse 1s infinite;
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  span {
    font-size: 0.85rem;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #666;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    if (props.$type === 'listening') {
      return props.$isActive ? '#4caf50' : '#ccc';
    }
    return props.$isActive ? '#ff9800' : '#ccc';
  }};
  transition: all 0.3s ease;
  
  ${props => props.$isActive && `
    animation: blink 1s infinite;
  `}
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
  }
`;

const UnsupportedMessage = styled.div`
  background: #fff3cd;
  border: 2px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  color: #856404;
  text-align: center;
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

export default VoiceControl;