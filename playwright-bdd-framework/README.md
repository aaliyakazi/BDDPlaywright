# Playwright + Cucumber BDD Framework

A small, scenario-scoped BDD framework for SauceDemo. Cucumber is the test
runner, TypeScript contains the step definitions, and Playwright is used only
to automate the browser.

## A. Project architecture

```text
features/          Gherkin behavior specifications
step-definitions/  Cucumber steps that call page-object methods
pages/             UI locators and reusable interactions
hooks/             Scenario setup, failure screenshots, and cleanup
support/           Typed Cucumber World shared by hooks and steps
config/            Environment loading and validated runtime settings
test-runner/       Cucumber CLI launcher and report setup
utils/             Reserved for shared test utilities
reports/           Generated HTML and JSON reports
screenshots/       Screenshots attached for failed scenarios
```

`login.feature` describes two examples in Gherkin, a readable language for
behavior specifications. Each `Given`, `When`, and `Then` sentence is bound to
a TypeScript step definition. Step definitions use the Page Object Model:
`LoginPage` owns selectors and UI actions so they are not duplicated in steps.
The Cucumber World stores one scenario's Playwright objects and page object.

## B. Installation

From this directory:

```sh
npm install
```

## C. Install Playwright browsers

Install the browser used by default:

```sh
npx playwright install chromium
```

To use other supported browsers, install them as well:

```sh
npx playwright install firefox webkit
```

## D. Configure environment files

`TEST_ENV` selects `config/.env.qa` by default, or `config/.env.uat` when set
to `uat`. The QA file is preconfigured with the SauceDemo URL and credentials
provided for this project. Replace the UAT placeholders with your environment's
values. Do not put production secrets in committed files.

Available settings:

| Variable | Description | Default |
|---|---|---|
| `BASE_URL` | Application URL | Defined in the selected env file |
| `USERNAME` / `PASSWORD` | Test credentials | Defined in the selected env file |
| `BROWSER` | `chromium`, `firefox`, or `webkit` | `chromium` |
| `HEADLESS` | `true` or `false` | `true` |
| `STEP_TIMEOUT_MS` | Positive whole-number timeout in milliseconds | `30000` |

Shell-provided variables take precedence over values loaded from dotenv.

PowerShell examples:

```powershell
$env:TEST_ENV = "qa"
npm run test:bdd

$env:TEST_ENV = "uat"
npm run test:bdd
```

## E. Execute all BDD tests

```sh
npm run test:bdd
```

## F. Execute a specific feature

```sh
npm run test:bdd -- features/login.feature
```

## G. Execute a specific scenario or tag

The scenarios are tagged `@smoke` and `@regression`. Run one tag:

```sh
npm run test:bdd -- --tags "@smoke"
npm run test:bdd -- --tags "@regression"
```

Direct Cucumber CLI execution is also configured:

```sh
npx cucumber-js --tags "@smoke"
```

To select scenarios by name:

```sh
npm run test:bdd -- --name "Successful login with valid credentials"
```

## H. Run in headed mode

```sh
npm run test:bdd:headed
```

The runner also accepts `--headed`:

```sh
npm run test:bdd -- --headed
```

## I. Generate the HTML report

Every test run writes both formats:

```text
reports/cucumber-report.html
reports/cucumber-report.json
```

The HTML report contains features, scenarios, step outcomes, duration, and
failure details. A failed scenario's screenshot is embedded as a Cucumber
attachment as well as saved to disk. The explicit report script is:

```sh
npm run test:bdd:html
```

## J. Failure screenshots

The `After` hook checks the Cucumber scenario result. If it failed and a page
exists, the hook saves a full-page PNG in `screenshots/` and attaches its bytes
to the Cucumber report. The hook closes the page, context, and browser in
`finally` blocks so cleanup still happens after a failure.

## K. End-to-end execution flow

1. The runner starts the Cucumber CLI and supplies feature paths, TypeScript
   loading, tags/name filters, and report configuration.
2. Cucumber reads a feature and runs its Gherkin steps in order.
3. Before each scenario, the hook launches the selected Playwright browser,
   creates a scenario-isolated `BrowserContext` and `Page`, then constructs
   `LoginPage`.
4. Cucumber matches each step to a step definition; the step delegates UI work
   to `LoginPage`.
5. Playwright drives the browser against the application. Assertions that
   throw become failed steps and failed scenarios; subsequent scenarios
   continue according to Cucumber's normal behavior.
6. The After hook attaches a screenshot for failures and closes browser
   resources.
7. Cucumber writes the HTML and JSON reports.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```

## Type-check

```sh
npm run typecheck
```
