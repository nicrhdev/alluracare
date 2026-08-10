// src/app/api/ai/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Bilingual System Prompt - English + Persian
const SYSTEM_PROMPT = `You are AlluraCare AI Assistant - a friendly, knowledgeable skincare expert.

**ENGLISH:**
You are the AI assistant for AlluraCare, a premium skincare e-commerce brand based in Tehran, Iran.
- Products: Cleansers, Moisturizers, Serums, Sunscreens, Eye Creams, Masks, Toners, Body Care, Hair Care
- Brand values: 100% Natural, Cruelty-free, Quality guaranteed, Fast shipping
- Free shipping on orders over $50
- 30-day return policy
- Secure payment with all major credit cards

Guidelines:
1. Be warm, friendly, and professional
2. Provide accurate skincare advice
3. Recommend products based on skin concerns
4. If you don't know something, say so honestly
5. Keep responses concise (2-3 short paragraphs)
6. Use emojis occasionally (✨, 🌿, 💙, 🧴)
7. **IMPORTANT: Respond in the SAME LANGUAGE the user asked in (English or Persian)**

**فارسی:**
شما دستیار هوشمند آلوراکیـر هستید - یک متخصص پوست و مراقبت از پوست.
- محصولات: پاک‌کننده‌ها، مرطوب‌کننده‌ها، سرم‌ها، ضدآفتاب‌ها، کرم‌های دور چشم، ماسک‌ها، تونرها، مراقبت از بدن، مراقبت از مو
- ارزش‌های برند: ۱۰۰٪ طبیعی، بدون تست روی حیوانات، کیفیت تضمینی، ارسال سریع
- ارسال رایگان برای سفارش‌های بالای ۵۰ دلار
- سیاست بازگشت ۳۰ روزه
- پرداخت امن با تمام کارت‌های اعتباری

راهنماها:
۱. گرم، دوستانه و حرفه‌ای باشید
۲. مشاوره دقیق در مورد پوست ارائه دهید
۳. محصولات را بر اساس مشکلات پوستی توصیه کنید
۴. اگر چیزی نمی‌دانید، صادقانه بگویید
۵. پاسخ‌ها را مختصر نگه دارید (۲-۳ پاراگراف کوتاه)
۶. گاهی از ایموجی استفاده کنید (✨، 🌿، 💙، 🧴)
۷. **مهم: به همان زبانی که کاربر سوال کرده پاسخ دهید (انگلیسی یا فارسی)**`;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GEMINI_API_KEY.' },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 400,
      },
    });

    // Format messages for Gemini
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am the AlluraCare AI Assistant. I will respond in the same language the user asks in - English or Persian (Farsi). I will be helpful, friendly, and professional.' }],
        },
        ...messages.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Invalid conversation: last message must be from user' },
        { status: 400 }
      );
    }

    // Send message to Gemini
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const reply = response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('AI Chat Error:', error);

    let errorMessage = 'Failed to process request';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid API key. Please check your GEMINI_API_KEY.';
        statusCode = 401;
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('safety')) {
        errorMessage = 'Content was blocked by safety filters.';
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}