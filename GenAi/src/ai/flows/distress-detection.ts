'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting user distress and providing resources.
 *
 * - detectDistress - An async function that takes user input and returns a distress assessment and suggested resources.
 * - DistressDetectionInput - The input type for the detectDistress function.
 * - DistressDetectionOutput - The return type for the detectDistress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DistressDetectionInputSchema = z.object({
  userInput: z.string().describe('The user input text to analyze for distress.'),
});
export type DistressDetectionInput = z.infer<typeof DistressDetectionInputSchema>;

const DistressDetectionOutputSchema = z.object({
  isDistressed: z.boolean().describe('Whether the user is likely in distress.'),
  sentimentScore: z.number().describe('Sentiment score indicating the level of distress (lower is more negative).'),
  suggestedResources: z.array(z.string()).describe('A list of suggested resources and support options for the user.'),
});
export type DistressDetectionOutput = z.infer<typeof DistressDetectionOutputSchema>;

export async function detectDistress(input: DistressDetectionInput): Promise<DistressDetectionOutput> {
  return detectDistressFlow(input);
}

const detectDistressPrompt = ai.definePrompt({
  name: 'detectDistressPrompt',
  input: {schema: DistressDetectionInputSchema},
  output: {schema: DistressDetectionOutputSchema},
  prompt: `You are an AI assistant designed to detect distress in user input and provide appropriate resources.

  Analyze the following user input:
  {{userInput}}

  Determine if the user is in distress based on the sentiment expressed in their input. Provide a sentiment score between -1 and 1, where -1 is extremely negative and 1 is extremely positive.
  If the user is in severe distress (sentiment score below -0.8), suggest relevant resources and support options, such as links to mental health organizations, crisis hotlines, or self-help resources. Otherwise, return an empty array for suggestedResources.

  Ensure that the output is a JSON object that conforms to the DistressDetectionOutputSchema, including the isDistressed boolean, sentimentScore, and suggestedResources array.

  Example resources for users in India:
  - Vandrevala Foundation Helpline: 9999666555
  - iCALL Psychosocial Helpline (TISS): 022-25521111
  - AASRA (Suicide Prevention & Counseling): +91-9820466726
  - KIRAN Mental Health Rehabilitation Helpline: 1800-599-0019
  `,
});

const detectDistressFlow = ai.defineFlow(
  {
    name: 'detectDistressFlow',
    inputSchema: DistressDetectionInputSchema,
    outputSchema: DistressDetectionOutputSchema,
  },
  async input => {
    const {output} = await detectDistressPrompt(input);
    return output!;
  }
);
