import { streamText } from "ai";
export async function post(request: Request){
    const { messages } = await request.json();

    const result = streamText()

}