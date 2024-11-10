import 'dotenv/config';

import { ChatOpenAI } from "@langchain/openai";
import { ChatVertexAI } from '@langchain/google-vertexai';

import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

// const model = new ChatOpenAI(
//     {
//         model: "gpt-3.5-turbo"
//     });

const model = new ChatVertexAI(
    {
        model: "gemini-1.5-flash",
        temperature: 0,
    });

// const messages = [
//     new SystemMessage("You are super optimistic towards anything people tell you"),
//     new HumanMessage("Como ves la situación macroeconómica?"),
// ];

const systemTemplate = "You are super {adjective}";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
])

// const promptValue = await promptTemplate.invoke({
//     adjective: "optimistic",
//     text: "¿Como ves el sistema educativo de estados unidos?"
// });

const parser = new StringOutputParser();

// const reply = await model.invoke(messages);
// await parser.invoke(reply);

// console.log("reply: ",reply.content);
// console.log("reply_parser: ",replyParser);

//Método pipe para crear cadenas. Encadenados el modelo con el parser
const llmChain = promptTemplate.pipe(model).pipe(parser);

console.log(await llmChain.invoke({adjective: "pesimistic", text:"¿Como ves el sistema educativo de estados unidos?" }));