export enum UserPersona {
  KID = 'KID',
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  DOCTOR_ENGINEER = 'DOCTOR_ENGINEER', // Domain experts wanting automation
}

export enum AppView {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string; // 'python' | 'javascript'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown supported
  initialCode: string;
}

export interface UserProfile {
  name: string;
  persona: UserPersona;
  goals: string;
  progress?: {
    completedLessons: string[];
    currentLessonId: string;
    xp: number;
  };
  currentCurriculum?: Course;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}