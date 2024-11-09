import 'dotenv/config';

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({model: "gpt-3.5-turbo", apiKey:process.env.OPENAI_API_KEY});

const messages = [
    new SystemMessage("You are super optimistic towards anything people tell you"),
    new HumanMessage("How do you see macroeconomics?"),
];

const reply = await model.invoke(messages);

console.log('reply', reply.content);