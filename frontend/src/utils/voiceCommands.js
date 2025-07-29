// Voice command mappings and utilities

export const VOICE_COMMANDS = {
  NAVIGATION: {
    DASHBOARD: ['dashboard', 'home', 'main'],
    INCOME: ['income', 'earnings', 'revenue'],
    EXPENSES: ['expenses', 'spending', 'costs'],
    TRANSACTIONS: ['transactions', 'history']
  },
  ACTIONS: {
    ADD_INCOME: ['add income', 'new income', 'create income'],
    ADD_EXPENSE: ['add expense', 'new expense', 'create expense'],
    READ_TOTAL: ['read total', 'balance', 'summary', 'total'],
    CANCEL: ['cancel', 'stop', 'abort'],
    DELETE: ['delete', 'remove']
  },
  CATEGORIES: {
    INCOME: ['salary', 'freelancing', 'investments', 'stocks', 'bitcoin', 'bank', 'youtube', 'other'],
    EXPENSE: ['education', 'groceries', 'health', 'subscriptions', 'takeaways', 'clothing', 'travelling', 'other']
  }
};

export const VOICE_RESPONSES = {
  WELCOME: 'Welcome to your accessible financial management app. You can navigate using voice commands.',
  NAVIGATION: {
    DASHBOARD: 'Navigating to Dashboard',
    INCOME: 'Navigating to Income section',
    EXPENSES: 'Navigating to Expenses section',
    TRANSACTIONS: 'Navigating to Transactions'
  },
  FORM_START: {
    INCOME: 'Starting income entry. Please provide the title or name for this income.',
    EXPENSE: 'Starting expense entry. Please provide the title or name for this expense.'
  },
  FORM_FIELDS: {
    TITLE: 'Please provide the title or name',
    AMOUNT: 'Please provide the amount in rupees',
    CATEGORY: 'Please provide the category',
    DESCRIPTION: 'Please provide a description'
  },
  SUCCESS: {
    INCOME_ADDED: (title, amount) => `Income entry added successfully. ${title} for ${amount} rupees has been recorded.`,
    EXPENSE_ADDED: (title, amount) => `Expense entry added successfully. ${title} for ${amount} rupees has been recorded.`,
    DELETED: 'Entry deleted successfully'
  },
  ERRORS: {
    NOT_RECOGNIZED: 'Command not recognized. Please try again.',
    INVALID_AMOUNT: 'Please provide a valid amount in numbers',
    SAVE_ERROR: 'There was an error saving your entry. Please try again.',
    SPEECH_ERROR: 'Sorry, I couldn\'t understand that. Please try again.'
  }
};

export const matchVoiceCommand = (transcript, commandCategory) => {
  const normalizedTranscript = transcript.toLowerCase().trim();
  
  for (const [key, phrases] of Object.entries(commandCategory)) {
    if (phrases.some(phrase => normalizedTranscript.includes(phrase))) {
      return key;
    }
  }
  return null;
};

export const extractAmount = (transcript) => {
  // Extract numbers from speech (handles "one hundred", "50 rupees", etc.)
  const amount = parseFloat(transcript.replace(/[^\d.]/g, ''));
  return isNaN(amount) ? null : amount;
};

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getVoiceInstructions = () => {
  return [
    '• Say "Dashboard" to go to overview',
    '• Say "Income" to manage income',
    '• Say "Expenses" to manage expenses', 
    '• Say "Add income" to start income entry',
    '• Say "Add expense" to start expense entry',
    '• Say "Read total" to hear balance summary',
    '• Say "Cancel" to stop current action'
  ];
};

// Speech synthesis settings
export const SPEECH_CONFIG = {
  rate: 0.8,
  pitch: 1,
  volume: 1,
  lang: 'en-IN'
};

// Speech recognition settings
export const RECOGNITION_CONFIG = {
  continuous: false,
  interimResults: false,
  lang: 'en-IN',
  maxAlternatives: 1
};