import { expect, test } from "@playwright/test";

test("the portrait doodle studio opens and exits cleanly", async ({ page }) => {
  await page.goto("/");

  const invite = page.getByRole("button", { name: "Draw on my portrait" });
  await expect(invite).toBeVisible();
  await invite.click();

  const studio = page.getByRole("complementary", { name: "Doodle studio" });
  await expect(studio).toBeVisible();
  await expect(page.getByLabel("Doodle canvas")).toHaveCount(1);

  await page.getByRole("button", {
    name: "Close doodle studio and exit drawing mode",
  }).click();
  await expect(studio).toBeHidden();
  await expect(invite).toBeVisible();
});
