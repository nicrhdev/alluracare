// src/types/quiz.ts

export interface QuizOption {
  id: string;
  labelEn: string;
  labelFa: string;
  value: string;
  nextQuestionId?: string | null;
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multi' | 'image';
  questionEn: string;
  questionFa: string;
  descriptionEn?: string;
  descriptionFa?: string;
  options: QuizOption[];
  image?: string;
  isFirst: boolean;
  isLast: boolean;
}

export interface QuizResult {
  id: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  recommendations: string[];
  image?: string;
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
  email?: string;
  name?: string;
}