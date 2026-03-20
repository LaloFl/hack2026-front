import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { content, title, type } = await request.json();

  // Create a ReadableStream that simulates API streaming
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Simulate API call with streaming response
        // In production, replace with actual API call to your enhancement service
        const enhancementPrompt =
          type === "Quiz"
            ? `Enhance this quiz with more detailed explanations and additional practice questions:\n\n${content}`
            : `Enhance this lecture content with more examples, clearer explanations, and practical tips:\n\n${content}`;

        // Simulate streaming chunks (in production, this would be from actual API)
        const chunks = generateStreamChunks(enhancementPrompt);

        for (const chunk of chunks) {
          controller.enqueue(chunk);
          // Add small delay to simulate streaming
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

function generateStreamChunks(prompt: string): Uint8Array[] {
  // Mock enhancement content - replace with actual API response in production
  const enhancement = `

### Enhanced Content

This section has been enhanced with additional insights and context.

**Key improvements:**
- More comprehensive examples
- Clearer explanations
- Additional practice scenarios
- Better structure and flow

> 💡 **Tip:** Review the enhanced sections carefully and adjust as needed for your specific training objectives.`;

  const chunks: Uint8Array[] = [];
  const chunkSize = 20;

  for (let i = 0; i < enhancement.length; i += chunkSize) {
    const chunk = enhancement.slice(i, i + chunkSize);
    chunks.push(new TextEncoder().encode(chunk));
  }

  return chunks;
}
