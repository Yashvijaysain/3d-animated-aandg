import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = "http://localhost:3000";
const outputDir = "test-results/project-tools";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const consoleErrors = [];

async function dismissLoaderForQa() {
  await page.evaluate(() => {
    const loader = document.querySelector("[data-ag-loading-screen]");
    if (loader instanceof HTMLElement) {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
    }
    document.documentElement.classList.remove("ag-loader-running");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    window.agLenis?.start();
  });
}

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

await mkdir(outputDir, { recursive: true });

try {
  await page.goto(`${baseUrl}/projects/clove-county`, { waitUntil: "networkidle" });
  await dismissLoaderForQa();
  const finder = page.getByRole("region", { name: "Find the Right Property for You" });
  await finder.scrollIntoViewIfNeeded();
  await finder.getByRole("radio", { name: /End Use/ }).click();
  await finder.getByRole("button", { name: "Continue" }).click();
  await finder.getByRole("button", { name: "Back" }).click();
  if ((await finder.getByRole("radio", { name: /End Use/ }).getAttribute("aria-checked")) !== "true") {
    throw new Error("Finder did not preserve the selected purpose after using Back.");
  }
  await finder.getByRole("button", { name: "Continue" }).click();
  await finder.getByRole("radio", { name: /Noida Select/ }).click();
  await finder.getByRole("button", { name: "Continue" }).click();
  await finder.getByRole("radio", { name: /₹3–5 Cr/ }).click();
  await finder.getByRole("button", { name: "Continue" }).click();
  await finder.getByRole("radio", { name: /4 BHK/ }).click();
  await finder.getByRole("button", { name: "Continue" }).click();
  await finder.getByRole("radio", { name: /New Launch/ }).click();
  await finder.getByRole("button", { name: "Continue" }).click();
  await finder.getByRole("button", { name: /Larger Homes/ }).click();
  await finder.getByRole("button", { name: "Show My Matches" }).click();
  await finder.getByRole("heading", { name: /Projects aligned with your brief|The closest available A&G options/ }).waitFor();
  await finder.screenshot({ path: `${outputDir}/finder-desktop-1440.png` });

  const resultCards = finder.getByRole("article");
  if ((await resultCards.count()) !== 3) throw new Error("Finder did not render exactly three recommendations.");
  await resultCards.nth(0).getByRole("button", { name: "Compare" }).click();
  const dialog = page.getByRole("dialog", { name: "Compare with another project" });
  await dialog.waitFor();
  await dialog.getByPlaceholder("Search projects...").fill("Ivory");
  await dialog.getByRole("button", { name: /Ivory County/ }).waitFor();
  await dialog.getByPlaceholder("Search projects...").fill("");
  await dialog.getByRole("link", { name: /Compare 2 Projects/ }).click();
  await page.waitForURL(/\/compare\?projects=/);
  await page.getByRole("heading", { name: "Compare Projects" }).waitFor();
  if ((await page.locator('input[name="comparedProjects"]').count()) !== 2) {
    throw new Error("Compared project names were not passed to the consultation form.");
  }
  await page.screenshot({ path: `${outputDir}/comparison-desktop-1440.png`, fullPage: true });

  await page.getByRole("button", { name: "Add Project" }).click();
  const limitDialog = page.getByRole("dialog", { name: "Compare with another project" });
  await limitDialog.getByPlaceholder("Search projects...").fill("County 107");
  await limitDialog.getByRole("button", { name: /County 107/ }).click();
  await limitDialog.getByPlaceholder("Search projects...").fill("Ivy County");
  await limitDialog.getByRole("button", { name: /Ivy County/ }).click();
  await limitDialog.getByText("You can compare up to 3 projects at a time. Remove one project to continue.").waitFor();
  await limitDialog.getByRole("button", { name: "Close project comparison selector" }).click();

  const widths = [360, 375, 390, 412, 430, 768, 1024, 1366, 1440];
  const overflowResults = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
    await page.goto(`${baseUrl}/compare?projects=clove-county,ivory-county`, { waitUntil: "networkidle" });
    await dismissLoaderForQa();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    overflowResults.push({ width, overflow });
    if (overflow > 1) throw new Error(`Horizontal overflow of ${overflow}px at ${width}px.`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/compare?projects=clove-county,ivory-county`, { waitUntil: "networkidle" });
  await dismissLoaderForQa();
  if (await page.getByLabel("Selected projects comparison").count()) throw new Error("Floating compare bar should be hidden on the comparison page.");
  await page.screenshot({ path: `${outputDir}/comparison-mobile-390.png`, fullPage: true });
  await page.goto(`${baseUrl}/projects/clove-county`, { waitUntil: "networkidle" });
  await dismissLoaderForQa();
  await page.getByRole("region", { name: "Find the Right Property for You" }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  if (await page.getByLabel("Selected projects comparison").count()) throw new Error("Floating compare bar should be hidden while using the property finder.");
  const projectOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (projectOverflow > 1) throw new Error(`Project page horizontal overflow of ${projectOverflow}px at 390px.`);
  await page.getByRole("region", { name: "Find the Right Property for You" }).screenshot({ path: `${outputDir}/finder-mobile-390.png` });

  if (consoleErrors.length) throw new Error(`Console errors:\n${consoleErrors.join("\n")}`);
  console.log(JSON.stringify({ ok: true, overflowResults, screenshots: 4 }, null, 2));
} finally {
  await browser.close();
}
