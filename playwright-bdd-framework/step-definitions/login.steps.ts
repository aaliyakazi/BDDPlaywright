import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { frameworkConfig } from "../config/config";
import { TestWorld } from "../support/world";

setDefaultTimeout(frameworkConfig.stepTimeoutMs);

// Step definitions translate readable Gherkin sentences into reusable
// page-object methods rather than embedding browser interactions here.
Given("I navigate to the login page", async function (this: TestWorld) {
  await this.getLoginPage().navigateToLoginPage();
});

When("I enter valid username and password", async function (this: TestWorld) {
  const loginPage = this.getLoginPage();
  await loginPage.enterUsername(frameworkConfig.username);
  await loginPage.enterPassword(frameworkConfig.password);
});

When("I enter invalid username and password", async function (this: TestWorld) {
  const loginPage = this.getLoginPage();
  await loginPage.enterUsername(frameworkConfig.username);
  await loginPage.enterPassword(`${frameworkConfig.password}_invalid`);
});

When("I click the login button", async function (this: TestWorld) {
  await this.getLoginPage().clickLogin();
});

Then("I should be successfully logged in", async function (this: TestWorld) {
  await this.getLoginPage().verifySuccessfulLogin();
});

Then("I should see a login error", async function (this: TestWorld) {
  await this.getLoginPage().verifyLoginError();
});
