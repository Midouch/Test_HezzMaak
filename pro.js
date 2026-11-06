/* =====================================================
   HEZ MAAK - AREA PRO (trasportatori e aziende)
   Richiede: app.js (supabaseClient, currentUser, ...) e pro-i18n.js
   Tabelle e funzioni: vedi supabase_area_pro.sql
===================================================== */

/* -----------------------------------------------------
   IMPOSTAZIONI MODIFICABILI
   (prezzi, limiti e contatti per attivare il piano Pro)
----------------------------------------------------- */
const PRO_CONFIG = {
  // Devono coincidere con i limiti scritti nel file SQL.
  limits: { shipments: 20, clients: 50, trips: 10 },

  // Prezzi mostrati nella scheda "Piano" (in euro).
  price: { proMonth: 9.9, proYear: 99 },

  // Dove i trasportatori ti scrivono per attivare Pro.
  // Se li lasci vuoti, appare il messaggio da copiare e inviare all'assistenza.
  contact: {
    whatsapp: "",   // es. "+393331234567"
    email: ""       // es. "pro@tuodominio.it"
  }
};

(function () {
  "use strict";

  const STATUSES = ["registered", "picked_up", "in_transit", "customs", "delivered", "cancelled"];
  const TRIP_STATUSES = ["planned", "departed", "arrived", "cancelled"];
  const LOCALES = { it: "it-IT", en: "en-GB", fr: "fr-FR", tn: "ar-TN-u-nu-latn" };

  const S = {
    account: null,
    clients: [],
    trips: [],
    shipments: [],
    tab: "home",
    q: "",
    fstatus: "",
    cq: "",
    period: "month",
    logoDraft: undefined
  };

  let overlay = null;

  /* =====================================================
     UTILITÀ
  ===================================================== */

  const sb = () => supabaseClient;
  const uid = () => currentUser && currentUser.id;

  function L() {
    return PRO_T[currentLanguage] ? currentLanguage : "it";
  }

  function pt(key, vars) {
    let s = PRO_T[L()][key];
    if (s === undefined) s = PRO_T.it[key];
    if (s === undefined) s = key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        s = s.split("{" + k + "}").join(vars[k]);
      });
    }
    return s;
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function num(v) {
    const n = Number(v);
    return isFinite(n) ? n : 0;
  }

  function money(n, cur) {
    const c = cur || (S.account && S.account.currency) || "EUR";
    try {
      return new Intl.NumberFormat(LOCALES[L()], { style: "currency", currency: c }).format(num(n));
    } catch (e) {
      return num(n).toFixed(2) + " " + c;
    }
  }

  function kgFmt(n) {
    return new Intl.NumberFormat(LOCALES[L()], { maximumFractionDigits: 1 }).format(num(n));
  }

  function parseDay(str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(str || ""));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(str);
  }

  function fmtDate(d, withYear) {
    if (!d) return "";
    const date = typeof d === "string" && d.length <= 10 ? parseDay(d) : new Date(d);
    return date.toLocaleDateString(LOCALES[L()], {
      day: "numeric", month: "short", year: withYear === false ? undefined : "numeric"
    });
  }

  function fmtDateTime(d) {
    return new Date(d).toLocaleString(LOCALES[L()], {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    });
  }

  function ymd(date) {
    const p = n => String(n).padStart(2, "0");
    return date.getFullYear() + "-" + p(date.getMonth() + 1) + "-" + p(date.getDate());
  }

  function cityDisp(raw) {
    if (!raw) return "";
    return typeof cityName === "function" ? cityName(raw) : raw;
  }

  function routeText(a, b) {
    const x = cityDisp(a), y = cityDisp(b);
    if (!x && !y) return "—";
    return (x || "?") + " → " + (y || "?");
  }

  function waNumber(p) {
    let d = String(p || "").replace(/[^\d+]/g, "");
    if (d.startsWith("+")) d = d.slice(1);
    else if (d.startsWith("00")) d = d.slice(2);
    d = d.replace(/\D/g, "");
    return d.length >= 8 ? d : "";
  }

  function waLink(phone, text) {
    const n = waNumber(phone);
    return "https://wa.me/" + (n || "") + "?text=" + encodeURIComponent(text);
  }

  function trackUrl(code) {
    const u = new URL("tracking.html", window.location.href);
    u.search = "";
    u.hash = "";
    u.searchParams.set("c", code);
    return u.href;
  }

  function toast(msg) {
    if (typeof showToast === "function") showToast(msg);
    else alert(msg);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e2) { /* niente */ }
      ta.remove();
    }
    toast(pt("copied"));
  }

  function errMessage(e) {
    const m = String((e && (e.message || e.details)) || e || "");
    if (m.includes("LIMIT_SHIPMENTS")) return pt("limShip", { n: PRO_CONFIG.limits.shipments });
    if (m.includes("LIMIT_CLIENTS")) return pt("limClients", { n: PRO_CONFIG.limits.clients });
    if (m.includes("LIMIT_TRIPS")) return pt("limTrips", { n: PRO_CONFIG.limits.trips });
    if ((e && (e.code === "42P01" || e.code === "PGRST205" || e.code === "PGRST202")) ||
        /does not exist|schema cache|Could not find/i.test(m)) {
      console.error("[Area Pro] Tabelle mancanti: esegui supabase_area_pro.sql su Supabase.", e);
      return pt("errSetup");
    }
    console.error("[Area Pro]", e);
    return pt("errGeneric");
  }

  function isLimitError(e) {
    return /LIMIT_(SHIPMENTS|CLIENTS|TRIPS)/.test(String((e && e.message) || ""));
  }

  /* =====================================================
     PIANO
  ===================================================== */

  function isPaid() {
    const a = S.account;
    return !!a && a.plan !== "free" && (!a.plan_until || new Date(a.plan_until) > new Date());
  }

  function planKey() {
    return isPaid() ? S.account.plan : "free";
  }

  function monthStart() {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function monthShipments() {
    const ms = monthStart();
    return S.shipments.filter(s => new Date(s.created_at) >= ms).length;
  }

  /* =====================================================
     DATI
  ===================================================== */

  async function loadAccount() {
    const { data, error } = await sb().from("pro_accounts").select("*").eq("owner_id", uid()).maybeSingle();
    if (error) throw error;
    S.account = data || null;
  }

  async function loadData() {
    const [c, t, s] = await Promise.all([
      sb().from("pro_clients").select("*").eq("owner_id", uid()).order("name"),
      sb().from("pro_trips").select("*").eq("owner_id", uid()).order("departs_on"),
      sb().from("pro_shipments").select("*").eq("owner_id", uid()).order("created_at", { ascending: false }).limit(1000)
    ]);
    if (c.error) throw c.error;
    if (t.error) throw t.error;
    if (s.error) throw s.error;
    S.clients = c.data || [];
    S.trips = t.data || [];
    S.shipments = (s.data || []).map(x => ({ ...x, price: num(x.price), paid: num(x.paid) }));
  }

  async function reloadShipments() {
    const { data, error } = await sb().from("pro_shipments").select("*").eq("owner_id", uid())
      .order("created_at", { ascending: false }).limit(1000);
    if (error) throw error;
    S.shipments = (data || []).map(x => ({ ...x, price: num(x.price), paid: num(x.paid) }));
  }

  async function reloadClients() {
    const { data, error } = await sb().from("pro_clients").select("*").eq("owner_id", uid()).order("name");
    if (error) throw error;
    S.clients = data || [];
  }

  async function reloadTrips() {
    const { data, error } = await sb().from("pro_trips").select("*").eq("owner_id", uid()).order("departs_on");
    if (error) throw error;
    S.trips = data || [];
  }

  const byId = (arr, id) => arr.find(x => String(x.id) === String(id));
  const isActiveShip = s => s.status !== "delivered" && s.status !== "cancelled";
  const balanceOf = s => Math.max(0, num(s.price) - num(s.paid));

  function tripLoad(trip) {
    return S.shipments
      .filter(s => String(s.trip_id) === String(trip.id) && s.status !== "cancelled")
      .reduce((a, s) => a + num(s.weight_kg), 0);
  }

  function nextTrip() {
    const today = ymd(new Date());
    return S.trips.find(t => t.status === "planned" && t.departs_on >= today) || null;
  }

  /* =====================================================
     APERTURA / CHIUSURA
  ===================================================== */

  async function openPro() {
    if (!currentUser) {
      if (typeof openAuth === "function") openAuth("login");
      return;
    }
    closePro();

    overlay = document.createElement("div");
    overlay.id = "proOverlay";
    overlay.className = "pro-overlay";
    overlay.tabIndex = -1;
    overlay.innerHTML = shellHtml();
    document.body.appendChild(overlay);
    document.body.classList.add("pro-open");

    overlay.addEventListener("click", onClick);
    overlay.addEventListener("submit", onSubmit);
    overlay.addEventListener("change", onChange);
    overlay.addEventListener("input", onInput);
    document.addEventListener("keydown", onKey);

    setBody(`<div class="pro-loading">${esc(pt("loading"))}</div>`);

    try {
      await loadAccount();
      if (!S.account) {
        renderOnboarding();
        return;
      }
      await loadData();
      render();
    } catch (e) {
      setBody(`<div class="pro-empty">${esc(errMessage(e))}</div>`);
    }
  }

  function closePro() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    document.body.classList.remove("pro-open");
    document.removeEventListener("keydown", onKey);
    S.tab = "home";
    S.q = "";
    S.fstatus = "";
    S.cq = "";
  }

  function onKey(e) {
    if (e.key !== "Escape" || !overlay) return;
    if (document.getElementById("proModal")) closeModal();
    else closePro();
  }

  function shellHtml() {
    return `
      <div class="pro-shell">
        <header class="pro-top">
          <div class="pro-brand">
            <strong id="proTitle"></strong>
            <span class="pro-plan-badge" id="proBadge"></span>
          </div>
          <button type="button" class="pro-x" data-act="close" aria-label="${esc(pt("close"))}">×</button>
        </header>
        <div class="pro-tabs" id="proTabs" role="tablist"></div>
        <div class="pro-body" id="proBody"></div>
      </div>`;
  }

  function setBody(html) {
    const b = document.getElementById("proBody");
    if (b) b.innerHTML = html;
  }

  function renderChrome() {
    const title = document.getElementById("proTitle");
    if (title) title.textContent = pt("title");
    const badge = document.getElementById("proBadge");
    if (badge) {
      const k = planKey();
      badge.textContent = pt(k === "pro" ? "planPro" : k === "business" ? "planBusiness" : "planFree");
      badge.className = "pro-plan-badge" + (k !== "free" ? " is-paid" : "");
    }
    const tabs = document.getElementById("proTabs");
    if (tabs) {
      const list = [
        ["home", "tabHome"], ["ship", "tabShip"], ["clients", "tabClients"],
        ["trips", "tabTrips"], ["report", "tabReport"], ["plan", "tabPlan"], ["settings", "tabSettings"]
      ];
      tabs.innerHTML = list.map(([k, label]) =>
        `<button type="button" role="tab" data-act="tab" data-tab="${k}"
           class="pro-tab${S.tab === k ? " is-on" : ""}" aria-selected="${S.tab === k}">${esc(pt(label))}${
           k === "report" && !isPaid() ? ' <span class="pro-lock">🔒</span>' : ""}</button>`
      ).join("");
    }
  }

  function render() {
    if (!overlay) return;
    renderChrome();
    const shell = overlay.querySelector(".pro-shell");
    const top = shell ? shell.scrollTop : 0;
    let html = "";
    try {
      switch (S.tab) {
        case "ship": html = renderShipments(); break;
        case "clients": html = renderClients(); break;
        case "trips": html = renderTrips(); break;
        case "report": html = renderReport(); break;
        case "plan": html = renderPlan(); break;
        case "settings": html = renderSettings(); break;
        default: html = renderHome();
      }
    } catch (e) {
      console.error(e);
      html = `<div class="pro-empty">${esc(pt("errGeneric"))}</div>`;
    }
    setBody(html);
    if (shell) shell.scrollTop = top;
    if (S.tab === "ship") fillShipList();
    if (S.tab === "clients") fillClientList();
  }

  /* =====================================================
     ONBOARDING
  ===================================================== */

  function renderOnboarding() {
    renderChrome();
    const meta = (currentUser && currentUser.user_metadata) || {};
    setBody(`
      <div class="pro-onboard">
        <div class="pro-onboard-ico">🚚</div>
        <h2>${esc(pt("obTitle"))}</h2>
        <p>${esc(pt("obText"))}</p>
        <form data-kind="onboard" class="pro-form">
          ${field(pt("fCompany"), "company_name", meta.full_name || "", "text", "required maxlength=\"80\"")}
          ${field(pt("fPhone"), "phone", "", "tel", "inputmode=\"tel\" maxlength=\"30\"", pt("phoneHint"))}
          <button class="pro-btn pro-btn--primary" type="submit">${esc(pt("obBtn"))}</button>
        </form>
      </div>`);
  }

  /* =====================================================
     COMPONENTI DI FORM
  ===================================================== */

  function field(label, name, value, type, attrs, hint) {
    return `
      <label class="pro-field">
        <span>${esc(label)}</span>
        <input name="${name}" type="${type || "text"}" value="${esc(value == null ? "" : value)}" ${attrs || ""}>
        ${hint ? `<small>${esc(hint)}</small>` : ""}
      </label>`;
  }

  function area(label, name, value, attrs) {
    return `
      <label class="pro-field pro-field--wide">
        <span>${esc(label)}</span>
        <textarea name="${name}" rows="2" ${attrs || ""}>${esc(value == null ? "" : value)}</textarea>
      </label>`;
  }

  function selectField(label, name, options, selected, attrs) {
    return `
      <label class="pro-field">
        <span>${esc(label)}</span>
        <select name="${name}" ${attrs || ""}>
          ${options.map(([v, t]) => `<option value="${esc(v)}"${String(v) === String(selected) ? " selected" : ""}>${esc(t)}</option>`).join("")}
        </select>
      </label>`;
  }

  function readForm(form) {
    const o = {};
    new FormData(form).forEach((v, k) => { o[k] = typeof v === "string" ? v.trim() : v; });
    return o;
  }

  /* =====================================================
     MODALI
  ===================================================== */

  function openModal(title, inner, cls) {
    closeModal();
    const m = document.createElement("div");
    m.id = "proModal";
    m.className = "pro-modal";
    m.innerHTML = `
      <div class="pro-modal-box ${cls || ""}" role="dialog" aria-modal="true">
        <div class="pro-modal-head">
          <h3>${esc(title)}</h3>
          <button type="button" class="pro-x" data-act="closeModal" aria-label="${esc(pt("close"))}">×</button>
        </div>
        <div class="pro-modal-body">${inner}</div>
      </div>`;
    overlay.appendChild(m);
    m.addEventListener("mousedown", e => { if (e.target === m) closeModal(); });
    const first = m.querySelector("input:not([type=hidden]), select, textarea");
    if (first && window.matchMedia("(min-width: 700px)").matches) first.focus();
    return m;
  }

  function closeModal() {
    const m = document.getElementById("proModal");
    if (m) m.remove();
  }

  /* =====================================================
     PANORAMICA
  ===================================================== */

  function pill(status, kind) {
    const key = (kind === "trip" ? "tst_" : "st_") + status;
    return `<span class="pro-pill ${kind === "trip" ? "tst" : "st"}-${esc(status)}">${esc(pt(key))}</span>`;
  }

  function shipRowCompact(s) {
    return `
      <button type="button" class="pro-row" data-act="statusShip" data-id="${esc(s.id)}">
        <span class="pro-row-main">
          <code class="pro-code">${esc(s.code)}</code>
          <span class="pro-row-route">${esc(routeText(s.origin_city, s.dest_city))}</span>
        </span>
        ${pill(s.status)}
      </button>`;
  }

  function renderHome() {
    const a = S.account;
    const ms = monthStart();
    const active = S.shipments.filter(isActiveShip).length;
    const deliveredM = S.shipments.filter(s => s.status === "delivered" && s.delivered_at && new Date(s.delivered_at) >= ms).length;
    const due = S.shipments.filter(s => s.status !== "cancelled").reduce((x, s) => x + balanceOf(s), 0);
    const next = nextTrip();
    const used = monthShipments();
    const max = PRO_CONFIG.limits.shipments;
    const pct = Math.min(100, Math.round(used / max * 100));
    const today = ymd(new Date());
    const upcoming = S.trips.filter(t => t.status === "planned" && t.departs_on >= today).slice(0, 3);

    const usageBlock = isPaid()
      ? `<p class="pro-usage-text">${esc(pt("usageUnl", { n: used }))}</p>`
      : `<div class="pro-usage">
           <div class="pro-usage-text">${esc(pt("usage", { n: used, max }))}</div>
           <div class="pro-bar"><i style="width:${pct}%" class="${pct >= 90 ? "is-hot" : ""}"></i></div>
           <button type="button" class="pro-link" data-act="tab" data-tab="plan">${esc(pt("upgradeInline"))}</button>
         </div>`;

    return `
      <h2 class="pro-h">${esc(pt("hello", { name: a.company_name }))}</h2>

      <div class="pro-stats">
        <div class="pro-stat"><b>${active}</b><span>${esc(pt("statActive"))}</span></div>
        <div class="pro-stat"><b>${deliveredM}</b><span>${esc(pt("statDelivered"))}</span></div>
        <div class="pro-stat"><b>${esc(money(due))}</b><span>${esc(pt("statDue"))}</span></div>
        <div class="pro-stat">
          ${next
            ? `<b class="pro-stat-sm">${esc(fmtDate(next.departs_on, false))}</b>
               <span>${esc(pt("statNext"))} · ${esc(routeText(next.origin_city, next.dest_city))}</span>`
            : `<b class="pro-stat-sm">—</b><span>${esc(pt("noTrip"))}</span>`}
        </div>
      </div>

      <div class="pro-card pro-usage-card">${usageBlock}</div>

      <div class="pro-quick">
        <button type="button" class="pro-btn pro-btn--primary" data-act="newShip">＋ ${esc(pt("newShip"))}</button>
        <button type="button" class="pro-btn" data-act="newClient">＋ ${esc(pt("newClient"))}</button>
        <button type="button" class="pro-btn" data-act="newTrip">＋ ${esc(pt("newTrip"))}</button>
      </div>

      <div class="pro-two">
        <section class="pro-card">
          <div class="pro-card-head">
            <h3>${esc(pt("recentShip"))}</h3>
            <button type="button" class="pro-link" data-act="tab" data-tab="ship">${esc(pt("viewAll"))}</button>
          </div>
          ${S.shipments.length
            ? S.shipments.slice(0, 5).map(shipRowCompact).join("")
            : `<p class="pro-muted">${esc(pt("emptyShip"))}</p>`}
        </section>

        <section class="pro-card">
          <div class="pro-card-head">
            <h3>${esc(pt("upcoming"))}</h3>
            <button type="button" class="pro-link" data-act="tab" data-tab="trips">${esc(pt("viewAll"))}</button>
          </div>
          ${upcoming.length
            ? upcoming.map(t => `
                <div class="pro-row pro-row--static">
                  <span class="pro-row-main">
                    <strong>${esc(routeText(t.origin_city, t.dest_city))}</strong>
                    <span class="pro-muted">${esc(fmtDate(t.departs_on))}${t.capacity_kg ? " · " + esc(pt("loadOf", { used: kgFmt(tripLoad(t)), cap: kgFmt(t.capacity_kg) })) : ""}</span>
                  </span>
                </div>`).join("")
            : `<p class="pro-muted">${esc(pt("emptyTrips"))}</p>`}
        </section>
      </div>`;
  }

  /* =====================================================
     SPEDIZIONI
  ===================================================== */

  function renderShipments() {
    return `
      <div class="pro-toolbar">
        <input type="search" id="proSearch" class="pro-search" placeholder="${esc(pt("search"))}" value="${esc(S.q)}" autocomplete="off">
        <select id="proStatusFilter" class="pro-select">
          <option value="">${esc(pt("all"))}</option>
          ${STATUSES.map(s => `<option value="${s}"${S.fstatus === s ? " selected" : ""}>${esc(pt("st_" + s))}</option>`).join("")}
        </select>
        <button type="button" class="pro-btn pro-btn--primary" data-act="newShip">＋ ${esc(pt("newShip"))}</button>
      </div>
      <div id="proList" class="pro-list"></div>`;
  }

  function shipMatches(s) {
    if (S.fstatus && s.status !== S.fstatus) return false;
    if (!S.q) return true;
    const q = S.q.toLowerCase();
    return [s.code, s.recipient_name, s.sender_name, s.origin_city, s.dest_city, s.description]
      .some(v => String(v || "").toLowerCase().includes(q));
  }

  function shipCard(s) {
    const bal = balanceOf(s);
    const meta = [
      s.recipient_name ? esc(s.recipient_name) : "",
      s.packages ? esc(pt("pkgs", { n: s.packages })) : "",
      s.weight_kg != null && s.weight_kg !== "" ? esc(pt("kg", { n: kgFmt(s.weight_kg) })) : ""
    ].filter(Boolean).join(" · ");
    const locked = isPaid() ? "" : ` <span class="pro-lock" title="${esc(pt("lockedPro"))}">🔒</span>`;
    return `
      <article class="pro-card pro-ship">
        <div class="pro-ship-top">
          <code class="pro-code">${esc(s.code)}</code>
          ${pill(s.status)}
        </div>
        <div class="pro-ship-route">${esc(routeText(s.origin_city, s.dest_city))}</div>
        ${meta ? `<div class="pro-muted">${meta}</div>` : ""}
        ${s.description ? `<div class="pro-muted pro-clip">${esc(s.description)}</div>` : ""}
        <div class="pro-money">
          <span>${esc(money(s.price))}</span>
          ${s.price > 0 ? (bal > 0
            ? `<span class="pro-due">${esc(pt("balance"))}: ${esc(money(bal))}</span>`
            : `<span class="pro-ok">✓ ${esc(pt("settled"))}</span>`) : ""}
        </div>
        <div class="pro-actions">
          <button type="button" class="pro-btn pro-btn--sm pro-btn--primary" data-act="statusShip" data-id="${esc(s.id)}">${esc(pt("statusUpdate"))}</button>
          <button type="button" class="pro-btn pro-btn--sm" data-act="shareShip" data-id="${esc(s.id)}">${esc(pt("share"))}</button>
          <button type="button" class="pro-btn pro-btn--sm" data-act="doc" data-kind="receipt" data-id="${esc(s.id)}">${esc(pt("receipt"))}${locked}</button>
          <button type="button" class="pro-btn pro-btn--sm" data-act="doc" data-kind="quote" data-id="${esc(s.id)}">${esc(pt("quote"))}${locked}</button>
          <button type="button" class="pro-btn pro-btn--sm" data-act="editShip" data-id="${esc(s.id)}">${esc(pt("edit"))}</button>
          <button type="button" class="pro-btn pro-btn--sm pro-btn--danger" data-act="delShip" data-id="${esc(s.id)}" aria-label="${esc(pt("del"))}">🗑</button>
        </div>
      </article>`;
  }

  function fillShipList() {
    const box = document.getElementById("proList");
    if (!box) return;
    const list = S.shipments.filter(shipMatches);
    box.innerHTML = list.length
      ? list.map(shipCard).join("")
      : `<div class="pro-empty">${esc(pt("emptyShip"))}</div>`;
  }

  function shipForm(ship, preset) {
    const s = ship || preset || {};
    const clientOpts = [["", pt("fNoClient")]].concat(S.clients.map(c => [c.id, c.name]));
    const tripOpts = [["", pt("fNoTrip")]].concat(
      S.trips
        .filter(t => t.status === "planned" || t.status === "departed" || String(t.id) === String(s.trip_id))
        .map(t => [t.id, routeText(t.origin_city, t.dest_city) + " · " + fmtDate(t.departs_on, false)])
    );
    return `
      <form data-kind="ship" data-id="${esc(ship ? ship.id : "")}" class="pro-form pro-grid">
        ${selectField(pt("fClient"), "client_id", clientOpts, s.client_id || "")}
        ${selectField(pt("fTrip"), "trip_id", tripOpts, s.trip_id || "")}
        ${field(pt("fSender"), "sender_name", s.sender_name, "text", "maxlength=\"80\"")}
        ${field(pt("fSenderPhone"), "sender_phone", s.sender_phone, "tel", "inputmode=\"tel\" maxlength=\"30\"")}
        ${field(pt("fRecipient"), "recipient_name", s.recipient_name, "text", "required maxlength=\"80\"")}
        ${field(pt("fRecipientPhone"), "recipient_phone", s.recipient_phone, "tel", "inputmode=\"tel\" maxlength=\"30\"")}
        ${field(pt("fFrom"), "origin_city", s.origin_city, "text", "list=\"cityList\" maxlength=\"60\" autocomplete=\"off\"")}
        ${field(pt("fTo"), "dest_city", s.dest_city, "text", "list=\"cityList\" maxlength=\"60\" autocomplete=\"off\"")}
        ${area(pt("fDesc"), "description", s.description, "maxlength=\"300\"")}
        ${field(pt("fPackages"), "packages", s.packages == null ? 1 : s.packages, "number", "min=\"0\" step=\"1\"")}
        ${field(pt("fWeight"), "weight_kg", s.weight_kg == null ? "" : s.weight_kg, "number", "min=\"0\" step=\"0.1\" inputmode=\"decimal\"")}
        ${field(pt("fPrice"), "price", s.price == null ? "" : s.price, "number", "min=\"0\" step=\"0.01\" inputmode=\"decimal\"")}
        ${field(pt("fPaid"), "paid", s.paid == null ? "" : s.paid, "number", "min=\"0\" step=\"0.01\" inputmode=\"decimal\"")}
        ${area(pt("fNotes"), "notes", s.notes, "maxlength=\"500\"")}
        <div class="pro-form-actions">
          <button type="button" class="pro-btn" data-act="closeModal">${esc(pt("cancel"))}</button>
          <button type="submit" class="pro-btn pro-btn--primary">${esc(pt("save"))}</button>
        </div>
      </form>`;
  }

  function ensureCityList() {
    if (typeof refreshCityList === "function") refreshCityList();
  }

  function openShipForm(ship, preset) {
    openModal(ship ? pt("editShip") : pt("newShip"), shipForm(ship, preset), "pro-modal-box--wide");
    ensureCityList();
  }

  async function saveShipment(form) {
    const d = readForm(form);
    const id = form.dataset.id;
    const row = {
      client_id: d.client_id || null,
      trip_id: d.trip_id || null,
      sender_name: d.sender_name || null,
      sender_phone: d.sender_phone || null,
      recipient_name: d.recipient_name || null,
      recipient_phone: d.recipient_phone || null,
      origin_city: d.origin_city || null,
      dest_city: d.dest_city || null,
      description: d.description || null,
      packages: Math.max(0, parseInt(d.packages, 10) || 0),
      weight_kg: d.weight_kg === "" ? null : Math.max(0, num(d.weight_kg)),
      price: Math.max(0, num(d.price)),
      paid: Math.max(0, num(d.paid)),
      notes: d.notes || null
    };
    if (id) {
      const { error } = await sb().from("pro_shipments").update(row).eq("id", id).eq("owner_id", uid());
      if (error) throw error;
      closeModal();
      await reloadShipments();
      render();
      toast(pt("saved"));
    } else {
      const { data, error } = await sb().from("pro_shipments")
        .insert({ ...row, owner_id: uid() }).select("*").single();
      if (error) throw error;
      closeModal();
      await reloadShipments();
      render();
      openShare(data, "created");
    }
  }

  /* ---------- Stato ---------- */

  async function openStatus(id) {
    const s = byId(S.shipments, id);
    if (!s) return;
    openModal(pt("statusUpdate") + " · " + s.code, `
      <form data-kind="status" data-id="${esc(s.id)}" class="pro-form">
        <div class="pro-status-grid">
          ${STATUSES.map(st => `
            <label class="pro-status-opt">
              <input type="radio" name="status" value="${st}"${s.status === st ? " checked" : ""}>
              <span class="pro-pill st-${st}">${esc(pt("st_" + st))}</span>
            </label>`).join("")}
        </div>
        ${area(pt("fPublicNote"), "note", "", "maxlength=\"200\"")}
        <div class="pro-form-actions">
          <button type="button" class="pro-btn" data-act="closeModal">${esc(pt("cancel"))}</button>
          <button type="submit" class="pro-btn pro-btn--primary">${esc(pt("save"))}</button>
        </div>
      </form>
      <h4 class="pro-sub">${esc(pt("history"))}</h4>
      <ol class="pro-history" id="proHistory"><li class="pro-muted">${esc(pt("loading"))}</li></ol>`);
    try {
      const { data, error } = await sb().from("pro_shipment_events").select("*")
        .eq("shipment_id", s.id).order("created_at", { ascending: false });
      if (error) throw error;
      const ol = document.getElementById("proHistory");
      if (ol) {
        ol.innerHTML = (data || []).map(ev => `
          <li>
            <span class="pro-pill st-${esc(ev.status)}">${esc(pt("st_" + ev.status))}</span>
            <span class="pro-muted">${esc(fmtDateTime(ev.created_at))}</span>
            ${ev.note ? `<div>${esc(ev.note)}</div>` : ""}
          </li>`).join("") || "";
      }
    } catch (e) {
      const ol = document.getElementById("proHistory");
      if (ol) ol.innerHTML = "";
    }
  }

  async function saveStatus(form) {
    const d = readForm(form);
    const id = form.dataset.id;
    if (!d.status) return;
    const { error } = await sb().rpc("pro_set_status", {
      p_shipment: id, p_status: d.status, p_note: d.note || null
    });
    if (error) throw error;
    closeModal();
    await reloadShipments();
    render();
    toast(pt("statusSaved"));
    const s = byId(S.shipments, id);
    if (s && s.status !== "cancelled") openShare(s, "status");
  }

  /* ---------- Condividi / WhatsApp ---------- */

  function shipMessage(s, who, kind) {
    const name = (who === "sender" ? s.sender_name : s.recipient_name) || "";
    const url = trackUrl(s.code);
    const text = kind === "created"
      ? pt("wa_created", { name, code: s.code, url })
      : pt("wa_status", { name, code: s.code, status: pt("st_" + s.status), url });
    return text.replace(/\s+([!,.:])/g, "$1").replace(/\s{2,}/g, " ");
  }

  function openShare(s, kind) {
    const url = trackUrl(s.code);
    const title = kind === "created" ? pt("createdTitle") : pt("shareTitle");
    openModal(title, `
      ${kind === "created" ? `<p class="pro-muted">${esc(pt("createdText"))}</p>` : ""}
      <div class="pro-share-code">${esc(s.code)}</div>
      <label class="pro-field pro-field--wide">
        <span>${esc(pt("trackLink"))}</span>
        <div class="pro-copyrow">
          <input readonly value="${esc(url)}" onclick="this.select()">
          <button type="button" class="pro-btn pro-btn--sm" data-act="copy" data-copy="${esc(url)}">${esc(pt("copyLink"))}</button>
        </div>
      </label>
      <div class="pro-share-actions">
        <a class="pro-btn pro-btn--wa" target="_blank" rel="noopener"
           href="${esc(waLink(s.sender_phone, shipMessage(s, "sender", kind)))}">💬 ${esc(pt("waSender"))}</a>
        <a class="pro-btn pro-btn--wa" target="_blank" rel="noopener"
           href="${esc(waLink(s.recipient_phone, shipMessage(s, "recipient", kind)))}">💬 ${esc(pt("waRecipient"))}</a>
        <a class="pro-btn" target="_blank" rel="noopener" href="${esc(url)}">${esc(pt("openTrack"))}</a>
      </div>`);
  }

  /* ---------- Eliminazione ---------- */

  async function deleteRow(table, id, reload) {
    if (!confirm(pt("confirmDel"))) return;
    const { error } = await sb().from(table).delete().eq("id", id).eq("owner_id", uid());
    if (error) throw error;
    await reload();
    if (table === "pro_trips" || table === "pro_clients") await reloadShipments();
    render();
    toast(pt("deleted"));
  }

  /* =====================================================
     CLIENTI
  ===================================================== */

  function renderClients() {
    return `
      <div class="pro-toolbar">
        <input type="search" id="proClientSearch" class="pro-search" placeholder="${esc(pt("search"))}" value="${esc(S.cq)}" autocomplete="off">
        <button type="button" class="pro-btn pro-btn--primary" data-act="newClient">＋ ${esc(pt("newClient"))}</button>
      </div>
      <div id="proList" class="pro-list"></div>`;
  }

  function clientCard(c) {
    const ships = S.shipments.filter(s => String(s.client_id) === String(c.id));
    const due = ships.filter(s => s.status !== "cancelled").reduce((a, s) => a + balanceOf(s), 0);
    return `
      <article class="pro-card pro-client">
        <div class="pro-ship-top">
          <strong>${esc(c.name)}</strong>
          <span class="pro-muted">${esc(pt("cShips", { n: ships.length }))}</span>
        </div>
        <div class="pro-muted">${[c.phone, cityDisp(c.city)].filter(Boolean).map(esc).join(" · ")}</div>
        ${c.notes ? `<div class="pro-muted pro-clip">${esc(c.notes)}</div>` : ""}
        ${due > 0 ? `<div class="pro-due">${esc(pt("cDue", { amount: money(due) }))}</div>` : ""}
        <div class="pro-actions">
          <button type="button" class="pro-btn pro-btn--sm pro-btn--primary" data-act="clientShip" data-id="${esc(c.id)}">${esc(pt("addShip"))}</button>
          ${c.phone ? `<a class="pro-btn pro-btn--sm pro-btn--wa" target="_blank" rel="noopener" href="${esc(waLink(c.phone, ""))}">💬</a>` : ""}
          <button type="button" class="pro-btn pro-btn--sm" data-act="editClient" data-id="${esc(c.id)}">${esc(pt("edit"))}</button>
          <button type="button" class="pro-btn pro-btn--sm pro-btn--danger" data-act="delClient" data-id="${esc(c.id)}" aria-label="${esc(pt("del"))}">🗑</button>
        </div>
      </article>`;
  }

  function fillClientList() {
    const box = document.getElementById("proList");
    if (!box) return;
    const q = S.cq.toLowerCase();
    const list = S.clients.filter(c => !q ||
      [c.name, c.phone, c.city, c.notes].some(v => String(v || "").toLowerCase().includes(q)));
    box.innerHTML = list.length
      ? list.map(clientCard).join("")
      : `<div class="pro-empty">${esc(pt("emptyClients"))}</div>`;
  }

  function openClientForm(c) {
    openModal(c ? pt("editClient") : pt("newClient"), `
      <form data-kind="client" data-id="${esc(c ? c.id : "")}" class="pro-form pro-grid">
        ${field(pt("fName"), "name", c && c.name, "text", "required maxlength=\"80\"")}
        ${field(pt("fPhone"), "phone", c && c.phone, "tel", "inputmode=\"tel\" maxlength=\"30\"")}
        ${field(pt("fCity"), "city", c && c.city, "text", "list=\"cityList\" maxlength=\"60\" autocomplete=\"off\"")}
        ${area(pt("fNotes"), "notes", c && c.notes, "maxlength=\"500\"")}
        <div class="pro-form-actions">
          <button type="button" class="pro-btn" data-act="closeModal">${esc(pt("cancel"))}</button>
          <button type="submit" class="pro-btn pro-btn--primary">${esc(pt("save"))}</button>
        </div>
      </form>`);
    ensureCityList();
  }

  async function saveClient(form) {
    const d = readForm(form);
    const row = { name: d.name, phone: d.phone || null, city: d.city || null, notes: d.notes || null };
    if (form.dataset.id) {
      const { error } = await sb().from("pro_clients").update(row).eq("id", form.dataset.id).eq("owner_id", uid());
      if (error) throw error;
    } else {
      const { error } = await sb().from("pro_clients").insert({ ...row, owner_id: uid() });
      if (error) throw error;
    }
    closeModal();
    await reloadClients();
    render();
    toast(pt("saved"));
  }

  /* =====================================================
     PARTENZE
  ===================================================== */

  function renderTrips() {
    const today = ymd(new Date());
    const upcoming = S.trips.filter(t => t.status === "planned" || t.status === "departed")
      .sort((a, b) => a.departs_on.localeCompare(b.departs_on));
    const past = S.trips.filter(t => t.status === "arrived" || t.status === "cancelled")
      .sort((a, b) => b.departs_on.localeCompare(a.departs_on));
    return `
      <div class="pro-toolbar">
        <span></span>
        <button type="button" class="pro-btn pro-btn--primary" data-act="newTrip">＋ ${esc(pt("newTrip"))}</button>
      </div>
      <div class="pro-list">
        ${upcoming.length ? upcoming.map(t => tripCard(t, today)).join("") : `<div class="pro-empty">${esc(pt("emptyTrips"))}</div>`}
        ${past.length ? `<h4 class="pro-sub">${esc(pt("tst_arrived"))} / ${esc(pt("tst_cancelled"))}</h4>` + past.map(t => tripCard(t, today)).join("") : ""}
      </div>`;
  }

  function tripCard(t, today) {
    const load = tripLoad(t);
    const cap = num(t.capacity_kg);
    const pct = cap ? Math.min(100, Math.round(load / cap * 100)) : 0;
    const count = S.shipments.filter(s => String(s.trip_id) === String(t.id) && s.status !== "cancelled").length;
    const rec = t.recurring ? ` · 🔁 ${esc(pt({ weekly: "recWeekly", biweekly: "recBiweekly", monthly: "recMonthly" }[t.recurring]))}` : "";
    return `
      <article class="pro-card pro-trip">
        <div class="pro-ship-top">
          <strong>${esc(routeText(t.origin_city, t.dest_city))}</strong>
          ${pill(t.status, "trip")}
        </div>
        <div class="pro-muted">${esc(fmtDate(t.departs_on))}${t.vehicle ? " · " + esc(t.vehicle) : ""}${rec}</div>
        ${cap ? `
          <div class="pro-load">
            <div class="pro-bar"><i style="width:${pct}%" class="${pct >= 90 ? "is-hot" : ""}"></i></div>
            <span class="pro-muted">${esc(pt("load"))}: ${esc(pt("loadOf", { used: kgFmt(load), cap: kgFmt(cap) }))} · ${esc(pt("cShips", { n: count }))}</span>
          </div>` : `<div class="pro-muted">${esc(pt("cShips", { n: count }))}</div>`}
        ${t.notes ? `<div class="pro-muted pro-clip">${esc(t.notes)}</div>` : ""}
        <div class="pro-actions">
          ${t.status === "planned" ? `<button type="button" class="pro-btn pro-btn--sm pro-btn--primary" data-act="tripDeparted" data-id="${esc(t.id)}">${esc(pt("markDeparted"))}</button>` : ""}
          ${t.status === "departed" ? `<button type="button" class="pro-btn pro-btn--sm pro-btn--primary" data-act="tripArrived" data-id="${esc(t.id)}">${esc(pt("markArrived"))}</button>` : ""}
          ${(t.status === "planned" || t.status === "departed") ? `<button type="button" class="pro-btn pro-btn--sm" data-act="tripAddShip" data-id="${esc(t.id)}">${esc(pt("addShip"))}</button>` : ""}
          <button type="button" class="pro-btn pro-btn--sm" data-act="tripNext" data-id="${esc(t.id)}">${esc(pt("nextOne"))}</button>
          <button type="button" class="pro-btn pro-btn--sm" data-act="editTrip" data-id="${esc(t.id)}">${esc(pt("edit"))}</button>
          <button type="button" class="pro-btn pro-btn--sm pro-btn--danger" data-act="delTrip" data-id="${esc(t.id)}" aria-label="${esc(pt("del"))}">🗑</button>
        </div>
      </article>`;
  }

  function openTripForm(t) {
    const x = t || {};
    openModal(t ? pt("editTrip") : pt("newTrip"), `
      <form data-kind="trip" data-id="${esc(t ? t.id : "")}" class="pro-form pro-grid">
        ${field(pt("fFrom"), "origin_city", x.origin_city, "text", "required list=\"cityList\" maxlength=\"60\" autocomplete=\"off\"")}
        ${field(pt("fTo"), "dest_city", x.dest_city, "text", "required list=\"cityList\" maxlength=\"60\" autocomplete=\"off\"")}
        ${field(pt("fDate"), "departs_on", x.departs_on || ymd(new Date()), "date", "required")}
        ${field(pt("fCapacity"), "capacity_kg", x.capacity_kg == null ? "" : x.capacity_kg, "number", "min=\"0\" step=\"1\" inputmode=\"numeric\"")}
        ${field(pt("fVehicle"), "vehicle", x.vehicle, "text", "maxlength=\"60\"")}
        ${selectField(pt("fRecurring"), "recurring", [
          ["", pt("recNone")], ["weekly", pt("recWeekly")], ["biweekly", pt("recBiweekly")], ["monthly", pt("recMonthly")]
        ], x.recurring || "")}
        ${area(pt("fNotes"), "notes", x.notes, "maxlength=\"500\"")}
        <div class="pro-form-actions">
          <button type="button" class="pro-btn" data-act="closeModal">${esc(pt("cancel"))}</button>
          <button type="submit" class="pro-btn pro-btn--primary">${esc(pt("save"))}</button>
        </div>
      </form>`);
    ensureCityList();
  }

  async function saveTrip(form) {
    const d = readForm(form);
    const row = {
      origin_city: d.origin_city,
      dest_city: d.dest_city,
      departs_on: d.departs_on,
      capacity_kg: d.capacity_kg === "" ? null : Math.max(0, num(d.capacity_kg)),
      vehicle: d.vehicle || null,
      recurring: d.recurring || null,
      notes: d.notes || null
    };
    if (form.dataset.id) {
      const { error } = await sb().from("pro_trips").update(row).eq("id", form.dataset.id).eq("owner_id", uid());
      if (error) throw error;
    } else {
      const { error } = await sb().from("pro_trips").insert({ ...row, owner_id: uid() });
      if (error) throw error;
    }
    closeModal();
    await reloadTrips();
    render();
    toast(pt("saved"));
  }

  async function setTripStatus(id, status) {
    const { error } = await sb().from("pro_trips").update({ status }).eq("id", id).eq("owner_id", uid());
    if (error) throw error;

    if (status === "departed") {
      const linked = S.shipments.filter(s =>
        String(s.trip_id) === String(id) && (s.status === "registered" || s.status === "picked_up"));
      if (linked.length && confirm(pt("askBulk", { n: linked.length }))) {
        await Promise.all(linked.map(s =>
          sb().rpc("pro_set_status", { p_shipment: s.id, p_status: "in_transit", p_note: null })
        ));
        await reloadShipments();
      }
    }
    await reloadTrips();
    render();
  }

  async function createNextTrip(t) {
    const d = parseDay(t.departs_on);
    if (t.recurring === "monthly") d.setMonth(d.getMonth() + 1);
    else d.setDate(d.getDate() + (t.recurring === "biweekly" ? 14 : 7));
    const { error } = await sb().from("pro_trips").insert({
      owner_id: uid(),
      origin_city: t.origin_city, origin_country: t.origin_country || null,
      dest_city: t.dest_city, dest_country: t.dest_country || null,
      departs_on: ymd(d),
      capacity_kg: t.capacity_kg, vehicle: t.vehicle, recurring: t.recurring, notes: t.notes
    });
    if (error) throw error;
    await reloadTrips();
    render();
    toast(pt("nextCreated"));
  }

  /* =====================================================
     REPORT (Pro)
  ===================================================== */

  function periodStart() {
    const now = new Date();
    if (S.period === "month") return monthStart();
    if (S.period === "3m") { const d = new Date(now); d.setMonth(d.getMonth() - 3); return d; }
    if (S.period === "year") return new Date(now.getFullYear(), 0, 1);
    return new Date(0);
  }

  function renderReport() {
    if (!isPaid()) {
      return `
        <div class="pro-locked">
          <div class="pro-onboard-ico">📊</div>
          <h2>${esc(pt("repLocked"))}</h2>
          <p>${esc(pt("repLockedText"))}</p>
          <button type="button" class="pro-btn pro-btn--primary" data-act="upgrade">${esc(pt("activate"))}</button>
        </div>`;
    }
    const from = periodStart();
    const rows = S.shipments.filter(s => s.status !== "cancelled" && new Date(s.created_at) >= from);
    const revenue = rows.reduce((a, s) => a + s.price, 0);
    const collected = rows.reduce((a, s) => a + Math.min(s.paid, s.price || s.paid), 0);
    const kg = rows.reduce((a, s) => a + num(s.weight_kg), 0);

    const routes = {};
    rows.forEach(s => {
      const k = routeText(s.origin_city, s.dest_city);
      routes[k] = routes[k] || { n: 0, kg: 0, rev: 0 };
      routes[k].n++; routes[k].kg += num(s.weight_kg); routes[k].rev += s.price;
    });
    const routeList = Object.entries(routes).sort((a, b) => b[1].rev - a[1].rev).slice(0, 8);

    const perClient = {};
    rows.forEach(s => {
      const c = byId(S.clients, s.client_id);
      const k = c ? c.name : (s.sender_name || "");
      if (!k) return;
      perClient[k] = perClient[k] || { n: 0, rev: 0 };
      perClient[k].n++; perClient[k].rev += s.price;
    });
    const clientList = Object.entries(perClient).sort((a, b) => b[1].rev - a[1].rev).slice(0, 5);

    const unpaid = S.shipments.filter(s => s.status !== "cancelled" && balanceOf(s) > 0)
      .sort((a, b) => balanceOf(b) - balanceOf(a)).slice(0, 10);

    return `
      <div class="pro-toolbar">
        <select id="proPeriod" class="pro-select">
          ${["month", "3m", "year", "all"].map(p => `<option value="${p}"${S.period === p ? " selected" : ""}>${esc(pt("per_" + p))}</option>`).join("")}
        </select>
      </div>
      <div class="pro-stats">
        <div class="pro-stat"><b>${esc(money(revenue))}</b><span>${esc(pt("repRevenue"))}</span></div>
        <div class="pro-stat"><b>${esc(money(collected))}</b><span>${esc(pt("repCollected"))}</span></div>
        <div class="pro-stat"><b>${esc(kgFmt(kg))}</b><span>${esc(pt("repKg"))}</span></div>
        <div class="pro-stat"><b>${rows.length}</b><span>${esc(pt("repCount"))}</span></div>
      </div>
      <div class="pro-two">
        <section class="pro-card">
          <h3>${esc(pt("repRoutes"))}</h3>
          ${routeList.length ? routeList.map(([k, v]) => `
            <div class="pro-row pro-row--static">
              <span class="pro-row-main"><strong>${esc(k)}</strong>
                <span class="pro-muted">${esc(pt("cShips", { n: v.n }))} · ${esc(pt("kg", { n: kgFmt(v.kg) }))}</span></span>
              <b>${esc(money(v.rev))}</b>
            </div>`).join("") : `<p class="pro-muted">${esc(pt("repNone"))}</p>`}
        </section>
        <section class="pro-card">
          <h3>${esc(pt("repTopClients"))}</h3>
          ${clientList.length ? clientList.map(([k, v]) => `
            <div class="pro-row pro-row--static">
              <span class="pro-row-main"><strong>${esc(k)}</strong>
                <span class="pro-muted">${esc(pt("cShips", { n: v.n }))}</span></span>
              <b>${esc(money(v.rev))}</b>
            </div>`).join("") : `<p class="pro-muted">${esc(pt("repNone"))}</p>`}
        </section>
      </div>
      <section class="pro-card">
        <h3>${esc(pt("repUnpaid"))}</h3>
        ${unpaid.length ? unpaid.map(s => {
          const who = s.sender_name || s.recipient_name || "";
          const phone = s.sender_phone || s.recipient_phone || "";
          const msg = pt("wa_remind", { name: who, amount: money(balanceOf(s)), code: s.code }).replace(/\s+([!,.:])/g, "$1");
          return `
            <div class="pro-row pro-row--static">
              <span class="pro-row-main"><code class="pro-code">${esc(s.code)}</code>
                <span class="pro-muted">${esc(who)}</span></span>
              <span class="pro-row-end">
                <b class="pro-due">${esc(money(balanceOf(s)))}</b>
                <a class="pro-btn pro-btn--sm pro-btn--wa" target="_blank" rel="noopener" href="${esc(waLink(phone, msg))}">💬 ${esc(pt("remind"))}</a>
              </span>
            </div>`;
        }).join("") : `<p class="pro-muted">${esc(pt("repNone"))}</p>`}
      </section>`;
  }

  /* =====================================================
     PIANO
  ===================================================== */

  function renderPlan() {
    const a = S.account;
    const paid = isPaid();
    const expired = a.plan !== "free" && !paid;
    const eur = n => new Intl.NumberFormat(LOCALES[L()], { style: "currency", currency: "EUR" }).format(n);
    const ul = keys => `<ul class="pro-feat">${keys.map(k => `<li>${esc(pt(k))}</li>`).join("")}</ul>`;
    const used = monthShipments();

    return `
      <h2 class="pro-h">${esc(pt("planTitle"))}</h2>
      ${expired ? `<div class="pro-note">${esc(pt("proExpired"))}</div>` : ""}
      ${paid && a.plan_until ? `<div class="pro-note pro-note--ok">${esc(pt("proUntil", { date: fmtDate(a.plan_until) }))}</div>` : ""}
      <div class="pro-plans">
        <section class="pro-card pro-plan${!paid ? " is-current" : ""}">
          <h3>${esc(pt("planFree"))}</h3>
          <div class="pro-price">${esc(eur(0))}</div>
          ${ul(["fFree1", "fFree2", "fFree3", "fFree4", "fFree5", "fFree6"])}
          ${!paid ? `<div class="pro-plan-foot"><span class="pro-tag">${esc(pt("current"))}</span>
            <small class="pro-muted">${esc(pt("usage", { n: used, max: PRO_CONFIG.limits.shipments }))}</small></div>` : ""}
        </section>

        <section class="pro-card pro-plan pro-plan--pro${paid && a.plan === "pro" ? " is-current" : ""}">
          <h3>${esc(pt("planPro"))}</h3>
          <div class="pro-price">${esc(pt("perMonth", { price: eur(PRO_CONFIG.price.proMonth) }))}</div>
          <small class="pro-muted">${esc(pt("orYear", { price: eur(PRO_CONFIG.price.proYear) }))}</small>
          <p class="pro-feat-intro">${esc(pt("fPro0"))}</p>
          ${ul(["fPro1", "fPro2", "fPro3"])}
          <div class="pro-plan-foot">
            ${paid && a.plan === "pro"
              ? `<span class="pro-tag">${esc(pt("current"))}</span>`
              : `<button type="button" class="pro-btn pro-btn--primary" data-act="upgrade">${esc(pt("activate"))}</button>`}
          </div>
        </section>

        <section class="pro-card pro-plan pro-plan--soon">
          <h3>${esc(pt("planBusiness"))} <span class="pro-tag">${esc(pt("soon"))}</span></h3>
          <p class="pro-feat-intro">${esc(pt("fBiz0"))}</p>
          ${ul(["fBiz1", "fBiz2"])}
        </section>
      </div>
      <p class="pro-muted pro-fineprint">${esc(pt("planNote"))}</p>`;
  }

  function openUpgrade() {
    const email = (currentUser && currentUser.email) || "";
    const msg = pt("wa_plan", { email });
    const c = PRO_CONFIG.contact;
    const wa = waNumber(c.whatsapp);
    const buttons = [];
    if (wa) buttons.push(`<a class="pro-btn pro-btn--wa" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(msg)}">💬 ${esc(pt("upWhats"))}</a>`);
    if (c.email) buttons.push(`<a class="pro-btn" href="mailto:${esc(c.email)}?subject=${encodeURIComponent("Hez Maak Pro")}&body=${encodeURIComponent(msg)}">✉️ ${esc(pt("upEmail"))}</a>`);
    openModal(pt("upTitle"), `
      <p>${esc(pt("upText"))}</p>
      ${buttons.length ? "" : `<p class="pro-muted">${esc(pt("upNoContact"))}</p>`}
      <div class="pro-msgbox">${esc(msg)}</div>
      <div class="pro-share-actions">
        ${buttons.join("")}
        <button type="button" class="pro-btn" data-act="copy" data-copy="${esc(msg)}">${esc(pt("upCopy"))}</button>
      </div>`);
  }

  /* =====================================================
     IMPOSTAZIONI
  ===================================================== */

  function renderSettings() {
    const a = S.account;
    const logo = S.logoDraft !== undefined ? S.logoDraft : a.logo_url;
    return `
      <form data-kind="settings" class="pro-form pro-card">
        <div class="pro-grid">
          ${field(pt("fCompany"), "company_name", a.company_name, "text", "required maxlength=\"80\"")}
          ${field(pt("fPhone"), "phone", a.phone || a.whatsapp, "tel", "inputmode=\"tel\" maxlength=\"30\"", pt("phoneHint"))}
          ${field(pt("fEmail"), "email", a.email, "email", "maxlength=\"100\"")}
          ${field(pt("fVat"), "vat_id", a.vat_id, "text", "maxlength=\"40\"")}
          ${field(pt("fAddress"), "address", a.address, "text", "maxlength=\"160\"")}
          ${selectField(pt("fCurrency"), "currency", [["EUR", "EUR €"], ["TND", "TND د.ت"], ["USD", "USD $"]], a.currency || "EUR")}
          ${area(pt("fReceiptNote"), "receipt_note", a.receipt_note, "maxlength=\"300\"")}
          <div class="pro-field pro-field--wide">
            <span>${esc(pt("fLogo"))}</span>
            <div class="pro-logo-row">
              <div class="pro-logo-prev" id="proLogoPrev">${logo ? `<img src="${esc(logo)}" alt="">` : "—"}</div>
              <input type="file" id="proLogoFile" accept="image/png,image/jpeg,image/webp">
              ${logo ? `<button type="button" class="pro-btn pro-btn--sm" data-act="logoRemove">${esc(pt("logoRemove"))}</button>` : ""}
            </div>
            <small>${esc(pt("logoHint"))}</small>
          </div>
        </div>
        <div class="pro-form-actions">
          <button type="submit" class="pro-btn pro-btn--primary">${esc(pt("save"))}</button>
        </div>
      </form>

      <section class="pro-card">
        <h3>${esc(pt("exportTitle"))}</h3>
        <div class="pro-actions">
          <button type="button" class="pro-btn" data-act="export" data-kind="ship">⬇ ${esc(pt("exportShip"))}</button>
          <button type="button" class="pro-btn" data-act="export" data-kind="clients">⬇ ${esc(pt("exportClients"))}</button>
        </div>
      </section>

      <section class="pro-card pro-danger">
        <h3>${esc(pt("dangerTitle"))}</h3>
        <p class="pro-muted">${esc(pt("deleteWarn"))}</p>
        <button type="button" class="pro-btn pro-btn--danger" data-act="delAll">${esc(pt("deleteAll"))}</button>
      </section>`;
  }

  function resizeLogo(file) {
    return new Promise((resolve, reject) => {
      if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
        reject(new Error("bad image"));
        return;
      }
      const fr = new FileReader();
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 240;
          const sc = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(img.width * sc));
          c.height = Math.max(1, Math.round(img.height * sc));
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/png"));
        };
        img.onerror = reject;
        img.src = fr.result;
      };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  async function saveSettings(form) {
    const d = readForm(form);
    const row = {
      company_name: d.company_name,
      phone: d.phone || null,
      whatsapp: d.phone || null,
      email: d.email || null,
      vat_id: d.vat_id || null,
      address: d.address || null,
      currency: d.currency || "EUR",
      receipt_note: d.receipt_note || null
    };
    if (S.logoDraft !== undefined) row.logo_url = S.logoDraft || null;
    const { error } = await sb().from("pro_accounts").update(row).eq("owner_id", uid());
    if (error) throw error;
    S.logoDraft = undefined;
    await loadAccount();
    render();
    toast(pt("saved"));
  }

  /* ---------- Esporta (CSV) ---------- */

  function csvCell(v) {
    v = v == null ? "" : String(v);
    if (/^[=@]|^[+\-](?![\d\s(])/.test(v)) v = "'" + v;
    return /[";\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }

  function downloadCsv(name, rows) {
    const text = "\ufeff" + rows.map(r => r.map(csvCell).join(";")).join("\r\n");
    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  function exportData(kind) {
    const day = ymd(new Date());
    if (kind === "clients") {
      downloadCsv("hezmaak-clienti-" + day + ".csv", [
        ["name", "phone", "city", "notes", "created_at"]
      ].concat(S.clients.map(c => [c.name, c.phone, c.city, c.notes, c.created_at])));
    } else {
      downloadCsv("hezmaak-spedizioni-" + day + ".csv", [
        ["code", "status", "created_at", "sender", "sender_phone", "recipient", "recipient_phone",
         "origin", "destination", "description", "packages", "weight_kg", "price", "paid", "balance", "notes"]
      ].concat(S.shipments.map(s => [
        s.code, s.status, s.created_at, s.sender_name, s.sender_phone, s.recipient_name, s.recipient_phone,
        s.origin_city, s.dest_city, s.description, s.packages, s.weight_kg, s.price, s.paid, balanceOf(s), s.notes
      ])));
    }
  }

  async function deleteEverything() {
    if (!confirm(pt("deleteAll") + "?")) return;
    if (!confirm(pt("deleteConfirm2"))) return;
    for (const table of ["pro_shipments", "pro_clients", "pro_trips"]) {
      const { error } = await sb().from(table).delete().eq("owner_id", uid());
      if (error) throw error;
    }
    const { error } = await sb().from("pro_accounts").delete().eq("owner_id", uid());
    if (error) throw error;
    S.account = null; S.shipments = []; S.clients = []; S.trips = [];
    toast(pt("deleted"));
    closePro();
  }

  /* =====================================================
     RICEVUTE E PREVENTIVI (PDF dal browser, piano Pro)
  ===================================================== */

  function printDoc(s, kind) {
    if (!isPaid()) {
      openUpgrade();
      return;
    }
    const a = S.account;
    const lang = L();
    const rtl = lang === "tn";
    const title = kind === "quote" ? pt("docQuote") : pt("docReceipt");
    const bal = balanceOf(s);
    const logo = a.logo_url && /^data:image\/(png|jpeg|webp);base64,/.test(a.logo_url) ? a.logo_url : "";
    const row = (k, v) => v ? `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>` : "";
    const fromTxt = [s.sender_name, s.sender_phone].filter(Boolean).join(" · ");
    const toTxt = [s.recipient_name, s.recipient_phone].filter(Boolean).join(" · ");

    const html = `<!DOCTYPE html>
<html lang="${lang === "tn" ? "ar" : lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8">
<title>${esc(title)} ${esc(s.code)}</title>
<style>
  *{box-sizing:border-box}
  body{font-family:system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#0f172a;margin:0;padding:40px;font-size:14px;line-height:1.5}
  .top{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;border-bottom:3px solid #e11d48;padding-bottom:18px;margin-bottom:24px}
  .top img{max-height:72px;max-width:180px}
  .co strong{font-size:20px;display:block}
  .co span{display:block;color:#475569}
  h1{font-size:26px;margin:0 0 4px;color:#e11d48}
  .meta{color:#475569;margin:0 0 20px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th,td{padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:start;vertical-align:top}
  th{width:32%;color:#475569;font-weight:600}
  .tot td,.tot th{font-size:16px;font-weight:700;border-bottom:0}
  .box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:18px}
  .foot{margin-top:28px;color:#64748b;font-size:12px}
  code{font-family:ui-monospace,Menlo,Consolas,monospace}
  @page{size:A4;margin:12mm}
</style></head><body>
  <div class="top">
    <div class="co">
      <strong>${esc(a.company_name)}</strong>
      ${a.address ? `<span>${esc(a.address)}</span>` : ""}
      ${a.phone ? `<span>${esc(a.phone)}</span>` : ""}
      ${a.email ? `<span>${esc(a.email)}</span>` : ""}
      ${a.vat_id ? `<span>${esc(a.vat_id)}</span>` : ""}
    </div>
    ${logo ? `<img src="${logo}" alt="">` : ""}
  </div>
  <h1>${esc(title)}</h1>
  <p class="meta">${esc(pt("docNo"))} <code>${esc(s.code)}</code> · ${esc(pt("docDate"))}: ${esc(fmtDate(new Date()))}</p>
  <table>
    ${row(pt("docFrom"), fromTxt)}
    ${row(pt("docTo"), toTxt)}
    ${row(pt("docRoute"), routeText(s.origin_city, s.dest_city))}
    ${row(pt("docContent"), s.description)}
    ${row(pt("docPackages"), s.packages)}
    ${s.weight_kg != null && s.weight_kg !== "" ? row(pt("docWeight"), pt("kg", { n: kgFmt(s.weight_kg) })) : ""}
  </table>
  <table>
    <tr class="tot"><th>${esc(pt("docAmount"))}</th><td>${esc(money(s.price))}</td></tr>
    ${kind === "receipt" ? `
      <tr><th>${esc(pt("docPaid"))}</th><td>${esc(money(s.paid))}</td></tr>
      <tr><th>${esc(pt("docBalance"))}</th><td>${esc(money(bal))}</td></tr>` : ""}
  </table>
  <div class="box">${esc(pt("docTrack"))} <code>${esc(trackUrl(s.code))}</code></div>
  ${a.receipt_note ? `<p>${esc(a.receipt_note)}</p>` : ""}
  <p class="foot">${esc(pt("docDisclaimer"))}</p>
  <script>window.onload=function(){setTimeout(function(){window.print()},350)}<\/script>
</body></html>`;

    const w = window.open("", "_blank");
    if (!w) {
      toast(pt("popup"));
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  /* =====================================================
     EVENTI
  ===================================================== */

  const ACTS = {
    close: () => closePro(),
    closeModal: () => closeModal(),
    tab: el => { S.tab = el.dataset.tab; S.logoDraft = undefined; render(); },
    upgrade: () => openUpgrade(),
    copy: el => copyText(el.dataset.copy),

    newShip: () => openShipForm(null),
    editShip: el => openShipForm(byId(S.shipments, el.dataset.id)),
    delShip: el => run(() => deleteRow("pro_shipments", el.dataset.id, reloadShipments)),
    statusShip: el => openStatus(el.dataset.id),
    shareShip: el => { const s = byId(S.shipments, el.dataset.id); if (s) openShare(s, "plain"); },
    doc: el => { const s = byId(S.shipments, el.dataset.id); if (s) printDoc(s, el.dataset.kind); },

    newClient: () => openClientForm(null),
    editClient: el => openClientForm(byId(S.clients, el.dataset.id)),
    delClient: el => run(() => deleteRow("pro_clients", el.dataset.id, reloadClients)),
    clientShip: el => {
      const c = byId(S.clients, el.dataset.id);
      if (c) openShipForm(null, { client_id: c.id, sender_name: c.name, sender_phone: c.phone, origin_city: c.city });
    },

    newTrip: () => openTripForm(null),
    editTrip: el => openTripForm(byId(S.trips, el.dataset.id)),
    delTrip: el => run(() => deleteRow("pro_trips", el.dataset.id, reloadTrips)),
    tripDeparted: el => run(() => setTripStatus(el.dataset.id, "departed")),
    tripArrived: el => run(() => setTripStatus(el.dataset.id, "arrived")),
    tripNext: el => run(() => createNextTrip(byId(S.trips, el.dataset.id))),
    tripAddShip: el => {
      const t = byId(S.trips, el.dataset.id);
      if (t) openShipForm(null, { trip_id: t.id, origin_city: t.origin_city, dest_city: t.dest_city });
    },

    logoRemove: () => {
      S.logoDraft = "";
      const prev = document.getElementById("proLogoPrev");
      if (prev) prev.textContent = "—";
    },
    export: el => exportData(el.dataset.kind),
    delAll: () => run(deleteEverything)
  };

  async function run(fn) {
    try {
      await fn();
    } catch (e) {
      toast(errMessage(e));
      if (isLimitError(e)) closeModal();
    }
  }

  function onClick(e) {
    const el = e.target.closest("[data-act]");
    if (!el || !overlay || !overlay.contains(el)) return;
    const fn = ACTS[el.dataset.act];
    if (fn) {
      if (el.tagName === "A") return;
      fn(el, e);
    }
  }

  async function onSubmit(e) {
    const form = e.target.closest("form[data-kind]");
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    if (btn) btn.disabled = true;
    try {
      switch (form.dataset.kind) {
        case "onboard": await createAccount(form); break;
        case "ship": await saveShipment(form); break;
        case "status": await saveStatus(form); break;
        case "client": await saveClient(form); break;
        case "trip": await saveTrip(form); break;
        case "settings": await saveSettings(form); break;
      }
    } catch (err) {
      toast(errMessage(err));
      if (isLimitError(err)) {
        closeModal();
        if (S.account) { S.tab = "plan"; render(); }
      }
    } finally {
      if (btn && btn.isConnected) btn.disabled = false;
    }
  }

  async function createAccount(form) {
    const d = readForm(form);
    const { error } = await sb().from("pro_accounts").insert({
      owner_id: uid(),
      company_name: d.company_name,
      phone: d.phone || null,
      whatsapp: d.phone || null,
      email: (currentUser && currentUser.email) || null
    });
    if (error) throw error;
    await loadAccount();
    await loadData();
    S.tab = "home";
    render();
  }

  function onChange(e) {
    const t = e.target;
    if (t.id === "proStatusFilter") { S.fstatus = t.value; fillShipList(); return; }
    if (t.id === "proPeriod") { S.period = t.value; render(); return; }
    if (t.id === "proLogoFile") {
      const file = t.files && t.files[0];
      if (!file) return;
      resizeLogo(file).then(url => {
        S.logoDraft = url;
        const prev = document.getElementById("proLogoPrev");
        if (prev) prev.innerHTML = `<img src="${url}" alt="">`;
      }).catch(() => toast(pt("errGeneric")));
      return;
    }
    const form = t.closest && t.closest("form[data-kind=ship]");
    if (!form) return;
    if (t.name === "client_id") {
      const c = byId(S.clients, t.value);
      if (c) {
        if (!form.sender_name.value) form.sender_name.value = c.name || "";
        if (!form.sender_phone.value) form.sender_phone.value = c.phone || "";
        if (!form.origin_city.value && c.city) form.origin_city.value = c.city;
      }
    }
    if (t.name === "trip_id") {
      const tr = byId(S.trips, t.value);
      if (tr) {
        if (!form.origin_city.value) form.origin_city.value = tr.origin_city || "";
        if (!form.dest_city.value) form.dest_city.value = tr.dest_city || "";
      }
    }
  }

  function onInput(e) {
    if (e.target.id === "proSearch") { S.q = e.target.value; fillShipList(); }
    if (e.target.id === "proClientSearch") { S.cq = e.target.value; fillClientList(); }
  }

  /* =====================================================
     COLLEGAMENTI CON IL RESTO DEL SITO
  ===================================================== */

  // Cambio lingua: aggiorna l'Area Pro se è aperta.
  if (typeof applyTranslations === "function") {
    const original = applyTranslations;
    window.applyTranslations = function () {
      original.apply(this, arguments);
      if (overlay) {
        closeModal();
        if (S.account) render(); else renderOnboarding();
      }
    };
  }

  window.openPro = openPro;
  window.closePro = closePro;
})();
