import { test, expect } from "@playwright/test";

test("the resume link resolves to a downloadable PDF", async ({ page, request }) => {
  await page.goto("/");
  const response = await request.get("/api/resume");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});
