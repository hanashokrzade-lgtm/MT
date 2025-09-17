// src/ai/flows/analyze-student-answers-and-suggest-majors.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow that analyzes a student's answers to questions
 * about their interests, grades, strengths, weaknesses, and goals, and suggests suitable educational majors.
 *
 * - analyzeStudentAnswersAndSuggestMajors - A function that takes student answers as input and returns suggested majors.
 * - AnalyzeStudentAnswersAndSuggestMajorsInput - The input type for the analyzeStudentAnswersAndSuggestMajors function.
 * - AnalyzeStudentAnswersAndSuggestMajorsOutput - The return type for the analyzeStudentAnswersAndSuggestMajors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentAnswersAndSuggestMajorsInputSchema = z.object({
  interests: z.string().describe('علایق دانش‌آموز'),
  grades: z.string().describe('نمرات دانش‌آموز در دروس مختلف'),
  strengths: z.string().describe('نقاط قوت دانش‌آموز'),
  weaknesses: z.string().describe('نقاط ضعف دانش‌آموز'),
  careerGoals: z.string().describe('اهداف شغلی دانش‌آموز در آینده'),
  familyExpectations: z.string().describe('انتظارات خانواده از دانش‌آموز در مورد رشته تحصیلی'),
});
export type AnalyzeStudentAnswersAndSuggestMajorsInput = z.infer<typeof AnalyzeStudentAnswersAndSuggestMajorsInputSchema>;

const AnalyzeStudentAnswersAndSuggestMajorsOutputSchema = z.object({
  suggestedMajors: z.array(
    z.object({
      major: z.string().describe('رشته تحصیلی پیشنهادی'),
      strengths: z.string().describe('نقاط قوت رشته تحصیلی'),
      weaknesses: z.string().describe('نقاط ضعف رشته تحصیلی'),
      careerOpportunities: z.string().describe('فرصت‌های شغلی مرتبط با رشته تحصیلی'),
      futureAcademicPaths: z.string().describe('مسیرهای تحصیلی آینده مرتبط با رشته تحصیلی'),
    })
  ).describe('لیست رشته‌های تحصیلی پیشنهادی با توضیحات'),
  summary: z.string().describe('خلاصه پیشنهادات و راهنمایی‌ها'),
  stepByStepPath: z.string().describe('مسیر گام به گام برای انتخاب رشته'),
});
export type AnalyzeStudentAnswersAndSuggestMajorsOutput = z.infer<typeof AnalyzeStudentAnswersAndSuggestMajorsOutputSchema>;

export async function analyzeStudentAnswersAndSuggestMajors(input: AnalyzeStudentAnswersAndSuggestMajorsInput): Promise<AnalyzeStudentAnswersAndSuggestMajorsOutput> {
  return analyzeStudentAnswersAndSuggestMajorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentAnswersAndSuggestMajorsPrompt',
  input: {schema: AnalyzeStudentAnswersAndSuggestMajorsInputSchema},
  output: {schema: AnalyzeStudentAnswersAndSuggestMajorsOutputSchema},
  prompt: `شما یک مشاور تحصیلی باهوش هستید که به دانش‌آموزان دبیرستانی در ایران کمک می‌کنید تا رشته تحصیلی خود را انتخاب کنند. تمام مکالمات باید کاملاً به زبان فارسی، با لحنی طبیعی، دوستانه و انگیزشی باشد.

وظیفه شما این است که با دانش‌آموزان از طریق زبان فارسی (گفتاری و نوشتاری) تعامل داشته باشید، و در مورد علایق، نمرات، نقاط قوت، نقاط ضعف، اهداف شغلی و انتظارات خانواده‌شان سؤال بپرسید. پس از تجزیه و تحلیل پاسخ‌های آنها، راهنمایی‌های شخصی‌سازی شده در مورد مناسب‌ترین رشته‌های تحصیلی (مانند ریاضیات، علوم تجربی، انسانی، فنی یا هنر) ارائه دهید.

برای هر رشته پیشنهادی، به وضوح به زبان فارسی نقاط قوت، نقاط ضعف، فرصت‌های شغلی و مسیرهای تحصیلی آینده را توضیح دهید. همیشه لحن را حمایت‌آمیز، دلگرم‌کننده و آسان برای فهم نوجوانان نگه دارید.

در پایان جلسه، توصیه‌های خود را به زبان فارسی خلاصه کرده و یک مسیر گام به گام ساده برای انتخاب رشته مناسب ارائه دهید.

هرگز به انگلیسی یا هر زبان دیگری تغییر نکنید - همیشه به طور کامل به زبان فارسی پاسخ دهید.

اطلاعات دانش‌آموز:
علایق: {{{interests}}}
نمرات: {{{grades}}}
نقاط قوت: {{{strengths}}}
نقاط ضعف: {{{weaknesses}}}
اهداف شغلی: {{{careerGoals}}}
انتظارات خانواده: {{{familyExpectations}}}
`,
});

const analyzeStudentAnswersAndSuggestMajorsFlow = ai.defineFlow(
  {
    name: 'analyzeStudentAnswersAndSuggestMajorsFlow',
    inputSchema: AnalyzeStudentAnswersAndSuggestMajorsInputSchema,
    outputSchema: AnalyzeStudentAnswersAndSuggestMajorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input, {
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_LOW_AND_ABOVE',
          },
        ],
      },
    });
    return output!;
  }
);
