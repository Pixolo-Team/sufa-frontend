// Operations routes. See docs/operations/04-api.md.
import { Hono } from "hono";
import { OPERATIONS_SEED } from "../db/seed";

export const operationsRoute = new Hono();

/**
 * GET /operations/centers
 * Returns all active centers with plans + per-center prices, plus the global
 * config (UPI, payee, per-session rate). Powers the calculator, the fee-structure
 * message, and the payment QR on the frontend /operations page.
 *
 * 🟡 Scaffold: serves DUMMY seed data. Swap for real DB queries later.
 */
operationsRoute.get("/centers", (c) => {
	return c.json({ data: OPERATIONS_SEED });
});
