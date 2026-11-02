import { BrowserName, frameworkConfig } from "./config/config";

// Shared Playwright browser defaults. Cucumber runs the scenarios; this is not
// a Playwright Test configuration and does not invoke its test runner.
const playwrightConfig = {
  browserName: frameworkConfig.browser as BrowserName,
  headless: frameworkConfig.headless,
  timeout: frameworkConfig.stepTimeoutMs,
  baseURL: frameworkConfig.baseUrl
};

export default playwrightConfig;
