// Default CLI configuration also makes `npx cucumber-js --tags @smoke` work.
module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    requireModule: ["ts-node/register"],
    require: ["support/**/*.ts", "pages/**/*.ts", "step-definitions/**/*.ts", "hooks/**/*.ts"],
    format: [
      "progress",
      "html:reports/cucumber-report.html",
      "json:reports/cucumber-report.json"
    ]
  }
};
