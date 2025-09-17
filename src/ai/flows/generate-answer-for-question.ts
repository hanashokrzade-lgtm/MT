'use server';
/**
 * @fileOverview This file defines a Genkit flow that answers a student's question about educational paths.
 *
 * - generateAnswerForQuestion - A function that takes a question as input and returns a text answer.
 * - GenerateAnswerForQuestionInput - The input type for the generateAnswerForQuestion function.
 * - GenerateAnswerForQuestionOutput - The return type for the generateAnswerForQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerForQuestionInputSchema = z.object({
  question: z.string().describe('سوال دانش‌آموز'),
});
export type GenerateAnswerForQuestionInput = z.infer<typeof GenerateAnswerForQuestionInputSchema>;

const GenerateAnswerForQuestionOutputSchema = z.object({
  answer: z.string().describe('پاسخ به سوال دانش‌آموز'),
});
export type GenerateAnswerForQuestionOutput = z.infer<typeof GenerateAnswerForQuestionOutputSchema>;

export async function generateAnswerForQuestion(input: GenerateAnswerForQuestionInput): Promise<GenerateAnswerForQuestionOutput> {
  return generateAnswerForQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnswerForQuestionPrompt',
  input: {schema: GenerateAnswerForQuestionInputSchema},
  output: {schema: GenerateAnswerForQuestionOutputSchema},
  prompt: `شما یک مشاور تحصیلی خبره و دانا در ایران هستید. وظیفه شما پاسخ دادن به سوالات دانش‌آموزان در مورد انتخاب رشته، دانشگاه‌ها، بازار کار و آینده تحصیلی است. پاسخ‌های شما باید به زبان فارسی، دقیق، مفید و با لحنی دلگرم‌کننده باشد.

سوال دانش‌آموز: {{{question}}}

لطفاً یک پاسخ جامع و واضح به این سوال ارائه دهید.
`,
});

const generateAnswerForQuestionFlow = ai.defineFlow(
  {
    name: 'generateAnswerForQuestionFlow',
    inputSchema: GenerateAnswerForQuestionInputSchema,
    outputSchema: GenerateAnswerForQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
