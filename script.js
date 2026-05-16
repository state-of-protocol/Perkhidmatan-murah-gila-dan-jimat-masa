/**
 * Sentinel-01 Terminal Telemetry Controller
 * ==========================================
 * Architecture: Modular Object-Oriented design with strict separation of concerns.
 * - Subsystem registry holds the 15 architectural modules.
 * - LogGenerator creates deterministic/randomized operational logs.
 * - TerminalLogger manages the DOM container with a fixed size circular buffer.
 * - TelemetryState keeps the micro-billing balance, active jobs, and system counts.
 * - TelemetryEngine orchestrates streaming, state updates, and render cycles.
 *
 * Dependencies: None. Pure vanilla JS. No inline HTML or CSS strings.
 * Hosted on GitHub Pages, targets elements by their IDs (defined in index.html).
 */

// ----------------------------------------------------------------------
// 1. ARCHITECTURE MODULE REGISTRY
// ----------------------------------------------------------------------
const SYSTEM_MODULES = [
  "001-api-microservice",
  "002-data-pipeline",
  "003-web-intelligence",
  "004-document-intelligence",
  "005-communication",
  "006-financial-ops",
  "007-ecommerce",
  "008-content-ops",
  "009-monitoring",
  "010-ai-infra",
  "011-local-malaysia",
  "012-compute-arbitrage",
  "013-data-products",
  "014-compliance",
  "015-marketplace"
];

/**
 * Formats a module ID string into the shorter log notation, e.g. "[006-financial]".
 * @param {string} id - full module identifier like "006-financial-ops"
 * @returns {string} abbreviated label
 */
function formatModule(id) {
  const parts = id.split('-');
  return `[${parts[0]}-${parts[1]}]`;
}

// ----------------------------------------------------------------------
// 2. REAL-TIME MICRO-BILLING STATE MANAGER
// ----------------------------------------------------------------------
class TelemetryState {
  constructor() {
    // Store balance in cents to avoid floating-point drift.
    this.balanceCents = 109992; // RM 1099.92
    this.activeJobs = 4;
    this.systemsRunning = 15;
  }

  /** Deduct a given amount in cents (default 1 cent). */
  deductMicroBilling(amountCents = 1) {
    this.balanceCents = Math.max(0, this.balanceCents - amountCents);
  }

  addJob() {
    this.activeJobs++;
  }

  removeJob() {
    if (this.activeJobs > 0) this.activeJobs--;
  }

  /** Returns the balance formatted as "RM X.XX". */
  get balanceFormatted() {
    return `RM ${(this.balanceCents / 100).toFixed(2)}`;
  }
}

// ----------------------------------------------------------------------
// 3. TERMINAL LOGGER (DOM buffer with auto‑scroll and node limit)
// ----------------------------------------------------------------------
class TerminalLogger {
  /**
   * @param {string} containerId - ID of the DOM element that holds log lines
   * @param {number} maxLines - maximum number of child nodes to keep (prevents memory leaks)
   */
  constructor(containerId, maxLines = 50) {
    this.container = document.getElementById(containerId);
    this.maxLines = maxLines;
    if (!this.container) {
      console.warn(`TerminalLogger: container #${containerId} not found.`);
    }
  }

  /**
   * Appends a plain text log line, enforces the node limit, and auto‑scrolls.
   * @param {string} text - the log message
   */
  addLine(text) {
    if (!this.container) return;

    const line = document.createElement('div');
    line.className = 'log-line'; // styled externally via CSS
    line.textContent = text;
    this.container.appendChild(line);

    // Keep only the most recent `maxLines` entries
    while (this.container.children.length > this.maxLines) {
      this.container.removeChild(this.container.firstChild);
    }

    // Lock viewport at the latest entry
    this.container.scrollTop = this.container.scrollHeight;
  }
}

