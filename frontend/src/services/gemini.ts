import { UserPersona } from '../types';

const BACKEND_URL = 'http://localhost:8081/api';

export const generateLessonPlan = async (persona: UserPersona, goals: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/lesson-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona, goals }),
    });
    const data = await response.json();
    return data.text || "{}";
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return "{}";
  }
};

export const chatWithTutor = async (
  message: string, 
  history: { role: 'user' | 'model', text: string }[], 
  persona: UserPersona,
  currentCode: string
): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message, 
        history, 
        persona, 
        currentCode 
      }),
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.text || "I'm having trouble connecting to the coding mainframe. Try again!";
  } catch (error) {
    console.error("Chat error:", error);
    return "I encountered a glitch in the matrix. Please try again.";
  }
};

export const simulateCodeExecution = async (code: string, language: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    const data = await response.json();
    return data.text || "";
  } catch (error) {
    return "Error: Execution failed.";
  }
};
