// src/ai/flows/generate-educational-article.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates an educational article
 * on a given topic for high school students and saves it to a JSON file.
 *
 * - generateEducationalArticle - A function that takes a topic and returns a new article.
 * - GenerateArticleInput - The input type for the function.
 * - Article - The return type for the function (from the article service).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { addArticle, type Article } from '@/services/article-service';

const GenerateArticleInputSchema = z.object({
  topic: z.string().describe('موضوع مقاله'),
});
export type GenerateArticleInput = z.infer<typeof GenerateArticleInputSchema>;

const GeneratedArticleOutputSchema = z.object({
  title: z.string().describe('عنوان جذاب و مرتبط برای مقاله'),
  description: z.string().describe('خلاصه‌ای کوتاه (حدود 2-3 جمله) از مقاله برای نمایش در کارت'),
  category: z.string().describe('دسته‌بندی مقاله (مثلاً: انتخاب رشته، بازار کار، مشاوره تحصیلی)'),
  content: z.string().describe('محتوای کامل مقاله، حداقل 300 کلمه، با پاراگراف‌بندی مناسب'),
});
type GeneratedArticleOutput = z.infer<typeof GeneratedArticleOutputSchema>;

export async function generateEducationalArticle(input: GenerateArticleInput): Promise<Article> {
  return generateEducationalArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEducationalArticlePrompt',
  input: { schema: GenerateArticleInputSchema },
  output: { schema: GeneratedArticleOutputSchema },
  prompt: `شما یک نویسنده و مشاور تحصیلی خبره هستید که برای یک اپلیکیشن مشاوره به دانش‌آموزان دبیرستانی در ایران، مقالات مفید و جذاب می‌نویسید.

وظیفه شما این است که یک مقاله کامل، آموزنده و با لحنی دوستانه و قابل فهم برای نوجوانان، در مورد موضوع زیر بنویسید:
موضوع: {{{topic}}}

مقاله باید دارای ویژگی‌های زیر باشد:
1.  **عنوان (title):** یک عنوان جذاب و واضح برای مقاله انتخاب کنید.
2.  **خلاصه (description):** یک توضیح کوتاه و گیرا (حدود 2 تا 3 جمله) برای مقاله بنویسید که در کارت پیش‌نمایش نشان داده شود.
3.  **دسته‌بندی (category):** یکی از دسته‌بندی‌های "انتخاب رشته"، "بازار کار"، "مشاوره تحصیلی"، "معرفی رشته" یا "تکنیک‌های مطالعه" را برای مقاله انتخاب کنید.
4.  **محتوای اصلی (content):** محتوای مقاله باید حداقل 300 کلمه باشد، به زبان فارسی روان نوشته شده و به خوبی پاراگراف‌بندی شده باشد. از لیست‌های شماره‌گذاری شده یا بالت پوینت برای خوانایی بهتر استفاده کنید. محتوا باید کاربردی، دقیق و متناسب با شرایط ایران باشد.

تمام خروجی باید کاملاً به زبان فارسی باشد.
`,
});

const generateEducationalArticleFlow = ai.defineFlow(
  {
    name: 'generateEducationalArticleFlow',
    inputSchema: GenerateArticleInputSchema,
    outputSchema: z.custom<Article>(),
  },
  async (input) => {
    // 1. Generate the article content using the AI prompt
    const { output } = await prompt(input);

    if (!output) {
      throw new Error("Article generation failed: AI did not return a valid output.");
    }

    // 2. Save the newly generated article to our "database" (JSON file)
    const newArticle = await addArticle({
      title: output.title,
      description: output.description,
      category: output.category,
      content: output.content,
    });
    
    // 3. Return the newly created article (with its new ID and creation date)
    return newArticle;
  }
);
