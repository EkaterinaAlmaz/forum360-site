import { test, expect } from "@playwright/test";

const DARK = "rgb(34, 36, 38)";
const LIGHT = "rgb(234, 234, 234)";

test("hero uses redesigned logo copy and no CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(
    "ФОРУМ 360 — Организация мероприятий по всей России в рамках 44-ФЗ",
  );
  await expect(page.locator("#hero-title")).toBeVisible();
  await expect(page.locator("#hero-title")).toHaveText(
    "Организация мероприятий по всей России в рамках 44-ФЗ",
  );
  await expect(page.locator(".hero__logo")).toBeVisible();
  await expect(page.locator(".site-header")).toBeVisible();
  await expect(page.locator(".hero .btn")).toHaveCount(0);
  await expect(page.locator(".site-header .logo-link")).toHaveCount(0);
  await expect(page.locator(".hero-process__float--3 text")).toHaveCount(0);
});

test("about CTA scrolls to cases", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.locator(".about-cta").click();
  await expect(page).toHaveURL(/#cases$/);
  await expect(page.locator("#cases-title")).toBeVisible();
});

test("desktop navigation aligns section headings at key viewports", async ({
  page,
}) => {
  test.setTimeout(60000);

  const desktopViewports = [
    { width: 1100, height: 620 },
    { width: 1366, height: 768 },
    { width: 1920, height: 968 },
  ];

  for (const viewport of desktopViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    for (const id of ["hero", "about", "team", "cases"] as const) {
      await page.locator(`.site-header .site-nav a[href="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));

      await expect
        .poll(
          () =>
            page.evaluate((sectionId) => {
              const target = document.getElementById(sectionId);
              const header =
                document.querySelector<HTMLElement>(".site-header");
              const anchor =
                sectionId === "hero"
                  ? target
                  : (target?.querySelector<HTMLElement>(".section-head") ??
                    target);
              const rect = anchor?.getBoundingClientRect();
              const headerHeight = header?.getBoundingClientRect().height ?? 0;
              const expectedTop =
                sectionId === "hero" ? 0 : headerHeight + 14;
              return {
                active: document
                  .querySelector(".site-header .site-nav a.is-active")
                  ?.getAttribute("href"),
                aligned:
                  rect != null && Math.abs(rect.top - expectedTop) <= 4,
                overflowX:
                  document.documentElement.scrollWidth > window.innerWidth,
              };
            }, id),
          { timeout: 5000 },
        )
        .toEqual({
          active: `#${id}`,
          aligned: true,
          overflowX: false,
        });
    }

    await page.locator('.site-header .site-nav a[href="#contacts"]').click();
    await expect(page).toHaveURL(/#contacts$/);
    await expect
      .poll(() =>
        page.evaluate(() =>
          document
            .querySelector(".site-header .site-nav a.is-active")
            ?.getAttribute("href"),
        ),
      )
      .toBe("#contacts");
  }
});

test("case modal opens with loaded photo, detail toggle and escape close", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#cases");
  await page.locator('[data-case="seminars4"]').click();
  await expect(page.locator(".modal.is-open")).toBeVisible();
  await expect(page.locator("#modalTitle")).toContainText("Семинаров");

  const image = page.locator(".modal-gallery-img");
  await expect(image).toBeVisible();
  await expect
    .poll(async () =>
      image.evaluate((img) => {
        const el = img as HTMLImageElement;
        return el.complete && el.naturalWidth > 0;
      }),
    )
    .toBe(true);

  await page.locator(".modal-detail-btn").click();
  await expect(page.locator(".modal-aside")).toHaveClass(/is-detail-open/);
  await expect(page.locator(".modal-detail-btn")).toHaveText("Краткое описание");

  await page.keyboard.press("Escape");
  await expect(page.locator(".modal.is-open")).toHaveCount(0);
});

test("molodoy case follows updated gallery order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#cases");
  await page.locator('[data-case="molodoy"]').click();
  await expect(page.locator(".modal.is-open")).toBeVisible();

  await page.locator(".modal-nav--next").click();
  await expect(page.locator(".modal-gallery-toolbar")).toContainText("2 / 28");

  const image = page.locator(".modal-gallery-img");
  await expect
    .poll(
      async () =>
        image.evaluate((img) => {
          const el = img as HTMLImageElement;
          const src = decodeURI(el.currentSrc || el.src);
          return {
            complete: el.complete,
            srcHasOriginal: src.includes("Письмо.webp"),
            srcHasGenerated: src.includes("letter.webp"),
            srcHasSecondPhoto: src.includes("/2.webp"),
            width: el.naturalWidth,
            height: el.naturalHeight,
          };
        }),
      { timeout: 10000 },
    )
    .toEqual({
      complete: true,
      srcHasOriginal: false,
      srcHasGenerated: false,
      srcHasSecondPhoto: true,
      width: expect.any(Number),
      height: expect.any(Number),
    });
});

