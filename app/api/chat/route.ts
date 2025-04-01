import { hydeModel, multiStageModel } from "@/ai/middleware";
import { openai } from "@ai-sdk/openai";
import { smoothStream, streamText } from "ai";
export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages, modelId } = await request.json();

  let selectedModel;

  switch (modelId) {
    case "hyde-rag":
      selectedModel = hydeModel;
      break;
    case "multi-stage-rag":
      selectedModel = multiStageModel;
      break;
    default:
      selectedModel = openai(modelId || "gpt-4o-mini");
  }

  const result = streamText({
    model: selectedModel,
    system:
      "You are helpful assistant. Keep the answers short and to the point.",
    messages: messages,
    experimental_transform: smoothStream(),
  });

  return result.toDataStreamResponse({});
}
