'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting music, meditations, art, or quotes based on the user's mood.
 *
 * - moodToMusic - A function that takes a mood description as input and returns a suggestion of music, meditation, art or a quote.
 * - MoodToMusicInput - The input type for the moodToMusic function.
 * - MoodToMusicOutput - The return type for the moodToMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodToMusicInputSchema = z.object({
  mood: z.string().describe('A description of the user\'s current mood.'),
});
export type MoodToMusicInput = z.infer<typeof MoodToMusicInputSchema>;

const MoodToMusicOutputSchema = z.object({
  suggestionType: z.enum(['music', 'meditation', 'art', 'quote']).describe('The type of suggestion provided.'),
  suggestion: z.string().describe('A specific suggestion of music, meditation, art, or quote that matches the user\'s mood.'),
});
export type MoodToMusicOutput = z.infer<typeof MoodToMusicOutputSchema>;

export async function moodToMusic(input: MoodToMusicInput): Promise<MoodToMusicOutput> {
  return moodToMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodToMusicPrompt',
  input: {schema: MoodToMusicInputSchema},
  output: {schema: MoodToMusicOutputSchema},
  prompt: `You are a helpful AI assistant that suggests music, meditations, art, or quotes based on the user's mood to help them relax and feel understood.

  The user's mood is: {{{mood}}}

  Suggest something that would be helpful, and be specific. If you suggest music, give a song title. If you suggest a meditation, give a type of meditation.
  If you suggest art, describe the type of art.

  Return the suggestion in the format specified by the output schema.
`,
});

const moodToMusicFlow = ai.defineFlow(
  {
    name: 'moodToMusicFlow',
    inputSchema: MoodToMusicInputSchema,
    outputSchema: MoodToMusicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
