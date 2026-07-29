import { test, expect } from "@playwright/test";

test("projects page lists case studies that link through to a detail page", async ({ page }) => {
  await page.goto("/projects");
  const firstCaseStudyLink = page.getByRole("link", { name: /Read case study/i }).first();
  await expect(firstCaseStudyLink).toBeVisible();
  await firstCaseStudyLink.click();
  await expect(page).toHaveURL(/\/projects\/.+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("featured work on the home page links into a project case study", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore case study" }).first().click();
  await expect(page).toHaveURL(/\/projects\/.+/);
});
