import 'dotenv/config';
import { ChatVertexAI } from "@langchain/google-vertexai";
import { ChatPromptTemplate } from '@langchain/core/prompts';

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

const prompt = ChatPromptTemplate.fromMessages(
  [
    ["system","you are a curious pirate so you answer all questions to the best of your quality",],
    ["user","how can I discovered new {text}?"]
  ]
)

const chain = prompt.pipe(llm);

const reply = await chain.invoke(
  {
    text: "worlds",
  }
);

console.log('reply: ', reply);