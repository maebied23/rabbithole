import { isConceptId } from "@/content/black-holes";
import { generateAnswer } from "@/lib/ai";
export const runtime = "nodejs";
// Development limit, deliberately process-wide. Not a distributed/public quota system.
let calls = 0;
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { error: "Cross-origin requests are not accepted." },
      { status: 403 },
    );
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (process.env.RABBITHOLE_ENABLE_AI !== "true" || !key || !model)
    return Response.json(
      {
        error:
          "Live AI is not configured yet. The reviewed reading and route builder work without it.",
      },
      { status: 503 },
    );
  const raw = await request.text();
  if (raw.length > 4000)
    return Response.json(
      { error: "Please keep your question under 600 characters." },
      { status: 413 },
    );
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (
    !body ||
    typeof body.question !== "string" ||
    !body.question.trim() ||
    body.question.length > 600 ||
    !isConceptId(body.conceptId)
  )
    return Response.json(
      { error: "Provide a short question and a known concept." },
      { status: 400 },
    );
  const configured = Number(process.env.RABBITHOLE_AI_CALL_LIMIT ?? "10");
  const limit =
    Number.isInteger(configured) && configured > 0
      ? Math.min(configured, 100)
      : 10;
  if (calls >= limit)
    return Response.json(
      {
        error:
          "The AI request limit has been reached. Curated learning remains available.",
      },
      { status: 429 },
    );
  calls++;
  try {
    const answer = await generateAnswer(body.question, body.conceptId, {
      key,
      model,
    });
    return Response.json(answer, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof Error && e.name === "TimeoutError"
            ? "AI timed out. Curated learning remains available."
            : "The AI response was unavailable or could not be validated. Try the reviewed reading.",
      },
      { status: 502 },
    );
  }
}
