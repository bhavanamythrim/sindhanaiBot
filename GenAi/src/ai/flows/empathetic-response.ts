'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating empathetic responses to user messages.
 *
 * - empatheticResponse - A function that takes user input and returns an empathetic response.
 * - EmpatheticResponseInput - The input type for the empatheticResponse function.
 * - EmpatheticResponseOutput - The return type for the empatheticResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmpatheticResponseInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
});
export type EmpatheticResponseInput = z.infer<typeof EmpatheticResponseInputSchema>;

const EmpatheticResponseOutputSchema = z.object({
  response: z.string().describe('The empathetic response to the user message.'),
});
export type EmpatheticResponseOutput = z.infer<typeof EmpatheticResponseOutputSchema>;

export async function empatheticResponse(input: EmpatheticResponseInput): Promise<EmpatheticResponseOutput> {
  return empatheticResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticResponsePrompt',
  input: {schema: EmpatheticResponseInputSchema},
  output: {schema: EmpatheticResponseOutputSchema},
  prompt: `You are an empathetic chatbot designed to provide supportive responses to users expressing their feelings.
  Respond to the following user message with empathy and understanding. Encourage the user to express their feelings further.
  User Message: {{{message}}}`,
});

const empatheticResponseFlow = ai.defineFlow(
  {
    name: 'empatheticResponseFlow',
    inputSchema: EmpatheticResponseInputSchema,
    outputSchema: EmpatheticResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
