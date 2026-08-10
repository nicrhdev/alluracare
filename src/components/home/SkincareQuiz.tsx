// src/components/home/SkincareQuiz.tsx

'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Sparkles, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { QuizQuestion, QuizAnswer } from '@/types/quiz';

interface SkincareQuizProps {
  locale: string;
}

export default function SkincareQuiz({ locale }: SkincareQuizProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  const isPersian = locale === 'fa';

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/quiz/questions');
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen]);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (questionId: string, optionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    if (question.type === 'multi') {
      setSelectedOptions((prev) => {
        const current = prev[questionId] || [];
        if (current.includes(optionId)) {
          return {
            ...prev,
            [questionId]: current.filter(id => id !== optionId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...current, optionId],
          };
        }
      });
    } else {
      // Single select
      setSelectedOptions((prev) => ({
        ...prev,
        [questionId]: [optionId],
      }));

      // Auto-advance after selection
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }, 300);
    }
  };

  const isOptionSelected = (questionId: string, optionId: string) => {
    return (selectedOptions[questionId] || []).includes(optionId);
  };

  const goToNext = () => {
    const currentSelected = selectedOptions[currentQuestion?.id] || [];
    if (currentSelected.length === 0) {
      toast.error(isPersian ? 'لطفاً یک گزینه را انتخاب کنید' : 'Please select an option');
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);

    try {
      const answerData = Object.entries(selectedOptions).flatMap(([questionId, optionIds]) =>
        optionIds.map(optionId => ({ questionId, optionId }))
      );

      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerData }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.recommendations);
        toast.success(isPersian ? 'نتیجه آزمون شما آماده است!' : 'Your quiz results are ready!');
      } else {
        toast.error(data.error || isPersian ? 'خطا در پردازش آزمون' : 'Failed to process quiz');
      }
    } catch (error) {
      toast.error(isPersian ? 'خطا در ارتباط با سرور' : 'Server error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOptions({});
    setResults(null);
    setAnswers([]);
  };

  const closeQuiz = () => {
    setIsOpen(false);
    resetQuiz();
  };

  if (!isOpen) {
    return (
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container-custom text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-sm font-medium bg-white/20 px-4 py-1.5 rounded-full inline-block mb-4">
              {isPersian ? '✨ تست پوست' : '✨ Skin Quiz'}
            </span>
            <h2 className="heading-2 mb-3">
              {isPersian ? 'پوست خود را بشناسید' : 'Discover Your Skin'}
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              {isPersian
                ? 'با پاسخ به چند سوال، بهترین محصولات را برای پوست خود پیدا کنید'
                : 'Answer a few questions and find the best products for your skin'}
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-brand-primary px-8 py-3 rounded-xl font-medium hover:bg-white/90 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {isPersian ? 'شروع تست' : 'Start Quiz'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Quiz Modal/Overlay
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-modal animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-brand-secondary/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <span className="font-semibold text-brand-text">
              {isPersian ? 'تست پوست' : 'Skin Quiz'}
            </span>
          </div>
          <button
            onClick={closeQuiz}
            className="p-1 text-brand-text-secondary hover:text-brand-primary transition rounded-lg hover:bg-brand-pale-rose"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
          ) : results ? (
            // Results
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="heading-3 mb-2">
                {isPersian ? 'نتیجه تست شما' : 'Your Quiz Results'}
              </h3>
              <p className="text-brand-text-secondary mb-6">
                {isPersian
                  ? 'بر اساس پاسخ‌های شما، این محصولات برای پوست شما مناسب هستند:'
                  : 'Based on your answers, these products are recommended for your skin:'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-brand-pale-rose/30 text-brand-primary rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <button
                onClick={resetQuiz}
                className="mt-6 text-brand-primary hover:text-brand-hover font-medium transition"
              >
                {isPersian ? '🔄 دوباره امتحان کنید' : '🔄 Try Again'}
              </button>
            </div>
          ) : (
            // Questions
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-brand-text-secondary mb-2">
                  <span>
                    {isPersian
                      ? `سوال ${currentIndex + 1} از ${questions.length}`
                      : `Question ${currentIndex + 1} of ${questions.length}`}
                  </span>
                  <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-brand-pale-rose rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {currentQuestion && (
                <div>
                  {/* Question */}
                  <h3 className="heading-3 mb-2">
                    {isPersian ? currentQuestion.questionFa : currentQuestion.questionEn}
                  </h3>
                  {currentQuestion.descriptionEn && (
                    <p className="text-brand-text-secondary text-sm mb-6">
                      {isPersian ? currentQuestion.descriptionFa : currentQuestion.descriptionEn}
                    </p>
                  )}

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = isOptionSelected(currentQuestion.id, option.id);
                      const isMulti = currentQuestion.type === 'multi';

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                            isSelected
                              ? 'border-brand-primary bg-brand-pale-rose/20 shadow-soft'
                              : 'border-brand-secondary/20 hover:border-brand-primary/30 hover:bg-brand-pale-rose/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? 'border-brand-primary bg-brand-primary'
                                  : 'border-brand-secondary'
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-brand-text">
                              {isPersian ? option.labelFa : option.labelEn}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-brand-secondary/10">
                <button
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 text-sm font-medium transition ${
                    currentIndex === 0
                      ? 'text-brand-text-secondary/30 cursor-not-allowed'
                      : 'text-brand-text-secondary hover:text-brand-primary'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {isPersian ? 'قبلی' : 'Previous'}
                </button>
                <button
                  onClick={goToNext}
                  disabled={submitting}
                  className="btn-primary flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isPersian ? 'در حال بررسی...' : 'Processing...'}
                    </>
                  ) : currentIndex === questions.length - 1 ? (
                    isPersian ? 'مشاهده نتایج' : 'See Results'
                  ) : (
                    isPersian ? 'بعدی' : 'Next'
                  )}
                  {!submitting && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}