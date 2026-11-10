import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 1280, height: 800 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
]) {
  test(`letters carousel and full-screen viewer at ${viewport.width}px`, async ({ page }, testInfo) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto("/#thanks");
    await expect(page.locator("#cases + #thanks")).toBeVisible();
    await expect(page.locator("#main-content > section").last()).toHaveAttribute("id", "thanks");
    await expect(page.locator("#letters-title")).toHaveText("Нас благодарят");
    await expect(page.locator(".letter-card")).toHaveCount(3);
    const loaded = async (selector: string) => {
      await expect.poll(() => page.locator(selector).evaluate((element) => {
        const img = element as HTMLImageElement;
        return img.complete && img.naturalWidth > 0;
      }), { timeout: 15000 }).toBe(true);
    };
    await loaded('.letter-card:first-child img');
    await expect(page.locator(".letters-controls")).toHaveCount(0);
    for (const id of ["mordovia", "molodoy", "surgut"]) {
      await expect(page.locator(`[data-letter="${id}"]`)).toBeInViewport({ ratio: 1 });
    }
    await loaded('.letter-card:last-child img');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    await page.locator("#thanks").screenshot({ path: testInfo.outputPath(`carousel-${viewport.width}.png`) });

    const trigger = page.locator('[data-letter="molodoy"]');
    await trigger.click();
    const modal = page.locator(".modal--letter");
    await expect(modal).toBeVisible();
    await expect(page.locator("#letter-viewer-title")).toHaveText("Форум «Молодой город»");
    await loaded('.letter-viewer__image-button img');
    await expect.poll(() => page.locator(".letter-panel").evaluate((panel) => {
      const rect = panel.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: Math.round(rect.width), height: Math.round(rect.height) };
    })).toEqual({ x: 0, y: 0, ...viewport });
    const source = modal.locator(".letter-viewer__original");
    await expect(source).toHaveAttribute("href", "/assets/letters/molodoy.webp");
    const original = await page.request.get((await source.getAttribute("href"))!);
    const oldLetter = await page.request.get("/assets/cases/molodoy-city/2.webp");
    expect((await original.body()).equals(await oldLetter.body())).toBe(true);

    await page.getByRole("button", { name: "Увеличить письмо", exact: true }).click();
    await expect(page.getByRole("button", { name: "По размеру экрана", exact: true })).toHaveText("200%");
    expect(await page.locator(".letter-viewer__viewport").evaluate((element) =>
      element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight,
    )).toBe(true);
    await page.getByRole("button", { name: "По размеру экрана", exact: true }).click();
    await expect(page.getByRole("button", { name: "По размеру экрана", exact: true })).toHaveText("100%");
    await page.keyboard.press("ArrowRight");
    await expect(source).toHaveAttribute("href", "/assets/letters/surgut.pdf");
    await loaded('.letter-viewer__image-button img');
    await expect.poll(() => page.locator(".letter-viewer__image-button").evaluate((element) => element.clientWidth)).toBeGreaterThan(100);
    const pdf = await page.request.head((await source.getAttribute("href"))!);
    expect(pdf.ok()).toBe(true);
    expect(pdf.headers()["content-type"]).toContain("application/pdf");
    await expect(page.getByRole("button", { name: "Закрыть письмо", exact: true })).toBeInViewport();
    await expect(page.locator(".letter-viewer__footer")).toBeInViewport({ ratio: 1 });
    await page.screenshot({ path: testInfo.outputPath(`viewer-${viewport.width}.png`) });
    await page.keyboard.press("ArrowRight");
    await expect(source).toHaveAttribute("href", "/assets/letters/mordovia.pdf");
    await loaded('.letter-viewer__image-button img');
    const mordovia = await page.request.head((await source.getAttribute("href"))!);
    expect(mordovia.ok()).toBe(true);
    expect(mordovia.headers()["content-type"]).toContain("application/pdf");
    await page.keyboard.press("Escape");
    await expect(modal).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(errors).toEqual([]);
  });
}
