# RabbitHole

Follow a question through the ideas that help explain it.

RabbitHole is an interactive way to explore astronomy and physics. It combines a concept map, guided routes, short explanations, experiments, and a personal notebook so that one question can become a learning journey.

## Why I built it

Reading _The Three-Body Problem_ left me curious about the science behind it: gravity, unpredictable motion, enormous distances, and the way we measure time. Answering one question often introduced several unfamiliar ideas. I wanted a way to keep those connections visible and return to the question that started the search.

I built RabbitHole to work through that curiosity. Organizing the topics into routes pushed me to connect ideas, check explanations against sources, and distinguish what a physical model predicts from what we can observe. The project became a way to learn the subject while building something I would want to use myself.

The books are the starting point for my interest. The content focuses on real physics and contains no plot spoilers.

## How it works

Start with a route or a question. Explore the connected concepts, inspect their sources, and take a detour whenever something catches your attention. You can switch between the graph and a list without losing access to the explanations.

Five routes are available:

- **Inside the idea of a black hole** — horizons, spacetime, and what observations tell us.
- **Three bodies, unpredictable paths** — gravity, orbits, starting conditions, and chaos.
- **Light across enormous distances** — light-years and the delay between emission and observation.
- **When clocks disagree** — reference frames, relative motion, and gravitational time dilation.
- **How stars live and die** — fusion, stellar evolution, and different stellar remnants.

The learning studio lets you build a short session around your available time and preferred starting point. Each step has a reason. Checkpoints offer feedback and can change what the next session suggests revisiting. Experiments make light-travel delay and gravitational force adjustable, with their assumptions and equations explained.

Save concepts, write an explanation in your own words, and leave questions for your next visit. Notes, bookmarks, sessions, and attempts stay in your browser. A visit records exploration; a correct answer is one piece of feedback, not proof that a topic has been mastered.

## Where I want to take it

I want RabbitHole to help people follow their own curiosity while giving them enough structure to make progress. Someone might arrive after reading a novel, watching a documentary, or encountering an idea they cannot quite explain. They should be able to find a starting point, understand why the next concept matters, and gradually answer their original question in their own words.

The next step is to deepen the space content: more connections, richer examples, and questions that ask learners to apply an idea in a new situation. Learning routes should become easier to adjust as someone discovers gaps, changes direction, or returns after time away. Feedback from people using the app will help determine which guidance is useful and which gets in the way.

AI can help interpret questions, offer another explanation, and suggest relevant paths through the material. Those suggestions should remain connected to sources and clear about uncertainty. The learner should be able to understand and change the route being proposed.

Longer term, the same approach could support other subjects. The reusable idea is a relationship between a person's question, the concepts needed to explore it, and their own developing explanation. Astronomy and physics remain the focus while I work out how to make that experience useful.

## Run locally

Requires Node.js 24 and pnpm 10.22.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed in the terminal, usually `http://localhost:3000`.

The routes, experiments, notebook, session builder, and local question matching work without an API key or account. Browser storage does not sync across devices and is accessible to anyone sharing the same browser profile.

### Optional AI explanations

Copy `.env.example` to `.env.local`, set `OPENAI_API_KEY` and `OPENAI_MODEL` to a Responses API model supporting structured outputs, and set `RABBITHOLE_ENABLE_AI=true`. Restart the development server after changing these values.

Under **Ask a space question**, open **Explore your question** and select **Get an explanation**. This sends the question and a small selection of concept excerpts to OpenAI. Personal notes and learning history are not included. Keys stay on the server.

Generated explanations are labeled as AI-assisted and cannot change the shared content. Source identifiers are validated against the supplied context; this does not guarantee that every generated claim is supported. The default limit is ten requests per server process, including failed attempts. It resets on restart and is intended for local use. Public hosting with AI enabled requires authentication, durable usage limits, and a spending budget. Live model quality has not yet been evaluated.

## Development

Built with Next.js, React, TypeScript, React Flow, and Tailwind CSS.

```sh
pnpm typecheck
pnpm test
pnpm format:check
```

Concepts, sources, scientific relationships, and learning routes live in `content/`. Planning, question matching, local persistence, and the optional provider integration live in `lib/`. The interface lives in `components/` and `app/`.

Scientific relationships and suggested reading connections are modeled separately. Source links point to NASA, Einstein Online, OpenStax, LIGO, and UC Santa Cruz. Explanations are paraphrased; institutional images and article copies are not bundled. Content has been checked against the linked material but has not undergone independent expert review.

Tests cover content integrity, route planning, navigation, persistence, question matching, and provider validation. Browser layout testing and evaluation with learners remain ongoing work.
