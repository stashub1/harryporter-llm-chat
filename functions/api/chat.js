import { Ai } from "@cloudflare/ai";

export async function onRequest(context) {
  try {
    const ai = new Ai(context.env.AI);

    if (context.request.method !== "POST") {
      return new Response("Send a POST request with a message in the body", { status: 405 });
    }

    const { message } = await context.request.json();

    console.log("Received message:", message);

    const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        { role: "system", content: "You are Harry Potter, the famous wizard. Respond to all questions as if you were Harry Potter, using his mannerisms and knowledge of the wizarding world." },
        { role: "user", content: message },
      ],
    });

    console.log("AI response:", response);

    return Response.json({ response: response.response });
  } catch (error) {
    console.error("Error in Worker:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
