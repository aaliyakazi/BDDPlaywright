import {
  After,
  Before,
  ITestCaseHookParameter,
  Status
} from "@cucumber/cucumber";
import { chromium, firefox, webkit, BrowserType } from "playwright";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { frameworkConfig } from "../config/config";
import { LoginPage } from "../pages/LoginPage";
import { TestWorld } from "../support/world";

const browserTypes: Record<string, BrowserType> = { chromium, firefox, webkit };

// The Browser starts a browser process; BrowserContext isolates scenario state;
// Page is the tab on which the page object performs interactions.
Before(async function (this: TestWorld) {
  const browserType = browserTypes[frameworkConfig.browser];
  if (!browserType) {
    throw new Error(`Unsupported browser "${frameworkConfig.browser}".`);
  }

  this.browser = await browserType.launch({ headless: frameworkConfig.headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(frameworkConfig.stepTimeoutMs);
  this.loginPage = new LoginPage(this.page);
});

After(async function (this: TestWorld, { result, pickle }: ITestCaseHookParameter) {
  try {
    if (result?.status === Status.FAILED && this.page) {
      const screenshotDirectory = path.resolve(process.cwd(), "screenshots");
      await mkdir(screenshotDirectory, { recursive: true });
      const scenarioName = pickle.name
        .replace(/[^a-z0-9-_]+/gi, "-")
        .replace(/^-|-$/g, "");
      const screenshotPath = path.join(
        screenshotDirectory,
        `${scenarioName || "failed-scenario"}-${Date.now()}.png`
      );
      const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
      await this.attach(screenshot, "image/png");
    }
  } finally {
    try {
      await this.page?.close();
    } finally {
      try {
        await this.context?.close();
      } finally {
        await this.browser?.close();
      }
    }
  }
});
