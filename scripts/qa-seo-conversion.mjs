import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.QA_BASE_URL || "http://localhost:3101";
const shouldSubmitLead = process.env.QA_SUBMIT_LEAD === "1";
const screenshotDir = "test-results/seo-conversion";
await mkdir(screenshotDir, { recursive: true });
const rawChecks = [
  { path: "/", h1Includes: "Premium Real Estate Advisory in Noida & Gurugram" },
  { path: "/projects", h1Includes: "FIND A HOME" },
  { path: "/projects/ivory-county", h1Includes: "Ivory County, Plot GH-01, Sector 115, Noida" },
  { path: "/projects/clove-county", h1Includes: "Clove County, Plot GH-02, Sector 151, Noida" },
  { path: "/projects/jade-county", h1Includes: "Jade County, Wave City, Ghaziabad" },
];

function htmlText(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

const rawResults = [];

for (const check of rawChecks) {
  const response = await fetch(`${baseUrl}${check.path}`);
  const html = await response.text();
  const headings = Array.from(html.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi), (match) => htmlText(match[1]));

  if (response.status !== 200) throw new Error(`${check.path} returned ${response.status}.`);
  if (headings.length !== 1) throw new Error(`${check.path} rendered ${headings.length} H1 elements.`);
  if (!headings[0].includes(check.h1Includes)) throw new Error(`${check.path} H1 is missing: ${check.h1Includes}`);

  rawResults.push({ path: check.path, status: response.status, h1: headings[0], htmlLength: html.length });

  if (check.path === "/projects") {
    const requiredText = [
      "Ivory County",
      "County Group",
      "Plot GH-01, Sector 115, Noida",
      "Premium 3 and 4 BHK homes",
      "From INR 3.6 Cr*",
      'href="/projects/ivory-county"',
      "<article",
    ];

    for (const text of requiredText) {
      if (!html.includes(text)) throw new Error(`/projects initial HTML is missing: ${text}`);
    }
  }

  if (check.path.startsWith("/projects/") && /href="(?:#|\/projects\/[^"]*)"[^>]*>\s*(?:View|Download) Brochure/i.test(html)) {
    throw new Error(`${check.path} contains a broken brochure href.`);
  }
}

const browser = await chromium.launch({ headless: true });
const browserResults = [];

async function dismissLoader(page) {
  await page.evaluate(() => {
    const loader = document.querySelector("[data-ag-loading-screen]");
    if (loader instanceof HTMLElement) {
      loader.style.display = "none";
      loader.style.pointerEvents = "none";
    }
    document.documentElement.classList.remove("ag-loader-running");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  });
}

for (const width of [390, 768, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 950 }, reducedMotion: "reduce" });
  const consoleErrors = [];
  const failedLocalResources = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText || "unknown failure";
    if (request.url().startsWith(baseUrl) && !failure.includes("ERR_ABORTED")) {
      failedLocalResources.push(`${request.url()} (${failure})`);
    }
  });

  for (const path of ["/", "/projects", "/projects/ivory-county", "/projects/clove-county", "/projects/jade-county"]) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    await dismissLoader(page);

    const h1Count = await page.locator("h1").count();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (h1Count !== 1) throw new Error(`${path} has ${h1Count} browser-rendered H1 elements at ${width}px.`);
    if (overflow > 1) throw new Error(`${path} has ${overflow}px horizontal overflow at ${width}px.`);

    if (path === "/projects") {
      await page.screenshot({
        path: `${screenshotDir}/projects-${width}px.png`,
        fullPage: true,
      });
    }

    browserResults.push({ width, path, h1Count, overflow });
  }

  if (consoleErrors.length) throw new Error(`Console errors at ${width}px: ${consoleErrors.join(" | ")}`);
  if (failedLocalResources.length) throw new Error(`Failed local resources at ${width}px: ${failedLocalResources.join(" | ")}`);
  await page.close();
}

const interactionPage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await interactionPage.goto(`${baseUrl}/projects/ivory-county`, { waitUntil: "networkidle" });
await dismissLoader(interactionPage);

const brochureTrigger = interactionPage.getByRole("button", { name: "Request the Ivory County brochure" }).first();
await brochureTrigger.click();
const dialog = interactionPage.getByRole("dialog", { name: "Request the Ivory County Brochure" });
await dialog.waitFor();
await interactionPage.screenshot({ path: `${screenshotDir}/brochure-modal-390px.png`, fullPage: true });
await interactionPage.keyboard.press("Shift+Tab");
if (!(await dialog.evaluate((element) => element.contains(document.activeElement)))) {
  throw new Error("Brochure modal focus escaped the dialog.");
}
await interactionPage.keyboard.press("Escape");
await dialog.waitFor({ state: "detached" });
if (!(await brochureTrigger.evaluate((element) => element === document.activeElement))) {
  throw new Error("Brochure modal did not restore focus to its trigger.");
}

await brochureTrigger.click();
const reopenedDialog = interactionPage.getByRole("dialog", { name: "Request the Ivory County Brochure" });
if (shouldSubmitLead) {
  await reopenedDialog.locator('input[name="fullName"]').fill("A&G Brochure QA");
  await reopenedDialog.locator('input[name="phone"]').fill("+919999999999");
  await reopenedDialog.getByRole("button", { name: "Request Brochure" }).click();
  await reopenedDialog.getByText("Thank you. Your brochure request has been received.").waitFor({ timeout: 20000 });
} else {
  await interactionPage.keyboard.press("Escape");
}

await interactionPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await dismissLoader(interactionPage);
if ((await interactionPage.locator('a[href="tel:+919654322224"]').count()) < 1) throw new Error("Call tel link is missing.");
if ((await interactionPage.locator('a[href="mailto:info@agarwalandgehlot.com"]').count()) < 1) throw new Error("Email mailto link is missing.");
if ((await interactionPage.locator('a[href^="https://wa.me/919654322224"]').count()) < 1) throw new Error("WhatsApp link is missing.");

await interactionPage.close();
await browser.close();

console.log(
  JSON.stringify(
    {
      rawResults,
      browserResults,
      brochureSubmission: shouldSubmitLead ? "passed" : "skipped (set QA_SUBMIT_LEAD=1 to test)",
      contactLinks: "passed",
    },
    null,
    2,
  ),
);
