import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export async function POST(req) {
  try {
    const { conflict } = await req.json().catch(() => ({}));
    if (!conflict || typeof conflict !== "string" || !conflict.trim()) {
      return json({ error: "Missing `conflict` string." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return json(
        { error: "Server misconfigured: missing ANTHROPIC_API_KEY." },
        { status: 500 },
      );
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = [
      "You are Kyle, a military strategy analyst.",
      "Your job: analyze a described conflict scenario with professional rigor, clear structure, and cautious uncertainty handling.",
      "Return ONLY valid JSON with exactly these top-level keys:",
      "strategic_analysis, predicted_outcomes, market_impacts",
      "",
      "Each value must be a concise but substantive markdown string (bullets allowed).",
      "Do not include any other keys. Do not wrap the JSON in backticks.",
    ].join("\n");

    const message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
      max_tokens: 900,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: "user", content: conflict.trim() }],
    });

    const text =
      message?.content
        ?.filter((b) => b.type === "text")
        ?.map((b) => b.text)
        ?.join("\n") || "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.strategic_analysis !== "string" ||
      typeof parsed.predicted_outcomes !== "string" ||
      typeof parsed.market_impacts !== "string"
    ) {
      return json(
        {
          error: "Model returned unexpected output format.",
          raw: text,
        },
        { status: 502 },
      );
    }

    return json({
      strategic_analysis: parsed.strategic_analysis,
      predicted_outcomes: parsed.predicted_outcomes,
      market_impacts: parsed.market_impacts,
    });
  } catch (err) {
    return json(
      {
        error: "Unhandled server error.",
        details: err?.message || String(err),
      },
      { status: 500 },
    );
  }
}