// ----------------------------------------------------------------------
// 4. DYNAMIC TELEMETRY ENGINE – LOG GENERATOR
// ----------------------------------------------------------------------
class LogGenerator {
  constructor(modules) {
    this.modules = modules;
    this.jobCounter = 100; // mock job ID seed
  }

  /** Picks a random element from an array. */
  _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** Returns a random module from the registry. */
  _randomModule() {
    return this._pick(this.modules);
  }

  /**
   * Generates one operational log entry plus optional state deltas.
   * @returns {{ text: string, balanceDeltaCents: number, jobDelta: number }}
   */
  generate() {
    // Template pool – each function returns a complete log effect.
    const templates = [
      // 001 – API ingestion
      () => {
        const client = `Client_${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 100)}`;
        const key = Math.random().toString(36).substring(2, 10);
        return {
          text: `${formatModule("001-api-microservice")} Ingesting request from ${client} via API Key ${key}`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // 014 – Compliance stealth checks
      () => {
        const status = Math.random() > 0.2 ? "PASSED" : "PENDING";
        return {
          text: `${formatModule("014-compliance")} Running stealth anti-detection checks. Status: ${status}.`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // 003 – Web intelligence with Puppeteer
      () => {
        const ramGuard = Math.random() > 0.3 ? "Active" : "Warning: High Usage";
        return {
          text: `${formatModule("003-web-intelligence")} Invoking Puppeteer Headless Instance pool (RAM Constraint Guard: ${ramGuard}).`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // 007 – E-commerce scraping
      () => {
        const count = Math.floor(Math.random() * 200) + 20;
        const market = this._pick(["local market", "Shopee MY", "Lazada", "Zalora"]);
        return {
          text: `${formatModule("007-ecommerce")} Scraped ${count} trending products from ${market}.`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // 002 – Data pipeline
      () => {
        const action = this._pick([
          "Normalizing and cleaning unstructured data stream.",
          "Transforming data batch (size: 12MB).",
          "Routing processed data to storage nodes."
        ]);
        return {
          text: `${formatModule("002-data-pipeline")} ${action}`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // 006 – Micro-billing cron (the only template that triggers a balance deduction)
      () => {
        const target = this._randomModule();
        this.jobCounter++;
        return {
          text: `${formatModule("006-financial-ops")} Micro-billing cron executed. Deducting RM0.01. Target System: ${formatModule(target)}.`,
          balanceDeltaCents: -1, // 1 cent deduction
          jobDelta: 0
        };
      },

      // 005 – Communication alerts
      () => {
        const msgType = this._pick(["Email notification", "Slack alert", "Webhook dispatch"]);
        const dest = this._pick(["ops-team", "dev-lead", "compliance-officer"]);
        return {
          text: `${formatModule("005-communication")} Sending ${msgType} to ${dest}.`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // 010 – AI infrastructure
      () => {
        const model = this._pick(["GPT-4o", "Claude 3", "LLaMA 3", "Mistral"]);
        return {
          text: `${formatModule("010-ai-infra")} Loading inference model: ${model} (GPU Cluster B).`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // Job start event (increases active jobs)
      () => {
        const mod = this._randomModule();
        this.jobCounter++;
        const jobId = `J${this.jobCounter.toString().padStart(3, '0')}`;
        return {
          text: `${formatModule(mod)} Initiating job ${jobId} for data processing.`,
          balanceDeltaCents: 0,
          jobDelta: 1
        };
      },

      // Job completion event (decreases active jobs)
      () => {
        const mod = this._randomModule();
        const jobId = `J${Math.floor(Math.random() * 200).toString().padStart(3, '0')}`;
        return {
          text: `${formatModule(mod)} Job ${jobId} completed successfully.`,
          balanceDeltaCents: 0,
          jobDelta: -1
        };
      },

      // 012 – Compute arbitrage
      () => {
        const cloud = this._pick(["AWS Spot", "GCP Preemptible", "Azure Low Priority"]);
        const savings = (Math.random() * 30 + 10).toFixed(1);
        return {
          text: `${formatModule("012-compute-arbitrage")} Arbitrage opportunity: shift to ${cloud} saves ${savings}%.`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // 009 – Monitoring telemetry
      () => {
        const metric = this._pick(["CPU usage: 47%", "Memory: 62%", "Network IO: 12MB/s", "Disk latency: 4ms"]);
        return {
          text: `${formatModule("009-monitoring")} System telemetry: ${metric}.`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      },

      // Remaining modules (004, 008, 011, 013, 015) – canonical actions
      () => {
        const mod = this._pick([
          "004-document-intelligence",
          "008-content-ops",
          "011-local-malaysia",
          "013-data-products",
          "015-marketplace"
        ]);
        const actions = {
          "004-document-intelligence": "Extracting entities from PDF batch.",
          "008-content-ops": "Generating multilingual product descriptions.",
          "011-local-malaysia": "Syncing local regulatory compliance data.",
          "013-data-products": "Publishing curated dataset to catalog.",
          "015-marketplace": "Reconciling seller inventory across platforms."
        };
        return {
          text: `${formatModule(mod)} ${actions[mod]}`,
          balanceDeltaCents: 0,
          jobDelta: 0
        };
      }
    ];

    // Pick a random template and execute it
    const templateFn = this._pick(templates);
    return templateFn();
  }
}

// ----------------------------------------------------------------------
// 5. TELEMETRY ENGINE (orchestrator)
// ----------------------------------------------------------------------
class TelemetryEngine {
  constructor() {
    this.state = new TelemetryState();
    this.logger = new TerminalLogger('terminal-logs', 50);
    this.generator = new LogGenerator(SYSTEM_MODULES);
    this.timer = null;

    // Cache DOM display elements
    this.display = {
      balance: document.getElementById('balance-display'),
      jobs: document.getElementById('jobs-display'),
      systems: document.getElementById('systems-display') // optional, but available
    };
  }

  /** Updates the live UI with current state values. */
  refreshDisplay() {
    if (this.display.balance) {
      this.display.balance.textContent = this.state.balanceFormatted;
    }
    if (this.display.jobs) {
      this.display.jobs.textContent = this.state.activeJobs.toString();
    }
    if (this.display.systems) {
      this.display.systems.textContent = this.state.systemsRunning.toString();
    }
  }

  /** Applies a log effect's state mutations. */
  applyEffect(effect) {
    // Micro-billing deduction
    if (effect.balanceDeltaCents !== 0) {
      this.state.deductMicroBilling(Math.abs(effect.balanceDeltaCents));
    }

    // Active jobs delta
    if (effect.jobDelta > 0) {
      for (let i = 0; i < effect.jobDelta; i++) this.state.addJob();
    } else if (effect.jobDelta < 0) {
      for (let i = 0; i < Math.abs(effect.jobDelta); i++) this.state.removeJob();
    }
  }

  /** Core cycle: generate a log, update state, re-render, and schedule next. */
  pushLog() {
    const effect = this.generator.generate();
    this.logger.addLine(effect.text);
    this.applyEffect(effect);
    this.refreshDisplay();
    this.scheduleNext();
  }

  /** Sets a random timer between 1.5 and 2.5 seconds. */
  scheduleNext() {
    const delay = Math.floor(Math.random() * 1000) + 1500; // 1500–2500 ms
    this.timer = setTimeout(() => this.pushLog(), delay);
  }

  /** Starts the streaming loop. */
  start() {
    if (this.timer) return; // already running
    this.refreshDisplay();
    this.pushLog(); // first log immediately
  }

  /** Stops the streaming loop gracefully. */
  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

// ----------------------------------------------------------------------
// 6. BOOTSTRAP ON DOM READY
// ----------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const engine = new TelemetryEngine();
  engine.start();

  // Expose for debugging / manual control if needed
  window.__sentinelTelemetry = engine;
});