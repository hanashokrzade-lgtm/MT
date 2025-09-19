'use server';
/**
 * @fileOverview This file defines a Genkit flow that converts text with multiple speakers to a single audio file.
 *
 * - generateMultivoiceAudio - A function that takes a structured text input and returns the audio data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const SpeakerSchema = z.object({
  speaker: z.string().describe('The identifier for the speaker (e.g., "Speaker1", "Speaker2").'),
  voice: z.enum(['Algenib', 'Achernar', 'Sirius', 'Vega']).describe('The prebuilt voice name to use for this speaker.'),
});

const GenerateMultivoiceAudioInputSchema = z.object({
    speakers: z.array(SpeakerSchema).describe('The configuration for each speaker.'),
    script: z.string().describe('The script to be converted to speech, with speaker identifiers. Example: "Speaker1: Hello. Speaker2: Hi there."'),
});
export type GenerateMultivoiceAudioInput = z.infer<typeof GenerateMultivoiceAudioInputSchema>;


const GenerateAudioOutputSchema = z.object({
    audioDataUri: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type GenerateAudioOutput = z.infer<typeof GenerateAudioOutputSchema>;


export async function generateMultivoiceAudio(
  input: GenerateMultivoiceAudioInput
): Promise<GenerateAudioOutput> {
  return generateMultivoiceAudioFlow(input);
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

const generateMultivoiceAudioFlow = ai.defineFlow(
  {
    name: 'generateMultivoiceAudioFlow',
    inputSchema: GenerateMultivoiceAudioInputSchema,
    outputSchema: GenerateAudioOutputSchema,
  },
  async ({speakers, script}) => {
    
    const speakerVoiceConfigs = speakers.map(s => ({
        speaker: s.speaker,
        voiceConfig: {
            prebuiltVoiceConfig: { voiceName: s.voice },
        }
    }));

    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: { speakerVoiceConfigs },
          },
        },
        prompt: script,
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
