// src/ai/flows/generate-audio-from-text.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow that converts text to speech.
 *
 * - generateAudioFromText - A function that takes text as input and returns the audio data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const GenerateAudioInputSchema = z.string().describe('The text to convert to speech.');
export type GenerateAudioInput = z.infer<typeof GenerateAudioInputSchema>;

const GenerateAudioOutputSchema = z.object({
    audioDataUri: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type GenerateAudioOutput = z.infer<typeof GenerateAudioOutputSchema>;


export async function generateAudioFromText(
  input: GenerateAudioInput
): Promise<GenerateAudioOutput> {
  return generateAudioFromTextFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateAudioFromTextFlow = ai.defineFlow(
  {
    name: 'generateAudioFromTextFlow',
    inputSchema: GenerateAudioInputSchema,
    outputSchema: GenerateAudioOutputSchema,
  },
  async (text) => {
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text,
      });

    if (!media) {
      throw new Error('Audio generation failed.');
    }
    
    const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
    );

    const wavBase64 = await toWav(audioBuffer);
    
    return {
        audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
