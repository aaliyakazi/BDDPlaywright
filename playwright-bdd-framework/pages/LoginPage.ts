import { Page } from "playwright";
import { frameworkConfig } from "../config/config";

// Page Object Model: selectors and all login-page interactions stay in this class.
export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly loginError;
  private readonly productsTitle;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.loginError = page.locator('[data-test="error"]');
    this.productsTitle = page.getByText("Products", { exact: true });
  }

  async navigateToLoginPage(): Promise<void> {
    await this.page.goto(frameworkConfig.baseUrl, { waitUntil: "domcontentloaded" });
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.productsTitle.waitFor({ state: "visible" });
    if (!this.page.url().endsWith("/inventory.html")) {
      throw new Error(`Expected the products page, but landed on "${this.page.url()}".`);
    }
  }

  async verifyLoginError(): Promise<void> {
    await this.loginError.waitFor({ state: "visible" });
    const message = (await this.loginError.innerText()).trim();
    if (!message) {
      throw new Error("The login error element was visible but contained no message.");
    }
  }
}
