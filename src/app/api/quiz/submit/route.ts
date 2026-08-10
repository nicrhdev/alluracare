// src/app/api/quiz/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import type { QuizSubmission } from '@/types/quiz';

// Sample product recommendations based on quiz results
const getRecommendations = (answers: { questionId: string; optionId: string }[]) => {
  // Extract values from answers
  const skinType = answers.find(a => a.questionId === 'q1')?.optionId;
  const concerns = answers.filter(a => a.questionId === 'q2').map(a => a.optionId);
  const routine = answers.find(a => a.questionId === 'q3')?.optionId;
  const goal = answers.find(a => a.questionId === 'q4')?.optionId;

  // Build recommendation logic
  const recommendations = [];

  // Base recommendations based on skin type
  if (skinType === 'q1_o1') {
    recommendations.push('Hydrating Cleanser', 'Rich Moisturizer', 'Hyaluronic Acid Serum');
  } else if (skinType === 'q1_o2') {
    recommendations.push('Gel Cleanser', 'Lightweight Moisturizer', 'Salicylic Acid Serum');
  } else if (skinType === 'q1_o4') {
    recommendations.push('Gentle Cleanser', 'Soothing Moisturizer', 'Calming Serum');
  }

  // Add concerns-based recommendations
  if (concerns.includes('q2_o1')) {
    recommendations.push('Acne Treatment', 'BHA Exfoliant');
  }
  if (concerns.includes('q2_o2')) {
    recommendations.push('Vitamin C Serum', 'Niacinamide');
  }
  if (concerns.includes('q2_o3')) {
    recommendations.push('Retinol', 'Peptide Cream');
  }

  // Add goal-based recommendations
  if (goal === 'q4_o1') {
    recommendations.push('Vitamin C', 'AHA Exfoliant');
  } else if (goal === 'q4_o3') {
    recommendations.push('Hyaluronic Acid', 'Ceramide Cream');
  }

  // Return unique recommendations
  return [...new Set(recommendations)];
};

export async function POST(request: NextRequest) {
  try {
    const body: QuizSubmission = await request.json();
    const { answers, email, name } = body;

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // Generate recommendations
    const recommendations = getRecommendations(answers);

    // Here you could save the quiz result to the database
    // await prisma.quizResult.create({ data: { ... } });

    // Return results
    return NextResponse.json({
      success: true,
      recommendations,
      message: 'Quiz submitted successfully!',
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz' },
      { status: 500 }
    );
  }
}