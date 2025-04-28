# 🎯 E2E Observability Testing Platform

![Node.js](https://img.shields.io/badge/Node.js-14.x-blue.svg)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![CI](https://github.com/Dag86/e2e-observability-framework/actions/workflows/playwright.yml/badge.svg)


A modular and scalable end-to-end (E2E) test framework built using Playwright (TypeScript).  
Designed to support automation, reporting, and observability in modern web application testing.

---

## 🚀 Tech Stack

- Playwright (TypeScript)
- Node.js
- GitHub Actions (ready for CI/CD)
- Docker-ready for future observability integrations

---

## 🧪 Test Types

| Suite | Description |
|:---|:---|
| Smoke | Create and complete todo items across multiple test data variants |
| Regression | Delete todo item with hover and dynamic button interaction |

✅ Test data is fully abstracted.  
✅ Selectors are fully centralized.

---

## 📂 Project Structure

```bash
src/
├── config/
├── constants/
│   ├── selectors.ts
│   ├── test-data.ts
├── pages/
│   ├── HomePage.ts
├── tests/
│   ├── smoke/
│   │   ├── todo-flow.spec.ts
│   ├── regression/
│   │   ├── delete-todo.spec.ts
reports/
.github/
├── workflows/
│   ├── run-tests.yml (optional later for CI/CD)
playwright.config.ts
package.json
README.md
```

---

## ⚙️ Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm run test
```

### Run Only Smoke Tests

```bash
npx playwright test --grep "@smoke"
```

### Run Only Regression Tests

```bash
npx playwright test --grep "@regression"
```

### Run in Specific Browsers

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### View HTML Report

```bash
npx playwright show-report
```

---

## 📈 Reporting

- All test execution reports are generated under `/reports/`
- JSON reports are available for observability integrations
- HTML reports provide full test execution visibility via Playwright Reporter

---

## 🧠 Future Roadmap (Optional for Expansion)

- Integrate Dockerized Grafana/Prometheus for real-time test observability
- Add API Testing Layer using `playwright.request`
- Parallelize and shard tests across CI/CD pipelines
- Integrate flaky test detection and quarantine system
- Build visual dashboard from test execution trends (for management visibility)

---
