'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating empathetic responses to user messages during a conversation.
 *
 * - aiEmpathyInChat - A function that takes user input and the conversation history and returns an empathetic response.
 * - AiEmpathyInChatInput - The input type for the aiEmpathyInChat function.
 * - AiEmpathyInChatOutput - The return type for the aiEmpathyInChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEmpathyInChatInputSchema = z.object({
  message: z.string().describe('The user message to respond to.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The history of the conversation.'),
});
export type AiEmpathyInChatInput = z.infer<typeof AiEmpathyInChatInputSchema>;

const AiEmpathyInChatOutputSchema = z.object({
  response: z.string().describe('The empathetic response to the user message, considering the conversation history.'),
});
export type AiEmpathyInChatOutput = z.infer<typeof AiEmpathyInChatOutputSchema>;

export async function aiEmpathyInChat(input: AiEmpathyInChatInput): Promise<AiEmpathyInChatOutput> {
  return aiEmpathyInChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiEmpathyInChatPrompt',
  input: {schema: AiEmpathyInChatInputSchema},
  output: {schema: AiEmpathyInChatOutputSchema},
  prompt: `You are an empathetic chatbot designed to provide supportive responses to users during a conversation.
  You will receive the latest user message and the conversation history.
  Respond to the user message with empathy and understanding, taking into account the previous messages in the conversation.
  Encourage the user to express their feelings further.

  Conversation History:
  {{#each conversationHistory}}
    {{this.role}}: {{this.content}}
  {{/each}}

  User Message: {{{message}}}`, 
});

const aiEmpathyInChatFlow = ai.defineFlow(
  {
    name: 'aiEmpathyInChatFlow',
    inputSchema: AiEmpathyInChatInputSchema,
    outputSchema: AiEmpathyInChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
