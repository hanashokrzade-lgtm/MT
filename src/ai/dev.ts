import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-student-answers-and-suggest-majors.ts';
import '@/ai/flows/analyze-alignment-of-goals-and-majors.ts';
import '@/ai/flows/generate-audio-from-text.ts';
import '@/ai/flows/generate-answer-for-question.ts';
