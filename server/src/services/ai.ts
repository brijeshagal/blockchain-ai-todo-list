import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { isArray } from "util";

dotenv.config();

const model = new OpenAI({
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
  // modelName: "gpt-4-1106-preview",
});

export async function suggestPriority(taskTitle: string, dueDate: string) {
  const prompt = PromptTemplate.fromTemplate(`
    You are an assistant that sets task priorities based on title and due date.
    
    Task: {taskTitle}
    Due Date: {dueDate}
    
    Suggest a priority: (High, Medium, Low)
  `);

  const chain = prompt.pipe(model);

  const response = await chain.invoke({ taskTitle, dueDate });

  // Now safely parse!
  return { priority: response.trim() };
}

export const suggestProductivityTips = async () => {
  const prompt = PromptTemplate.fromTemplate(`
      You are a unique and thoughtful productivity coach.
      
      Provide a quick productivity tip for staying focused and efficient in not more than 15 words.
    `);

  const chain = prompt.pipe(model);

  const response = await chain.invoke({});
  return isArray(response) ? response : [response];
};
