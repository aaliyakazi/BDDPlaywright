import { spawnSync } from "node:child_process";
import path from "node:path";
import { mkdir } from "node:fs/promises";

// The runner delegates scenario execution to Cucumber CLI (not Playwright Test).
// Cucumber loads the TypeScript support code and writes HTML/JSON reports.
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const headedFlagIndex = args.indexOf("--headed");
  if (headedFlagIndex >= 0) {
    args.splice(headedFlagIndex, 1);
    process.env.HEADLESS = "false";
  }

  const projectRoot = process.cwd();
  await mkdir(path.join(projectRoot, "reports"), { recursive: true });
  const cucumberCli = path.join(
    projectRoot,
    "node_modules",
    "@cucumber",
    "cucumber",
    "bin",
    "cucumber.js"
  );
  const hasFeaturePath = args.some((argument) => !argument.startsWith("-"));
  const cucumberArguments = [
    cucumberCli,
    "--config",
    "cucumber.js",
    ...(hasFeaturePath ? [] : ["features/**/*.feature"]),
    ...args
  ];

  const result = spawnSync(process.execPath, cucumberArguments, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit"
  });

  if (result.error) {
    throw new Error(`Could not start Cucumber: ${result.error.message}`);
  }
  if (result.signal) {
    throw new Error(`Cucumber was terminated by signal ${result.signal}.`);
  }
  process.exitCode = result.status ?? 1;
}

main().catch((error: unknown) => {
  console.error("BDD runner failed:", error);
  process.exitCode = 1;
});
