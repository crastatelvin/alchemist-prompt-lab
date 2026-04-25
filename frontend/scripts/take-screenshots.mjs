import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_URL = "http://127.0.0.1:5173";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");
const shot = (name) => path.join(rootDir, "docs", "screenshots", name);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1580, height: 980 } });

  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot("01-landing.png"), fullPage: true });

  await page
    .getByPlaceholder("Design your primary prompt variant...")
    .fill("Explain recursion in 3 bullet points for a beginner with one tiny example.");
  await page.getByRole("button", { name: "Run Experiment" }).click();
  await page.waitForSelector("text=Single Run Result", { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot("02-single-run.png"), fullPage: true });

  await page.getByRole("button", { name: "A/B Test" }).click();
  await page.waitForTimeout(400);
  await page
    .getByPlaceholder("Design your primary prompt variant...")
    .fill("You are a great teacher. Explain recursion for a 12-year-old using bullets.");
  await page.getByPlaceholder("Design your challenger prompt variant...").fill("Explain recursion.");
  await page.getByRole("button", { name: "Run Experiment" }).click();
  await page.waitForSelector("text=Winner: Variant", { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: shot("03-ab-results.png"), fullPage: true });

  await page.getByRole("button", { name: "Compare Diff" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot("04-diff-and-timeline.png"), fullPage: true });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: shot("05-analytics-history.png"), fullPage: true });

  await browser.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