test("projects modal shows all cases", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#cases");
  await page.locator("#casesAllBtn").click();
  await expect(page.locator(".modal--projects.is-open")).toBeVisible();
  await expect(page.locator("#projectsModalTitle")).toHaveText("Все проекты");
  await expect(
    page.locator(".modal--projects .cases-row--data"),
  ).toHaveCount(4);
});

test("hero logo fits viewport at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const logo = page.locator(".hero__logo");
  await expect(logo).toBeVisible();
  const box = await logo.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize()!;
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.width).toBeLessThanOrEqual(viewport.width);
});

test("footer uses final copy and light palette", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contacts").scrollIntoViewIfNeeded();
  await expect(page.locator(".footer-desc")).toHaveText(
    "Организация мероприятий по всей России в рамках 44-ФЗ",
  );

  const colors = await page.locator("#contacts").evaluate((footer) => {
    const chart = footer.querySelector(".footer-chart");
    const footerStyle = getComputedStyle(footer);
    const chartStyle = chart ? getComputedStyle(chart) : null;
    return {
      footerBg: footerStyle.backgroundColor,
      footerColor: footerStyle.color,
      chartBg: chartStyle?.backgroundColor,
      chartColor: chartStyle?.color,
    };
  });

  expect(colors.footerBg).toBe(LIGHT);
  expect(colors.footerColor).toBe(DARK);
  expect(colors.chartBg).toBe(DARK);
  expect(colors.chartColor).toBe(LIGHT);
});

test("desktop team tooltip opens without console errors", async ({ page }) => {
  const consoleIssues: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleIssues.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleIssues.push(error.message));

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/#team");
  await page.locator('.team-circle-hits path[data-member="marina"]').hover();
  await expect(page.locator(".tooltip.is-active")).toBeVisible();
  await expect(page.locator(".tooltip.is-active .tooltip-name")).toHaveText(
    "Марина Плеханова",
  );

  const colors = await page.locator(".tooltip.is-active").evaluate((tooltip) => {
    const style = getComputedStyle(tooltip);
    return {
      bg: style.backgroundColor,
      color: style.color,
    };
  });
  expect(colors.bg).toBe(DARK);
  expect(colors.color).toBe(LIGHT);
  expect(consoleIssues).toEqual([]);
});

async function expectTeamModalNoHorizontalOverflow(page: import("@playwright/test").Page) {
  await page.goto("/#team");
  await page.locator('.team-circle-hits path[data-member="ekaterina"]').click();
  await expect(page.locator(".modal--team-member.is-open")).toBeVisible();
  const scroll = page.locator(".modal--team-member .tmm-scroll");
  await expect(scroll).toBeVisible();
  const overflows = await scroll.evaluate(
    (el) => el.scrollWidth > el.clientWidth + 1
  );
  expect(overflows).toBe(false);
  await expect(page.locator(".tmm-name")).toBeVisible();
  await expect(page.locator(".tmm-stat-lab").first()).toBeVisible();
}

test("team modal at 320px without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await expectTeamModalNoHorizontalOverflow(page);
});

test("team modal at 768px without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1080 });
  await expectTeamModalNoHorizontalOverflow(page);
});

test("team modal on narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#team");
  await page.locator('.team-circle-hits path[data-member="ekaterina"]').click();
  await expect(page.locator(".modal--team-member.is-open")).toBeVisible();
});

test("compact desktop layout at 1100x620", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 620 });
  await page.goto("/");
  const hero = page.locator(".hero");
  const heroBox = await hero.boundingBox();
  expect(heroBox).not.toBeNull();
  const viewport = page.viewportSize()!;
  expect(heroBox!.height).toBeGreaterThanOrEqual(viewport.height * 0.85);
  expect(heroBox!.height).toBeLessThanOrEqual(viewport.height);

  await page.goto("/#team");
  const circle = page.locator(".circle-container");
  await expect(circle).toBeVisible();
  const circleBox = await circle.boundingBox();
  expect(circleBox).not.toBeNull();
  expect(circleBox!.height).toBeGreaterThanOrEqual(viewport.height * 0.42);
  expect(circleBox!.height).toBeLessThanOrEqual(viewport.height * 0.72);
});

test("team modal on laptop 1024 viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 1080 });
  await page.goto("/#team");
  await page.locator('.team-circle-hits path[data-member="ekaterina"]').click();
  await expect(page.locator(".modal--team-member.is-open")).toBeVisible();
  await expect(page.locator(".tooltip.tooltip--in-circle")).toBeHidden();
});
