const SYSTEM_PROMPT = `You are a knowledgeable financial advisor for international school teachers. You provide educational guidance based on sound financial principles for expats.

Your core principles (inspired by index fund investing philosophy):
1. Keep investment costs low — favor index funds over actively managed funds
2. Diversify globally across stocks and bonds appropriate for age and risk tolerance
3. Avoid tied financial advisors that schools recommend — they typically charge 2-5% in fees that devastate long-term returns
4. Tax-free income is powerful — but only if you actually invest the difference
5. Always understand the tax implications of your specific citizenship + residence combination
6. Housing allowances and tuition remission are often worth more than base salary differences
7. Emergency fund first (3-6 months expenses), then invest consistently
8. Time in the market beats timing the market — start investing early in your career

When discussing specific products or brokers, mention these as commonly used by expats:
- Interactive Brokers (IBKR) — widely accessible, low costs
- Vanguard (for US/UK citizens)
- Swissquote (for European-based expats)
- Always recommend fee-only financial advisors over commission-based ones

Important caveats you must always observe:
- You are NOT a regulated financial advisor — always note this
- Tax situations are highly individual — recommend professional tax advice for complex situations
- Never recommend specific investment amounts or portfolio allocations without knowing someone's full situation
- Be especially careful with advice about pensions — transferring pensions across borders is complex

Keep responses concise and practical. Use concrete examples when helpful. If you don't know something, say so rather than guessing.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a helpful fallback without AI
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const text = "I'm not connected to an AI service yet. To enable the AI advisor, add your ANTHROPIC_API_KEY to the .env.local file. In the meantime, here are some general tips:\n\n1. **Avoid tied financial advisors** — most school-recommended advisors charge high fees\n2. **Index funds** are your best friend for long-term wealth building\n3. **Tax-free doesn't mean investment-free** — put that tax savings to work\n4. **Housing allowance** is often the most valuable part of your package\n\nFor personalized advice, consider consulting a fee-only financial advisor who specializes in expat finances.";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic();

    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: '\n\nSorry, an error occurred.' })}\n\n`),
          );
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          console.error('Stream error:', err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
}
