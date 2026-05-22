/**
 * health.js — Codepro Observability Dashboard renderer
 * Reads data/health.json and populates health.html with score rings,
 * delta badges, and per-probe breakdowns.
 */

(function () {
  "use strict";

  const HEALTH_URL = "data/health.json";
  const STALE_HOURS = 48; // show yellow dot if data older than this

  // ── helpers ──────────────────────────────────────────────────────────────────

  function scoreColor(score) {
    if (score >= 90) return "#4ade80";
    if (score >= 75) return "#818cf8";
    if (score >= 60) return "#facc15";
    return "#f87171";
  }

  function grade(score) {
    if (score >= 90) return "A";
    if (score >= 75) return "B";
    if (score >= 60) return "C";
    return "F";
  }

  function ringDashOffset(score) {
    // circumference of r=31 circle ≈ 194.8
    const circ = 2 * Math.PI * 31;
    return circ - (score / 100) * circ;
  }

  function relativeTime(isoString) {
    const ms = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 2) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  function isStale(isoString) {
    const ms = Date.now() - new Date(isoString).getTime();
    return ms > STALE_HOURS * 3600 * 1000;
  }

  // ── renderers ─────────────────────────────────────────────────────────────

  function renderScoreRing(score) {
    const color = scoreColor(score);
    const circ = 2 * Math.PI * 31;
    const offset = ringDashOffset(score);
    return `
      <div class="score-ring">
        <svg viewBox="0 0 72 72" width="72" height="72">
          <circle class="score-ring-track" cx="36" cy="36" r="31"/>
          <circle class="score-ring-fill"
            cx="36" cy="36" r="31"
            stroke="${color}"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${offset}"
          />
        </svg>
        <span class="score-text" style="color:${color}">${score.toFixed(1)}</span>
      </div>`;
  }

  function renderDelta(delta) {
    if (!delta || delta.score === undefined) return "";
    const sign = delta.score > 0 ? "+" : "";
    const cls =
      delta.score > 0
        ? "delta-up"
        : delta.score < 0
          ? "delta-down"
          : "delta-flat";
    const arrow = delta.score > 0 ? "↑" : delta.score < 0 ? "↓" : "→";
    const vsDate = delta.vs_timestamp
      ? new Date(delta.vs_timestamp).toLocaleDateString()
      : "";
    return `<div class="delta-badge ${cls}">${arrow} ${sign}${delta.score} vs ${vsDate}</div>`;
  }

  function renderProbes(probes) {
    if (!probes || probes.length === 0) return "";
    const rows = probes
      .map((p) => {
        const okClass = p.ok ? "ok-true" : "ok-false";
        const pct = Math.round((p.score_contribution || 0) * 100);
        const valStr =
          p.value !== null && p.value !== undefined
            ? `${p.value} ${p.unit || ""}`.trim()
            : "N/A";
        const icon = p.ok
          ? `<svg class="probe-icon" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`
          : `<svg class="probe-icon" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
        return `<li class="probe-row ${okClass}">
          ${icon}
          <span class="probe-id" title="${p.description || p.id}">${p.id}</span>
          <span class="probe-val">${valStr}</span>
          <span class="probe-score">${pct}%</span>
        </li>`;
      })
      .join("");
    return `<ul class="probe-list">${rows}</ul>`;
  }

  function renderSuiteCard(suiteName, suite) {
    const sc = suite.score || 0;
    const g = grade(sc);
    const repoHint =
      suiteName === "agentic_core"
        ? "1.agentic"
        : suiteName === "aos_explorer"
          ? "90.aOS-Explorer"
          : suiteName;
    const ts = suite.timestamp ? relativeTime(suite.timestamp) : "never";

    return `
      <div class="suite-card">
        <div class="suite-header">
          <div>
            <div class="suite-name">${suiteName.replace(/_/g, " ")}</div>
            <div class="suite-repo">${repoHint}</div>
            <div style="font-size:12px;color:var(--text-tertiary);margin-top:6px">Last run: ${ts}</div>
            ${renderDelta(suite.delta)}
          </div>
          <div>
            ${renderScoreRing(sc)}
            <div class="score-grade" style="color:${scoreColor(sc)}">${g}</div>
          </div>
        </div>
        ${renderProbes(suite.probes)}
      </div>`;
  }

  function renderNoData() {
    const grid = document.getElementById("suites-grid");
    grid.innerHTML = `
      <div class="no-data" style="grid-column:1/-1">
        <div>No benchmark data yet.</div>
        <pre>python 1.agentic/scripts/bench.py run --suite agentic_core
python 1.agentic/scripts/bench.py run --suite aos_explorer --snapshot</pre>
      </div>`;
  }

  // ── main ──────────────────────────────────────────────────────────────────

  async function loadHealth() {
    let health;
    try {
      const res = await fetch(HEALTH_URL + "?_=" + Date.now());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      health = await res.json();
    } catch (err) {
      console.warn("[health.js] Could not load health.json:", err.message);
      renderNoData();
      const badge = document.getElementById("updated-text");
      if (badge) badge.textContent = "No data — run bench.py first";
      return;
    }

    // Updated badge
    const updatedText = document.getElementById("updated-text");
    const freshnessDot = document.getElementById("freshness-dot");
    if (health.updated) {
      const stale = isStale(health.updated);
      updatedText.textContent = `Updated ${relativeTime(health.updated)}`;
      if (stale && freshnessDot) freshnessDot.classList.add("stale");
    } else {
      updatedText.textContent = "Run bench.py to populate";
    }

    const suites = health.suites || {};
    const grid = document.getElementById("suites-grid");

    if (Object.keys(suites).length === 0) {
      renderNoData();
      return;
    }

    grid.innerHTML = Object.entries(suites)
      .map(([name, suite]) => renderSuiteCard(name, suite))
      .join("");
  }

  document.addEventListener("DOMContentLoaded", loadHealth);
})();
