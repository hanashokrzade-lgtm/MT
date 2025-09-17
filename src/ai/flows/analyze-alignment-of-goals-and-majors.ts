// این فایل شامل یک جریان Genkit برای تجزیه و تحلیل هم‌راستایی اهداف دانش‌آموزان با رشته‌های تحصیلی مختلف است.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAlignmentInputSchema = z.object({
  goals: z.string().describe('اهداف دانش‌آموز'),
  majorOptions: z.array(z.string()).describe('لیستی از رشته‌های تحصیلی'),
});
export type AnalyzeAlignmentInput = z.infer<typeof AnalyzeAlignmentInputSchema>;

const AnalyzeAlignmentOutputSchema = z.array(
  z.object({
    major: z.string().describe('رشته تحصیلی'),
    alignmentScore: z.number().describe('امتیاز هم‌راستایی با اهداف دانش‌آموز'),
    reasoning: z.string().describe('دلیل امتیاز هم‌راستایی'),
  })
);
export type AnalyzeAlignmentOutput = z.infer<typeof AnalyzeAlignmentOutputSchema>;

export async function analyzeAlignmentOfGoalsAndMajors(
  input: AnalyzeAlignmentInput
): Promise<AnalyzeAlignmentOutput> {
  return analyzeAlignmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAlignmentPrompt',
  input: {schema: AnalyzeAlignmentInputSchema},
  output: {schema: AnalyzeAlignmentOutputSchema},
  prompt: `شما یک مشاور تحصیلی هستید که به دانش‌آموزان در انتخاب رشته تحصیلی مناسب کمک می‌کنید. وظیفه شما این است که اهداف دانش‌آموز را با رشته‌های تحصیلی مختلف مقایسه کرده و میزان هم‌راستایی هر رشته با اهداف دانش‌آموز را ارزیابی کنید.

اهداف دانش‌آموز: {{{goals}}}

رشته‌های تحصیلی:
{{#each majorOptions}}
- {{{this}}}
{{/each}}

لطفاً برای هر رشته تحصیلی، یک امتیاز هم‌راستایی بین 0 تا 100 تعیین کنید و دلیل این امتیاز را توضیح دهید. خروجی باید یک آرایه JSON باشد که شامل نام رشته، امتیاز هم‌راستایی و دلیل آن باشد.
`,
});

const analyzeAlignmentFlow = ai.defineFlow(
  {
    name: 'analyzeAlignmentFlow',
    inputSchema: AnalyzeAlignmentInputSchema,
    outputSchema: AnalyzeAlignmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
