// Hono app entry for the academy backend.
// Mounts under the same base the existing service uses: /api/skorost
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { operationsRoute } from "./routes/operations.route";
import { predictionsRoute } from "./routes/predictions.route";

const app = new Hono();

// The /predictions page calls the API from the browser, so allow CORS.
app.use("/api/*", cors());

app.get("/", (c) => c.text("Skorost backend — ok"));

// /api/skorost/operations/*
app.route("/api/skorost/operations", operationsRoute);

// /api/skorost/predictions/*
app.route("/api/skorost/predictions", predictionsRoute);

const port = Number(process.env.PORT ?? 8787);

// Only start a listener when run directly (not when imported for tests).
if (process.env.NODE_ENV !== "test") {
	serve({ fetch: app.fetch, port });
	console.log(`backend listening on http://localhost:${port}`);
}

export { app };
