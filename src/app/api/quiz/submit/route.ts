// src/app/api/quiz/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface QuizAnswer {
  questionId: string;
  optionId: string;
}

// Sample product recommendations based on quiz results
const getRecommendations = (answers: QuizAnswer[]): string[] => {
  // Extract values from answers
  const skinType = answers.find(a => a.questionId === 'q1')?.optionId;
  const concerns = answers.filter(a => a.questionId === 'q2').map(a => a.optionId);
  const goal = answers.find(a => a.questionId === 'q4')?.optionId;

  // ✅ Fixed: Explicitly type as string array
  const recommendations: string[] = [];

  // Base recommendations based on skin type
  if (skinType === 'q1_o1') {
    recommendations.push('Hydrating Cleanser', 'Rich Moisturizer', 'Hyaluronic Acid Serum');
  } else if (skinType === 'q1_o2') {
    recommendations.push('Gel Cleanser', 'Lightweight Moisturizer', 'Salicylic Acid Serum');
  } else if (skinType === 'q1_o3') {
    recommendations.push('Balancing Cleanser', 'Lightweight Moisturizer', 'Niacinamide Serum');
  } else if (skinType === 'q1_o4') {
    recommendations.push('Gentle Cleanser', 'Soothing Moisturizer', 'Calming Serum');
  } else if (skinType === 'q1_o5') {
    recommendations.push('Gentle Cleanser', 'Balancing Moisturizer', 'Hyaluronic Acid Serum');
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
  if (concerns.includes('q2_o4')) {
    recommendations.push('Hydrating Mask', 'Ceramide Cream');
  }
  if (concerns.includes('q2_o5')) {
    recommendations.push('Soothing Serum', 'Centella Cream');
  }
  if (concerns.includes('q2_o6')) {
    recommendations.push('Vitamin C', 'AHA Exfoliant');
  }

  // Add goal-based recommendations
  if (goal === 'q4_o1') {
    recommendations.push('Vitamin C', 'AHA Exfoliant');
  } else if (goal === 'q4_o2') {
    recommendations.push('Salicylic Acid', 'Niacinamide');
  } else if (goal === 'q4_o3') {
    recommendations.push('Hyaluronic Acid', 'Ceramide Cream');
  } else if (goal === 'q4_o4') {
    recommendations.push('Retinol', 'Peptide Cream');
  }

  // Remove duplicates and return
  return [...new Set(recommendations)];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, email, name } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // Generate recommendations
    const recommendations = getRecommendations(answers);

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