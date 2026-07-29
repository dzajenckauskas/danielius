import { test, expect } from "@playwright/test";

test("home page loads with the expected title and hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Danielius Zajenčkauskas/);
  await expect(page.getByRole("link", { name: "Explore selected work" })).toBeVisible();
});

test.describe("desktop", () => {
  // The header's inline links only render at the `sm` breakpoint and up
  // (see Nav.tsx's `hidden sm:flex`), so force a desktop viewport regardless
  // of which Playwright project runs this file.
  test.use({ viewport: { width: 1280, height: 800 } });

  test("desktop nav links navigate to Projects and Experience", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await header.getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);

    await header.getByRole("link", { name: "Experience", exact: true }).click();
    await expect(page).toHaveURL(/\/experience$/);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile menu toggles open and closed", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    const toggle = header.getByRole("button", { name: "Toggle menu" });
    const projectsLink = header.getByRole("link", { name: "Projects", exact: true });
    await toggle.click();
    await expect(projectsLink).toBeVisible();
    await toggle.click();
    await expect(projectsLink).toBeHidden();
  });
});

test("reduced motion is respected (no motion-triggering script errors)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});
