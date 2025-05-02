# 🚀 E2E Observability Framework for Playwright

![Node.js](https://img.shields.io/badge/Node.js-20.x-brightgreen)
![Playwright](https://img.shields.io/badge/Playwright-E2E-blueviolet)
![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-orange)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-orange)
![Loki](https://img.shields.io/badge/Loki-Logs-yellowgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![CI](https://github.com/your-username/your-repo-name/actions/workflows/ci.yml/badge.svg)

A production-grade **End-to-End Testing and Observability Framework** combining:

* **Playwright** (Automated E2E Testing)
* **Prometheus** (Metrics Scraping)
* **Grafana** (Dashboard Visualization + Alerts)
* **Loki + Promtail** (Log Aggregation)

Built for scalability, clarity, and real-world CI/CD pipelines.

---

# 📈 Why This Project?

* **Automation First:** Robust E2E UI/API testing with Playwright
* **Observability Live:** Real-time metrics and logs capture with Prometheus, Loki, and Grafana
* **CI/CD Integrated:** GitHub Actions automates testing and artifact publishing

---

# 🔧 Tech Stack

| Layer         | Tools                                                  |
| ------------- | ------------------------------------------------------ |
| Testing       | Playwright (TypeScript)                                |
| Metrics       | Prometheus + Metrics Server (Express.js + prom-client) |
| Visualization | Grafana                                                |
| Logs          | Loki + Promtail                                        |
| CI/CD         | GitHub Actions                                         |
| Runtime       | Node.js 20.x                                           |

---

# 🏫 Project Structure

```plaintext
/ (root)
├── src/
│   ├── config/
│   ├── constants/
│   ├── pages/
│   ├── tests/
│   ├── utils/
│   └── observability/
│       └── metrics-server.ts
├── reports/
│   ├── json-reports/
│   ├── playwright-reports/
├── prometheus/
│   └── prometheus.yml
├── observability/
│   ├── docker-compose.loki.yml
│   ├── promtail-config.yaml
├── .github/
│   └── workflows/
├── package.json
├── README.md
├── TestStrategy.md
└── .gitignore
```

---

# 📊 Reporting and Observability

### ♻️ Test Reports

* **Playwright HTML Report**
* **Playwright JSON Report**

### 🔢 Metrics Observability

* **Total Tests** (`playwright_total_tests`)
* **Passed Tests** (`playwright_passed_tests`)
* **Failed Tests** (`playwright_failed_tests`)

### 🔍 Log Observability

* **Playwright Test Logs** are streamed via Promtail to Loki
* Structured log fields: `status`, `suite`, `title`, `tags[]`, `project`, `duration`
* All logs and metrics visualized in **Grafana Dashboards**

---

# 🏷️ Tagging Strategy

Playwright tests use `@tag` annotations to organize and filter tests across CI, logs, and dashboards. Tags are extracted from both `test.describe()` and `test()` titles via a custom wrapper and included in structured logs.

### 📚 Tag Categories

| Category     | Examples                         | Purpose                            |
| ------------ | -------------------------------- | ---------------------------------- |
| Type         | `@smoke`, `@regression`          | Run groups for CI jobs             |
| Feature Area | `@login`, `@search`, `@cart`     | Feature scope and filtering        |
| Behavior     | `@flaky`, `@slow`, `@quarantine` | Stability and execution visibility |
| Platform     | `@mobile`, `@firefox`            | Environment-specific logic         |
| Priority     | `@critical`, `@normal`           | Risk-based test grouping           |

### ✅ Tagging Guidelines

* Every test should have at least one meaningful tag
* Tags must start with `@` and use lowercase with dashes or underscores
* Suite-level tags are inherited by all child tests
* Do **not** tag implementation details (e.g., `@uses-middleware`)

### 🔍 Usage Examples

```ts
test.describe('@smoke @cart Cart Feature', () => {
  test('@slow adds item to cart', async () => {
    // This test gets: ["@smoke", "@cart", "@slow"]
  });
});
```

Tags appear in both logs (for Loki) and annotations (for filtering or metrics).

---

# ⚖️ Test Coverage

* **UI Flows:**

  * Add Todo
  * Toggle Todo
  * Delete Todo
  * Filter Todos
  * Navigate via URL hash (All, Active, Completed)
* **API Health Checks:**

  * Example or mock API routes if applicable (optional)

---

# ⚙️ Running the Framework

1. Install dependencies

```bash
npm install
```

2. Run all Playwright tests

```bash
npm run test
```

3. Run Playwright tests with different options:

* Debug mode:

```bash
npm run test:debug
```

* Smoke tests:

```bash
npm run test:smoke
```

* Regression tests:

```bash
npm run test:regression
```

* API tests:

```bash
npm run test:api
```

* Run Playwright tests for a specific browser:

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

4. Clean and re-run tests

```bash
npm run test:clean
```

5. Start Metrics Server

```bash
npm run start:metrics-server
```

6. Start Observability Stack (Loki + Promtail)

```bash
cd observability

docker-compose -f docker-compose.loki.yml up -d
```

7. Access Grafana

```plaintext
http://localhost:3000
```

---

# 🌟 Future Enhancements

* Slack/Email Alerts integration in Grafana
* Advanced log filtering for test debugging
* Full Kubernetes deployment support
* Cloud Grafana dashboards for remote observability

---

# 💼 License

MIT License.

Built with ❤️ for real-world scalable test automation and observability setups.
