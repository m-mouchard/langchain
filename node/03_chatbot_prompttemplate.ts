import 'dotenv/config';
import { ChatVertexAI } from "@langchain/google-vertexai";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

const prompt = ChatPromptTemplate.fromMessages(
  [
    ["system","you are a curious pirate so you answer all questions to the best of your quality",],
    new MessagesPlaceholder("messages"),
  ]
)

const callModel = async (state: typeof MessagesAnnotation.State) => {
    const chain = prompt.pipe(llm);
    const response = await chain.invoke(state);
    return { messages: [response]};
};

// Resumen del workflow
// Inicio: El flujo comienza en START.
// Primer nodo ("model"): Al iniciar, el flujo se mueve desde START al nodo "model", ejecutando la función callModel.
// Finalización: Después de ejecutar callModel, el flujo se mueve de "model" a END, terminando el proceso.
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model",callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

const app = workflow.compile({checkpointer: new MemorySaver()});

const config = {configurable: {thread_id: uuidv4()}};

const input = [
    {
        role: "user",
        content: "Hi, I'm Manuel",
    }
];

const output = await app.invoke({messages: input}, config);

const input2 = [
    {
        role: "user",
        content: "Hi, I'm Manuel again",
    }
];

const output2 = await app.invoke({messages: input2}, config);

console.log('output', output2);