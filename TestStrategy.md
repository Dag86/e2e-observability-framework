# 📋 E2E Observability Testing Strategy

A structured strategy for ensuring scalable, maintainable, and observable end-to-end test automation using Playwright (TypeScript).

---

## 🛠️ Objective

- Validate critical user workflows and backend health early via E2E and API automation.
- Detect functional regressions quickly during development and release cycles.
- Maintain clean, modular, and scalable test architecture.
- Enable rich reporting, observability, and actionable feedback loops in CI/CD environments.

---

## 🧪 Test Types and Scope

| Test Type | Purpose | Examples |
|:---|:---|:---|
| Smoke Tests | Verify that core functionality is operational. | Create todo, complete todo, persistence on reload, active/completed filter |
| Regression Tests | Validate critical edge cases and negative scenarios. | Delete active todo, complete and delete todo, prevent empty submission |
| API Tests | Validate backend availability and basic endpoint health. | Health check of Playwright TodoMVC app |

✅ Focus is on critical path coverage first, then iterative expansion.

---

## 📚 Test Data Strategy

- Test data centralized in `src/constants/test-data.ts`.
- Structured using simple reusable object patterns.
- Data-driven tests validate variations without duplicating code.

---

## 🎯 Selector Strategy

- UI selectors centralized in `src/constants/selectors.ts`.
- Preference order:
  1. `data-testid` (preferred)
  2. Accessibility attributes (e.g., `aria-label`)
  3. Semantic tags only if necessary

✅ One location to update if UI changes.

---

## 🏗️ Page Object Model (POM)

- Encapsulate page-specific behaviors in `src/pages/`.
- Responsibilities include:
  - Navigation
  - Todo creation
  - Todo completion
  - Todo filtering

✅ Tests focus only on workflow logic, not DOM manipulation.

---

## ⚙️ Test Execution Strategy

- Organized into logical suites:
  - `src/tests/smoke/`
  - `src/tests/regression/`
  - `src/tests/api/`
- Cross-browser projects:
  - Chromium
  - Firefox
  - WebKit
- Executable via:
  ```bash
  npm run test:smoke
  npm run test:regression
  npm run test:api
  ```

✅ Scalable and platform-neutral by default.

---

## 🚀 CI/CD Integration Strategy

- Fully integrated with GitHub Actions:
  - `.github/workflows/playwright.yml`
- Reports:
  - HTML (via Playwright)
  - JSON (parsed by Prometheus-compatible metric server)
  - Dynamic summary update via `$GITHUB_STEP_SUMMARY`
- Metrics exported to Prometheus:
  - `playwright_total_tests`
  - `playwright_passed_tests`
  - `playwright_failed_tests`
- Logs exported to Loki via Promtail
- Artifact uploads for every test run

✅ Test feedback embedded directly in pull requests and pipelines.

---

## 📈 Reporting and Observability Strategy

- **Metrics Server** exposed at `http://localhost:9100/metrics`
- **Prometheus** scrapes metrics on test run completion
- **Grafana Dashboards** show:
  - Test volume
  - Pass/fail trends
  - Pass rate thresholds
- **Loki + Promtail** logs shipping from system and test layers
- Optional alerts and visualizations can be configured in Grafana

---

## 📄 Reporting Artifacts

- HTML report generated at `/reports/playwright-reports/`
- JSON report at `/reports/json-reports/`
- GitHub Actions summary output auto-generated

Open latest report locally:

```bash
npx playwright show-report
```

---

## 🛠️ Maintenance Strategy

- All new UI selectors go into `selectors.ts`
- All new data variants go into `test-data.ts`
- All new page behaviors modeled in POM under `pages/`
- All test logic uses `step()` utility helper from `utils/step-helper.ts`
- Clean tagging system enforced (`@smoke`, `@regression`, `@api`)
- All test metrics parsed dynamically from `report.json`
- Tag pass rate breakdowns and thresholds logged to console and GitHub summary

✅ Framework remains modular, observable, and ready for scale.

