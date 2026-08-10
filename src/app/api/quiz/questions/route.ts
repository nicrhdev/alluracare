// src/app/api/quiz/questions/route.ts

import { NextResponse } from 'next/server';
import type { QuizQuestion } from '@/types/quiz';

// Sample quiz questions - replace with database queries later
const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'single',
    questionEn: "What's your skin type?",
    questionFa: 'نوع پوست شما چیست؟',
    descriptionEn: 'This helps us recommend the right products for you',
    descriptionFa: 'این به ما کمک می‌کند محصولات مناسب را به شما پیشنهاد دهیم',
    isFirst: true,
    isLast: false,
    options: [
      {
        id: 'q1_o1',
        labelEn: 'Dry',
        labelFa: 'خشک',
        value: 'dry',
        nextQuestionId: 'q2',
      },
      {
        id: 'q1_o2',
        labelEn: 'Oily',
        labelFa: 'چرب',
        value: 'oily',
        nextQuestionId: 'q2',
      },
      {
        id: 'q1_o3',
        labelEn: 'Combination',
        labelFa: 'مختلط',
        value: 'combination',
        nextQuestionId: 'q2',
      },
      {
        id: 'q1_o4',
        labelEn: 'Sensitive',
        labelFa: 'حساس',
        value: 'sensitive',
        nextQuestionId: 'q2',
      },
      {
        id: 'q1_o5',
        labelEn: 'Normal',
        labelFa: 'معمولی',
        value: 'normal',
        nextQuestionId: 'q2',
      },
    ],
  },
  {
    id: 'q2',
    type: 'multi',
    questionEn: 'What skin concerns do you have?',
    questionFa: 'چه مشکلات پوستی دارید؟',
    descriptionEn: 'Select all that apply',
    descriptionFa: 'تمام موارد مربوطه را انتخاب کنید',
    isFirst: false,
    isLast: false,
    options: [
      {
        id: 'q2_o1',
        labelEn: 'Acne & Breakouts',
        labelFa: 'آکنه و جوش',
        value: 'acne',
        nextQuestionId: 'q3',
      },
      {
        id: 'q2_o2',
        labelEn: 'Dark Spots',
        labelFa: 'لکه‌های تیره',
        value: 'dark-spots',
        nextQuestionId: 'q3',
      },
      {
        id: 'q2_o3',
        labelEn: 'Fine Lines',
        labelFa: 'خطوط ریز',
        value: 'fine-lines',
        nextQuestionId: 'q3',
      },
      {
        id: 'q2_o4',
        labelEn: 'Dryness',
        labelFa: 'خشکی',
        value: 'dryness',
        nextQuestionId: 'q3',
      },
      {
        id: 'q2_o5',
        labelEn: 'Redness',
        labelFa: 'قرمزی',
        value: 'redness',
        nextQuestionId: 'q3',
      },
      {
        id: 'q2_o6',
        labelEn: 'Dullness',
        labelFa: 'کدری',
        value: 'dullness',
        nextQuestionId: 'q3',
      },
    ],
  },
  {
    id: 'q3',
    type: 'single',
    questionEn: 'What\'s your skincare routine?',
    questionFa: 'روتین مراقبت از پوست شما چیست؟',
    isFirst: false,
    isLast: false,
    options: [
      {
        id: 'q3_o1',
        labelEn: 'Beginner - Just starting',
        labelFa: 'مبتدی - تازه شروع کرده‌ام',
        value: 'beginner',
        nextQuestionId: 'q4',
      },
      {
        id: 'q3_o2',
        labelEn: 'Intermediate - Basic routine',
        labelFa: 'متوسط - روتین پایه',
        value: 'intermediate',
        nextQuestionId: 'q4',
      },
      {
        id: 'q3_o3',
        labelEn: 'Advanced - Full routine',
        labelFa: 'پیشرفته - روتین کامل',
        value: 'advanced',
        nextQuestionId: 'q4',
      },
    ],
  },
  {
    id: 'q4',
    type: 'single',
    questionEn: 'What\'s your main skincare goal?',
    questionFa: 'هدف اصلی شما از مراقبت از پوست چیست؟',
    isFirst: false,
    isLast: true,
    options: [
      {
        id: 'q4_o1',
        labelEn: 'Glowing, radiant skin',
        labelFa: 'پوست درخشان و شاداب',
        value: 'glow',
        nextQuestionId: null,
      },
      {
        id: 'q4_o2',
        labelEn: 'Clear, blemish-free skin',
        labelFa: 'پوست صاف و بدون لک',
        value: 'clear',
        nextQuestionId: null,
      },
      {
        id: 'q4_o3',
        labelEn: 'Hydrated, plump skin',
        labelFa: 'پوست آبرسانی شده',
        value: 'hydrated',
        nextQuestionId: null,
      },
      {
        id: 'q4_o4',
        labelEn: 'Firm, youthful skin',
        labelFa: 'پوست سفت و جوان',
        value: 'firm',
        nextQuestionId: null,
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    questions: quizQuestions,
    total: quizQuestions.length,
  });
}