import { cohere } from "@ai-sdk/cohere";
import { convertToModelMessages, streamText } from "ai";

export async function POST(request: Request) {
    const { messages } = await request.json();
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
        model: cohere("command-a-03-2025"),
        system: "Agente de IA focado para Advocacia",
        messages: modelMessages,
        onError({ error }) {
            console.error("Stream error:", error);
        },
    });

    return result.toUIMessageStreamResponse();
}