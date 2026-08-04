// Hono app entry for the academy backend.
// Mounts under the same base the existing service uses: /api/skorost
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { operationsRoute } from "./routes/operations.route";

const app = new Hono();

app.get("/", (c) => c.text("Skorost backend — ok"));

// /api/skorost/operations/*
app.route("/api/skorost/operations", operationsRoute);

const port = Number(process.env.PORT ?? 8787);

// Only start a listener when run directly (not when imported for tests).
if (process.env.NODE_ENV !== "test") {
	serve({ fetch: app.fetch, port });
	console.log(`backend listening on http://localhost:${port}`);
}

export { app };
