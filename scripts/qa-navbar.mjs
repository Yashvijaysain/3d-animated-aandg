import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3102";
const browser = await chromium.launch({ headless: true });
const results = [];

async function expectSectionInView(page, selector, label, width) {
  await page.waitForTimeout(1600);
  const state = await page.locator(selector).evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, viewportHeight: window.innerHeight, scrollY: window.scrollY };
  });

  if (state.bottom <= 0 || state.top >= state.viewportHeight) {
    throw new Error(`${label} did not scroll into view at ${width}px: ${JSON.stringify(state)}`);
  }

  return state;
}

for (const width of [390, 768, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: width === 390 ? 844 : 950 },
    reducedMotion: "reduce",
  });
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await nav.waitFor({ state: "visible", timeout: 15000 });

  await nav.getByRole("link", { name: "Projects" }).click();
  await page.waitForURL(`${baseUrl}/projects`);
  if ((await nav.getByRole("link", { name: "Projects" }).getAttribute("aria-current")) !== "page") {
    throw new Error(`Projects did not become active at ${width}px.`);
  }

  await nav.getByRole("link", { name: "Gallery" }).click();
  await page.waitForURL(`${baseUrl}/#projects-gallery`);
  await page.locator("#projects-gallery").waitFor();
  const galleryState = await expectSectionInView(page, "#projects-gallery", "Gallery", width);
  if ((await nav.getByRole("link", { name: "Gallery" }).getAttribute("aria-current")) !== "page") {
    throw new Error(`Gallery did not become active at ${width}px.`);
  }

  await nav.getByRole("link", { name: "Contact" }).click();
  await page.waitForURL(`${baseUrl}/#contact`);
  await page.locator("#contact").waitFor();
  const contactState = await expectSectionInView(page, "#contact", "Contact", width);
  if ((await nav.getByRole("link", { name: "Contact" }).getAttribute("aria-current")) !== "page") {
    throw new Error(`Contact did not become active at ${width}px.`);
  }

  await nav.getByRole("link", { name: "Home" }).click();
  await page.waitForURL(`${baseUrl}/`);
  if ((await nav.getByRole("link", { name: "Home" }).getAttribute("aria-current")) !== "page") {
    throw new Error(`Home did not become active at ${width}px.`);
  }

  await page.goto(`${baseUrl}/projects/ivory-county`, { waitUntil: "domcontentloaded" });
  await nav.waitFor({ state: "visible", timeout: 15000 });
  await nav.getByRole("link", { name: "Gallery" }).click();
  await page.waitForURL(`${baseUrl}/#projects-gallery`);

  const navState = await nav.evaluate((element) => ({
    pointerEvents: getComputedStyle(element).pointerEvents,
    opacity: getComputedStyle(element).opacity,
  }));

  if (navState.pointerEvents === "none" || Number(navState.opacity) < 0.9) {
    throw new Error(`Navbar is not interactive at ${width}px: ${JSON.stringify(navState)}`);
  }
  if (errors.length) throw new Error(`Browser errors at ${width}px: ${errors.join(" | ")}`);

  results.push({ width, routes: "passed", galleryState, contactState, navState });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
