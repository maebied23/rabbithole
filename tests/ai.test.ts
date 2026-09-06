import { it, expect, vi, afterEach } from "vitest";
import { contextFor, validateAnswer, generateAnswer } from "@/lib/ai";
import { POST } from "@/app/api/ask/route";
afterEach(() => vi.unstubAllEnvs());
it("rejects hallucinated IDs, absent evidence, and evidence outside retrieval", () => {
  const context = contextFor("event horizon", "event-horizon");
  for (const data of [
    null,
    { answer: "x", conceptIds: ["invented"], sourceIds: ["einstein-interior"] },
    { answer: "x", conceptIds: [], sourceIds: [] },
    { answer: "x", conceptIds: [], sourceIds: ["stars"] },
  ])
    expect(() => validateAnswer(data, context)).toThrow();
  expect(
    validateAnswer(
      {
        answer: "A boundary.",
        conceptIds: ["event-horizon"],
        sourceIds: ["einstein-interior"],
      },
      context,
    ).conceptIds,
  ).toEqual(["event-horizon"]);
});
it("uses a bounded structured request and validates the provider response", async () => {
  const mock = vi.fn<typeof fetch>().mockResolvedValue(
    new Response(
      JSON.stringify({
        status: "completed",
        output: [
          {
            content: [
              {
                type: "output_text",
                text: JSON.stringify({
                  answer: "A boundary.",
                  conceptIds: ["event-horizon"],
                  sourceIds: ["einstein-interior"],
                }),
              },
            ],
          },
        ],
      }),
    ),
  );
  await generateAnswer(
    "event horizon",
    "event-horizon",
    { key: "test-only", model: "test-model" },
    mock,
  );
  const payload = JSON.parse(mock.mock.calls[0][1]!.body as string);
  expect(payload.store).toBe(false);
  expect(payload.text.format.strict).toBe(true);
  expect(payload.max_output_tokens).toBe(1200);
  expect(payload.input).not.toContain("notes");
});
it("handles provider errors and incomplete responses", async () => {
  for (const response of [
    new Response("", { status: 500 }),
    new Response(JSON.stringify({ status: "incomplete", output: [] })),
    new Response(JSON.stringify({ status: "completed", output: [] })),
  ])
    await expect(
      generateAnswer(
        "event horizon",
        "event-horizon",
        { key: "test", model: "test" },
        vi.fn<typeof fetch>().mockResolvedValue(response),
      ),
    ).rejects.toThrow();
});
it("keeps the live endpoint disabled without explicit configuration", async () => {
  vi.stubEnv("RABBITHOLE_ENABLE_AI", "false");
  const response = await POST(
    new Request("http://localhost/api/ask", { method: "POST", body: "{}" }),
  );
  expect(response.status).toBe(503);
});
it("rejects invalid and cross-origin input before provider calls", async () => {
  vi.stubEnv("RABBITHOLE_ENABLE_AI", "true");
  vi.stubEnv("OPENAI_API_KEY", "test-only");
  vi.stubEnv("OPENAI_MODEL", "test");
  expect(
    (
      await POST(
        new Request("http://localhost/api/ask", {
          method: "POST",
          headers: { origin: "https://other.example" },
          body: "{}",
        }),
      )
    ).status,
  ).toBe(403);
  for (const body of [
    "null",
    "{",
    "{}",
    JSON.stringify({ question: "x", conceptId: "__proto__" }),
  ])
    expect(
      (
        await POST(
          new Request("http://localhost/api/ask", { method: "POST", body }),
        )
      ).status,
    ).toBe(400);
});
