# 🎯 E2E Observability Testing Platform

![Node.js](https://img.shields.io/badge/Node.js-14.x-blue.svg)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)
![API Testing](https://img.shields.io/badge/API-Testing-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![CI](https://github.com/Dag86/e2e-observability-framework/actions/workflows/playwright.yml/badge.svg)

A modular and scalable End-to-End (E2E) testing platform built with **Playwright**, designed for modern software delivery pipelines.  
This project integrates automation, reporting, observability, and CI/CD best practices.

---

## 🚀 Why This Repository Matters

- **Automation First**: Clean, modular Playwright test architecture.
- **Observability Ready**: HTML and JSON reporting for real-time test insights.
- **CI/CD Integrated**: GitHub Actions pipeline for automated test execution.
- **Scalable Design**: Structured for future API testing, visual testing, and dashboard integrations.


---

## 🚀 Tech Stack

- Playwright (TypeScript)
- Node.js
- GitHub Actions (ready for CI/CD)
- Docker-ready for future observability integrations

---

## 🛡️ Test Coverage Overview

This framework covers:

- ✅ End-to-End (E2E) UI automation
- ✅ API health check validation
- ✅ Dynamic reporting into GitHub Actions
- ✅ CI/CD integration with artifact upload
  

--

## 🧪 Test Types

| Suite | Description |
|:---|:---|
| Smoke | Create and complete todo items across multiple test data variants |
| Regression | Delete todo item with hover and dynamic button interaction |
| API | Health check of the Playwright TodoMVC application endpoint |

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
