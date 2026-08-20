import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3102";
const outputDir = "test-results/contact-phone";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1684, height: 900 }, reducedMotion: "reduce" });
await page.goto(`${baseUrl}/#contact`, { waitUntil: "networkidle" });

const phone = page.locator("#contact-title");
await phone.waitFor({ state: "visible" });
await phone.scrollIntoViewIfNeeded();

const state = await phone.evaluate((element) => {
  const elementRect = element.getBoundingClientRect();
  const characters = Array.from(element.querySelectorAll("[data-phone-character]"));
  const characterBottom = Math.max(...characters.map((character) => character.getBoundingClientRect().bottom));
  const wrappers = Array.from(element.querySelectorAll("span")).filter(
    (span) => getComputedStyle(span).overflow === "hidden",
  );
  const wrapperBottom = Math.max(...wrappers.map((wrapper) => wrapper.getBoundingClientRect().bottom));

  return {
    elementBottom: elementRect.bottom,
    characterBottom,
    wrapperBottom,
    fontFamily: getComputedStyle(element).fontFamily,
    lineHeight: getComputedStyle(element).lineHeight,
  };
});

if (state.characterBottom > state.wrapperBottom + 0.5) {
  throw new Error(`Phone characters are clipped: ${JSON.stringify(state)}`);
}

await page.screenshot({ path: `${outputDir}/phone-desktop.png`, fullPage: false });
await browser.close();
console.log(JSON.stringify(state, null, 2));
