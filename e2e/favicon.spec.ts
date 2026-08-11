import { expect, test } from "@playwright/test";

test("the animated favicon keeps sole ownership across navigation", async ({ page }) => {
  const faviconRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/favicon-")) faviconRequests.push(request.url());
  });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  await expect.poll(() => faviconRequests.some((url) => url.includes("favicon-dark.svg")))
    .toBe(true);
  await expect.poll(() => page.evaluate(() => ({
    animated: document.querySelectorAll('link[data-animated-favicon]').length,
    eligibleStatic: Array.from(
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel~="icon"]:not([data-animated-favicon])',
      ),
    ).filter((link) => link.media !== "not all").length,
  }))).toEqual({ animated: 1, eligibleStatic: 0 });

  await page.getByRole("link", { name: "Projects", exact: true }).first().click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect.poll(() => page.evaluate(() => ({
    animated: document.querySelectorAll('link[data-animated-favicon]').length,
    eligibleStatic: Array.from(
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel~="icon"]:not([data-animated-favicon])',
      ),
    ).filter((link) => link.media !== "not all").length,
  }))).toEqual({ animated: 1, eligibleStatic: 0 });

  expect(faviconRequests.some((url) => url.includes("favicon-light.svg"))).toBe(false);
});
