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

const config = { configurable: { thread_id: uuidv4() } };
const config2 = { configurable: { thread_id: uuidv4() } };

const llm = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0,
});

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();

const app = workflow.compile({ checkpointer: memory });

const input = [
  {
    role:"user",
    content: "Hola, me llamo Manuel",
  }
];

const input2 = [
  {
    role: "user",
    content: "¿Cómo me llamo?"
  }
];

const input3 = [
  {
    role: "user",
    content: "¿Cómo me llamo?"
  }
];

//The config is adding a persistence layer to separate conversation between users for example and go back to a conversation if desired
const output = await app.invoke({messages: input}, config);
const output2 = await app.invoke({messages: input2}, config);

const output3 = await app.invoke({messages: input3}, config2);

// console.log(output2.messages[output2.messages.length - 1]);
console.log("output2",output2);
console.log("output3",output3);

const input4 = [
  {
    role: "user",
    content: "Como me llamo de nuevo?"
  }
]

const output4 = await app.invoke({messages: input4}, config);

console.log('output4', output4);
