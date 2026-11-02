import dotenv from "dotenv";
import os from "node:os";
import path from "node:path";

export type BrowserName = "chromium" | "firefox" | "webkit";

export interface FrameworkConfig {
  baseUrl: string;
  username: string;
  password: string;
  browser: BrowserName;
  headless: boolean;
  stepTimeoutMs: number;
}

const selectedEnvironment = process.env.TEST_ENV ?? "qa";
const environmentFile = path.resolve(
  process.cwd(),
  "config",
  `.env.${selectedEnvironment}`
);
const environmentResult = dotenv.config({ path: environmentFile });

if (environmentResult.error) {
  throw new Error(
    `Could not load environment file "${environmentFile}": ${environmentResult.error.message}`
  );
}

function requiredValue(name: string): string {
  let value = process.env[name]?.trim();
  if (
    name === "USERNAME" &&
    process.platform === "win32" &&
    value === os.userInfo().username
  ) {
    value = environmentResult.parsed?.USERNAME?.trim();
  }

  if (!value) {
    throw new Error(`Missing required environment variable "${name}" in ${environmentFile}.`);
  }
  return value;
}

function parseBoolean(name: string, value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  if (value.toLowerCase() === "true") {
    return true;
  }
  if (value.toLowerCase() === "false") {
    return false;
  }

  throw new Error(`Environment variable "${name}" must be "true" or "false".`);
}

function parseTimeout(value: string | undefined): number {
  const timeout = Number(value ?? "30000");
  if (!Number.isInteger(timeout) || timeout <= 0) {
    throw new Error("STEP_TIMEOUT_MS must be a positive whole number.");
  }
  return timeout;
}

const browser = (process.env.BROWSER ?? "chromium").toLowerCase();
if (!["chromium", "firefox", "webkit"].includes(browser)) {
  throw new Error('BROWSER must be one of "chromium", "firefox", or "webkit".');
}

const baseUrl = requiredValue("BASE_URL");
try {
  new URL(baseUrl);
} catch {
  throw new Error(`BASE_URL must be a valid absolute URL; received "${baseUrl}".`);
}

// Environment variables provided by the shell take precedence over dotenv.
export const frameworkConfig: FrameworkConfig = {
  baseUrl,
  username: requiredValue("USERNAME"),
  password: requiredValue("PASSWORD"),
  browser: browser as BrowserName,
  headless: parseBoolean("HEADLESS", process.env.HEADLESS, true),
  stepTimeoutMs: parseTimeout(process.env.STEP_TIMEOUT_MS)
};
