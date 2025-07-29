import React, {useState, useMemo, useCallback, useRef, useEffect} from 'react';
import styled from "styled-components";
import bg from './img/bg.png';
import {MainLayout} from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';

function App() {
  const [active, setActive] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [currentForm, setCurrentForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentField, setCurrentField] = useState(0);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const global = useGlobalContext();
  
  const formFields = {
    income: ['title', 'amount', 'category', 'description'],
    expense: ['title', 'amount', 'category', 'description']
  };

  // Speech synthesis setup
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speak('Sorry, I couldn\'t understand that. Please try again.');
      };
    }
  }, []);

  const speak = useCallback((text) => {
    if (!speechEnabled || !synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [speechEnabled]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
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

  const handleVoiceCommand = (command) => {
    console.log('Voice command received:', command);
    
    // Navigation commands
    if (command.includes('dashboard') || command.includes('home')) {
      setActive(1);
      speak('Navigating to Dashboard');
    } else if (command.includes('income') || command.includes('earnings')) {
      setActive(3);
      speak('Navigating to Income section');
    } else if (command.includes('expense') || command.includes('spending')) {
      setActive(4);
      speak('Navigating to Expenses section');
    } else if (command.includes('transactions')) {
      setActive(2);
      speak('Navigating to Transactions');
    } else if (command.includes('add income')) {
      setCurrentForm('income');
      setCurrentField(0);
      setFormData({});
      setActive(3);
      speak('Starting income entry. Please provide the title or name for this income.');
    } else if (command.includes('add expense')) {
      setCurrentForm('expense');
      setCurrentField(0);
      setFormData({});
      setActive(4);
      speak('Starting expense entry. Please provide the title or name for this expense.');
    } else if (command.includes('cancel') || command.includes('stop')) {
      setCurrentForm(null);
      setCurrentField(0);
      setFormData({});
      speak('Form cancelled');
    } else if (command.includes('read total') || command.includes('balance')) {
      const totalIncome = global.totalIncome();
      const totalExpenses = global.totalExpenses();
      const balance = global.totalBalance();
      speak(`Your total income is ${totalIncome} rupees. Total expenses are ${totalExpenses} rupees. Your current balance is ${balance} rupees.`);
    } else if (currentForm) {
      handleFormInput(command);
    } else {
      speak('Command not recognized. Say "dashboard" for home, "income" for income section, "expenses" for expenses, "add income" to add income, or "add expense" to add expense.');
    }
  };

  const handleFormInput = async (input) => {
    const fieldName = formFields[currentForm][currentField];
    
    if (fieldName === 'amount') {
      const amount = parseFloat(input.replace(/[^\d.]/g, ''));
      if (isNaN(amount)) {
        speak('Please provide a valid amount in numbers');
        return;
      }
      setFormData(prev => ({ ...prev, [fieldName]: amount }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: input }));
    }

    const nextField = currentField + 1;
    if (nextField < formFields[currentForm].length) {
      setCurrentField(nextField);
      const nextFieldName = formFields[currentForm][nextField];
      speak(`Got it. Now please provide the ${nextFieldName === 'amount' ? 'amount in rupees' : nextFieldName}.`);
    } else {
      // Form complete
      const newEntry = {
        ...formData,
        [fieldName]: fieldName === 'amount' ? parseFloat(input.replace(/[^\d.]/g, '')) : input,
        date: new Date(),
        category: formData.category || 'Other'
      };

      try {
        if (currentForm === 'income') {
          await global.addIncome(newEntry);
          speak(`Income entry added successfully. ${newEntry.title} for ${newEntry.amount} rupees has been recorded.`);
        } else {
          await global.addExpense(newEntry);
          speak(`Expense entry added successfully. ${newEntry.title} for ${newEntry.amount} rupees has been recorded.`);
        }
      } catch (error) {
        speak('There was an error saving your entry. Please try again.');
      }

      setCurrentForm(null);
      setCurrentField(0);
      setFormData({});
    }
  };

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard currentForm={currentForm} setCurrentForm={setCurrentForm} />;
      case 2:
        return <Dashboard currentForm={currentForm} setCurrentForm={setCurrentForm} />;
      case 3:
        return <Income currentForm={currentForm} setCurrentForm={setCurrentForm} />;
      case 4: 
        return <Expenses currentForm={currentForm} setCurrentForm={setCurrentForm} />;
      default: 
        return <Dashboard currentForm={currentForm} setCurrentForm={setCurrentForm} />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  },[]);

  // Initial welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Welcome to your accessible financial management app. You can navigate using voice commands. Say "dashboard" for overview, "income" for income management, or "expenses" for expense tracking.');
    }, 1000);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation 
          active={active} 
          setActive={setActive}
          isListening={isListening}
          startListening={startListening}
          stopListening={stopListening}
          speechEnabled={speechEnabled}
          setSpeechEnabled={setSpeechEnabled}
          speak={speak}
        />
        <main>
          {/* Voice Status Panel */}
          {currentForm && (
            <VoiceStatusPanel>
              <h3>Voice Input Mode</h3>
              <p>Adding {currentForm}. Currently inputting: {formFields[currentForm][currentField]}</p>
              <button
                onClick={() => {
                  setCurrentForm(null);
                  setCurrentField(0);
                  setFormData({});
                  speak('Form cancelled');
                }}
              >
                Cancel Voice Input
              </button>
            </VoiceStatusPanel>
          )}
          
          {displayData()}
        </main>
      </MainLayout>
      
      {/* Voice Instructions Panel */}
      <VoiceInstructions>
        <h4>Voice Commands</h4>
        <div>
          <p>• "Dashboard" - Go to overview</p>
          <p>• "Income" - Manage income</p>
          <p>• "Expenses" - Manage expenses</p>
          <p>• "Add income" - Start income entry</p>
          <p>• "Add expense" - Start expense entry</p>
          <p>• "Read total" - Hear balance summary</p>
          <p>• "Cancel" - Stop current action</p>
        </div>
      </VoiceInstructions>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

const VoiceStatusPanel = styled.div`
  background: #FFF3CD;
  border: 1px solid #FFEAA7;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  
  h3 {
    color: #856404;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #856404;
    margin-bottom: 0.5rem;
  }
  
  button {
    background: #856404;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #6c5228;
    }
  }
`;

const VoiceInstructions = styled.div`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  max-width: 300px;
  
  h4 {
    margin-bottom: 0.5rem;
    color: var(--primary-color);
  }
  
  div p {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0.25rem;
  }
`;

export default App;