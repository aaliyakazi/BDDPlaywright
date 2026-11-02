import { World, IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "playwright";
import { LoginPage } from "../pages/LoginPage";

// A Cucumber World is scenario-scoped shared state. Each scenario gets its own
// browser, context, page, and page object through the Before hook.
export class TestWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  getLoginPage(): LoginPage {
    if (!this.loginPage) {
      throw new Error("LoginPage is unavailable; the browser setup hook may have failed.");
    }
    return this.loginPage;
  }
}

setWorldConstructor(TestWorld);
