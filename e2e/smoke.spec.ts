import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads with correct title and upload section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Kolla Avtalet/);
    const uploadSection = page.locator("#upload");
    await expect(uploadSection).toBeVisible();
  });

  test("shows multi-file upload hint", async ({ page }) => {
    await page.goto("/");
    // Client component — wait for hydration
    await expect(page.getByText(/upp till 5 filer/i)).toBeVisible({ timeout: 10000 });
  });
});

test.describe("FAQ page", () => {
  test("renders heading", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("SEO pages", () => {
  const pages = [
    { path: "/regler/las", title: /LAS/ },
    { path: "/guide/uppsagningstid", title: /uppsägningstid/i },
    { path: "/regler/provanstallning", title: /provanställning/i },
    { path: "/guide/konkurrensklausul", title: /konkurrensklausul/i },
    { path: "/guide/granska-anstallningsavtal", title: /granska/i },
  ];

  for (const { path, title } of pages) {
    test(`${path} loads with correct heading`, async ({ page }) => {
      await page.goto(path);
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(title);
    });
  }
});

test.describe("Static pages", () => {
  test("privacy policy loads", async ({ page }) => {
    await page.goto("/integritetspolicy");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("sources page loads", async ({ page }) => {
    await page.goto("/kallor");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
