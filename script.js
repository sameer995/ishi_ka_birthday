(function () {
  const C = window.CONFIG;
  const $ = (s) => document.querySelector(s);
  const params = new URLSearchParams(location.search);

  // URL personalisation: ?name=Priya&from=Sameer
  if (params.get("name")) C.name = params.get("name").slice(0, 30);
  if (params.get("from")) C.from = params.get("from").slice(0, 30);

  const target = new Date(C.birthday).getTime();
  const forceParty = params.has("preview") || window.FORCE_PARTY;
  const editMode = params.has("edit") || forceParty;   // tap placeholders to try a photo locally
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  document.querySelectorAll("[data-name]").forEach((e) => (e.textContent = C.name));
  document.querySelectorAll("[data-from]").forEach((e) => (e.textContent = C.from));
  document.title = `Happy Birthday ${C.name} 🎂`;
  try {
    const d = new Date(C.birthday);
    $("#dateText").textContent = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" });
    $("#bibNo").textContent = "No. " + d.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" });
  } catch (e) {}

  // ---------- mountain scene (inline SVG layers, shared by countdown + hero) ----------
  const VB = 'viewBox="0 0 2400 700" preserveAspectRatio="xMidYMax slice"';
  // procedural zig-zag ridge with little snow caps on the tallest peaks
  function ridge(seed, base, amp, step, fill, capFill, capMin, capOp) {
    const r = mulberry(seed), pts = ["0,700"], caps = [];
    for (let x = 0, i = 0; x <= 2400; x += step, i++) {
      const peak = i % 2 === 0;
      const y = Math.round(peak ? base - amp * (0.45 + 0.55 * r()) : base - amp * 0.2 * r());
      pts.push(`${x},${y}`);
      if (peak && capFill && y < base - amp * capMin)
        caps.push(`<polygon fill="${capFill}" opacity="${capOp}" points="${x},${y} ${x - 16},${y + 24} ${x - 5},${y + 18} ${x},${y + 30} ${x + 6},${y + 18} ${x + 17},${y + 24}"/>`);
    }
    pts.push("2400,700");
    return `<polygon fill="${fill}" points="${pts.join(" ")}"/>${caps.join("")}`;
  }
  function trees() {
    const r = mulberry(77); let t = "";
    for (let i = 0; i < 46; i++) { const x = r() * 2400, h = 30 + r() * 32; t += `<polygon points="${x | 0},${650 - h | 0} ${(x - h * .28) | 0},650 ${(x + h * .28) | 0},650"/>`; }
    return `<g fill="#0a1020">${t}</g>`;
  }
  const mountainHTML = `
    <div class="layer" data-speed="0.22"><div class="sun"></div></div>
    <div class="layer" data-speed="0.12"><svg ${VB}>${ridge(11, 430, 170, 110, "#2c3b6e", "#e8eefc", .6, .55)}</svg></div>
    <div class="layer" data-speed="0.07"><svg ${VB}>${ridge(23, 520, 150, 90, "#1f2c57", "#f4f8ff", .55, .7)}</svg></div>
    <div class="layer" data-speed="0.035"><svg ${VB}><g transform="translate(480 0)">
      <polygon fill="#16204a" points="250,700 520,420 620,330 700,230 720,200 745,225 800,300 880,380 1000,480 1190,700"/>
      <polygon fill="#0f1838" points="720,200 745,225 800,300 880,380 1000,480 1190,700 800,700 770,520 740,380"/>
      <polygon fill="#f4f8ff" points="689,258 700,230 720,200 745,225 757,252 738,244 722,264 706,246"/>
      <line x1="720" y1="200" x2="720" y2="150" stroke="#e8eefc" stroke-width="3"/>
      <path class="flag" d="M721 152 L768 163 L721 176 Z" fill="#ff8a3d"/></g></svg></div>
    <div class="layer" data-speed="0"><svg ${VB}>${ridge(5, 640, 40, 140, "#0a1020", null, 0, 0)}${trees()}</svg></div>`;
  document.querySelectorAll("[data-mtn]").forEach((el) => (el.innerHTML = mountainHTML));

  // stars
  const starBox = $("#stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i"); s.className = "star";
    s.style.left = Math.random() * 100 + "%"; s.style.top = Math.random() * 55 + "%";
    s.style.animationDelay = Math.random() * 3 + "s"; s.style.opacity = 0.4 + Math.random() * 0.6;
    starBox.appendChild(s);
  }

  // ---------- cursor sparkles (mouse only) ----------
  let lastSpark = 0;
  function sparkle(x, y) {
    const now = Date.now(); if (now - lastSpark < 70 || reduce) return; lastSpark = now;
    const s = document.createElement("span");
    s.className = "spark"; s.textContent = ["✨", "📈", "⛰️", "🏅"][(Math.random() * 4) | 0];
    s.style.left = x + "px"; s.style.top = y + "px";
    document.body.appendChild(s); setTimeout(() => s.remove(), 900);
  }
  addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") sparkle(e.clientX, e.clientY); });

  // ---------- confetti ----------
  const cv = $("#confetti"), cx = cv.getContext("2d");
  let pieces = [], running = false;
  const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
  addEventListener("resize", resize); resize();
  const colors = ["#ff8a3d", "#ffb26b", "#22c55e", "#f4f8ff", "#4cc9f0", "#facc15"];
  function burst(n = 160) {
    const small = innerWidth < 500; if (small) n = Math.round(n * 0.6);
    for (let i = 0; i < n; i++) pieces.push({
      x: innerWidth / 2 + (Math.random() - .5) * innerWidth * 0.4, y: innerHeight * 0.4,
      vx: (Math.random() - .5) * (small ? 9 : 14), vy: -Math.random() * (small ? 11 : 14) - 4,
      r: Math.random() * 6 + 4, c: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 0
    });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    pieces.forEach((p) => {
      p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
      cx.fillStyle = p.c; cx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6); cx.restore();
    });
    pieces = pieces.filter((p) => p.y < cv.height + 20 && p.life < 300);
    if (pieces.length) requestAnimationFrame(tick); else running = false;
  }

  // ---------- countdown ----------
  const pad = (n) => String(n).padStart(2, "0");
  let timerId, started = false;
  function update() {
    const diff = target - Date.now();
    if (diff <= 0 || forceParty) { startParty(); return; }
    $("#d").textContent = pad(Math.floor(diff / 864e5));
    $("#h").textContent = pad(Math.floor(diff / 36e5) % 24);
    $("#m").textContent = pad(Math.floor(diff / 6e4) % 60);
    $("#s").textContent = pad(Math.floor(diff / 1e3) % 60);
  }

  function startParty() {
    if (started) return; started = true;
    clearInterval(timerId);
    $("#countdown").hidden = true; $("#party").hidden = false;
    window.scrollTo(0, 0);
    build();
    setTimeout(() => burst(220), 600);
  }

  // ---------- helpers ----------
  function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(s) { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); }
  const imgTag = (src, label) => src ? `<img src="${esc(src)}" alt="${esc(label || "")}" loading="lazy">` : "";

  // ---------- build the celebration ----------
  function build() {
    $("#footerText").textContent = C.footer;

    // ticker tape
    const items = (C.ticker || []).map((t) => `<span class="tk ${t.up ? "up" : "dn"}"><b>${esc(t.sym)}</b><span>${t.up ? "▲" : "▼"} ${esc(t.change)}</span></span>`).join("");
    $("#tickerTrack").innerHTML = items + items + items + items;   // 4 copies; track scrolls -50% seamlessly

    // hero title letter by letter
    const title = `Happy Birthday ${C.name}!`;
    $("#heroTitle").innerHTML = title.split(" ").map((w, wi, arr) => {
      const off = arr.slice(0, wi).join(" ").length + (wi ? 1 : 0);
      return `<span class="w">${[...w].map((ch, i) => `<span class="hero-letter" style="animation-delay:${(off + i) * 0.05}s">${esc(ch)}</span>`).join("")}</span>`;
    }).join(" ");
    const chips = [...(C.chips || [])]; if (C.ageTurning) chips.unshift(`🎂 Age ${C.ageTurning}: new high`);
    $("#chips").innerHTML = chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("");

    // hero photo / placeholder
    const hp = $("#heroPhoto");
    if (C.heroPhoto) hp.innerHTML = imgTag(C.heroPhoto, C.name);
    else hp.innerHTML = `<div class="ph empty ${editMode ? "editable" : ""}" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#243764,#3a2a55);font-size:2.4rem">👑<small style="font-size:.7rem;color:#9fb0d3">her photo</small></div>`;
    if (!C.heroPhoto && editMode) hp.style.cursor = "pointer";
    hp.onclick = () => (!C.heroPhoto && editMode) && pickImage((url) => { hp.innerHTML = `<img src="${url}" alt="">`; });

    typeLines(C.typed && C.typed.length ? C.typed : [C.tagline]);

    // candles
    const cw = $("#candles"); let left = 5;
    for (let i = 0; i < 5; i++) {
      const c = document.createElement("div"); c.className = "candle"; c.setAttribute("role", "button"); c.setAttribute("aria-label", "Blow out candle");
      c.onclick = () => {
        if (c.classList.contains("out")) return;
        c.classList.add("out"); left--;
        if (!left) {
          $("#wishText").textContent = C.wishes[(Math.random() * C.wishes.length) | 0];
          $("#cakeHint").textContent = "Your wish is on its way 💫"; burst(200);
        }
      };
      cw.appendChild(c);
    }

    // letter
    $("#letter").innerHTML = C.letter.map((p) => `<p>${esc(p)}</p>`).join("");

    // photo wall
    const hasEmpty = C.photos.some((p) => !p.src);
    $("#photoHint").textContent = hasEmpty && editMode ? "Placeholders: tap one to preview a photo from your device." : "";
    $("#polaroids").innerHTML = C.photos.map((p, i) => {
      const r = ((i % 2 ? 1 : -1) * (1.5 + (i * 1.7) % 3.5)).toFixed(1);
      const inner = p.src ? imgTag(p.src, p.caption) : `📷<small>${editMode ? "tap to add photo" : "photo coming soon"}</small>`;
      return `<figure class="pol" style="--r:${r}deg"><div class="ph ${p.src ? "" : "empty"} ${!p.src && editMode ? "editable" : ""}">${inner}</div><p>${esc(p.caption || "")}</p></figure>`;
    }).join("");
    if (editMode) document.querySelectorAll(".ph.editable").forEach((el) => {
      el.onclick = () => pickImage((url) => { el.className = "ph"; el.innerHTML = `<img src="${url}" alt="">`; });
    });

    // marathon route
    const route = $("#route"), n = C.memories.length;
    const frag = C.memories.map((m, i) => {
      const km = n < 2 ? 0 : (i / (n - 1)) * 42.195;
      const label = m.km || (i === 0 ? "KM 0 · START" : i === n - 1 && n > 1 ? "KM 42.2 · FINISH" : `KM ${km.toFixed(1)}`);
      return `<div class="tl"><span class="pin"></span><div class="km">${esc(label)}</div><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p></div>`;
    }).join("");
    route.insertAdjacentHTML("beforeend", frag);

    buildChart();
    buildHoldings();
    buildWall();

    $("#celebrate").onclick = () => burst(200);
    $("#again").onclick = () => burst(250);

    // scroll reveals
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("show"); if (e.target.id === "chartSec") countUp(); }
    }), { threshold: .12 });
    document.querySelectorAll(".reveal, .tl, .chart-card").forEach((el) => io.observe(el));

    onScroll(); addEventListener("resize", onScroll);
  }

  // ---------- candlestick chart ----------
  let lastClose = 100, countStarted = false;
  function buildChart() {
    const S = C.stock || {};
    $("#sym").textContent = S.symbol || "SIS";
    $("#company").textContent = S.company || "";
    $("#stockNote").textContent = S.note || "";
    $("#stats").innerHTML = (S.stats || []).map((s) => `<div class="stat"><small>${esc(s.label)}</small><b>${esc(s.value)}</b><span>▲ ${esc(s.chg)}</span></div>`).join("");

    const rnd = mulberry(hash(C.name) + 13);
    const N = 26; let price = 100; const cs = [];
    for (let i = 0; i < N; i++) {
      const o = price, drift = 1.7 + i * 0.09, noise = (rnd() - 0.42) * 9;
      let c = o + drift + noise; if (i === N - 1) c = Math.max(c, o + 7);
      cs.push({ o, c, h: Math.max(o, c) + rnd() * 4, l: Math.min(o, c) - rnd() * 4 }); price = c;
    }
    lastClose = cs[N - 1].c;
    const W = 800, H = 300, px = 16, py = 18;
    const lo = Math.min(...cs.map((c) => c.l)), hi = Math.max(...cs.map((c) => c.h));
    const Y = (v) => H - py - ((v - lo) / (hi - lo)) * (H - py * 2);
    const step = (W - px * 2) / N, bw = step * 0.56;
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Candlestick chart trending upward">`;
    for (let g = 0; g < 5; g++) { const y = py + (g * (H - py * 2)) / 4; svg += `<line class="gl" x1="0" x2="${W}" y1="${y}" y2="${y}"/>`; }
    cs.forEach((c, i) => {
      const x = px + i * step + step / 2, up = c.c >= c.o;
      const top = Y(Math.max(c.o, c.c)), h = Math.max(2, Math.abs(Y(c.o) - Y(c.c)));
      svg += `<g class="cd ${up ? "up" : "dn"}" style="--i:${i}"><line x1="${x}" x2="${x}" y1="${Y(c.h)}" y2="${Y(c.l)}" stroke-width="2"/><rect x="${x - bw / 2}" y="${top}" width="${bw}" height="${h}" rx="1.5"/></g>`;
    });
    const ly = Y(lastClose);
    svg += `<line class="lastline" x1="0" x2="${W}" y1="${ly}" y2="${ly}"/></svg><span class="ptag" style="top:${(ly / H) * 100}%">${lastClose.toFixed(1)}</span>`;
    $("#chart").innerHTML = svg;
  }
  function countUp() {
    if (countStarted) return; countStarted = true;
    const el = $("#price"), chg = $("#chg"), dur = reduce ? 0 : 1700, t0 = performance.now();
    (function f(t) {
      const k = dur ? clamp((t - t0) / dur, 0, 1) : 1, e = 1 - Math.pow(1 - k, 3);
      const v = 100 + (lastClose - 100) * e;
      el.textContent = v.toFixed(2); chg.textContent = `▲ ${(((v / 100) - 1) * 100).toFixed(1)}%`;
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  // ---------- holdings (flip cards) ----------
  function buildHoldings() {
    const rnd = mulberry(hash(C.name) + 99);
    $("#cards").innerHTML = C.reasons.map((r) => {
      const text = typeof r === "string" ? r : r.text;
      const tag = (typeof r === "string" ? r.split(/\s+/)[0] : r.tag || r.text.split(/\s+/)[0]).replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
      const pts = Array.from({ length: 8 }, (_, i) => `${i * 12},${(28 - (i * 3 + rnd() * 5)).toFixed(1)}`).join(" ");
      return `<div class="fc" role="button" tabindex="0"><div class="fc-in">
        <div class="fc-f"><span class="t">${esc(tag)}</span><span class="c">▲ +${(40 + rnd() * 160) | 0}%</span>
          <svg viewBox="0 0 84 30" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#22c55e" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg></div>
        <div class="fc-b">${esc(text)}</div></div></div>`;
    }).join("");
    document.querySelectorAll(".fc").forEach((el) => {
      const flip = () => { el.classList.toggle("flip"); const b = el.getBoundingClientRect(); sparkle(b.left + 40, b.top + 40); };
      el.onclick = flip; el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } };
    });
  }

  // ---------- cheer wall (race bibs) ----------
  function buildWall() {
    const notes = $("#notes");
    function addNote(t) {
      const n = document.createElement("div"); n.className = "note";
      n.innerHTML = `<small>BIB ${1000 + (hash(t) % 9000)}</small>`; n.appendChild(document.createTextNode(t));
      n.style.setProperty("--r", (Math.random() * 6 - 3).toFixed(1) + "deg"); notes.appendChild(n);
    }
    safeGet("bday-wishes").forEach(addNote);
    $("#wishForm").onsubmit = (e) => {
      e.preventDefault();
      const v = $("#wishInput").value.trim(); if (!v) return;
      addNote(v); $("#wishInput").value = ""; burst(60);
      safeSet("bday-wishes", [...safeGet("bday-wishes"), v].slice(-20));
    };
  }

  // ---------- scroll: altitude HUD, parallax, marathon progress ----------
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { ticking = false; frame(); });
  }
  function frame() {
    const h = document.documentElement, y = h.scrollTop || window.scrollY || 0;
    const p = clamp(y / ((h.scrollHeight - h.clientHeight) || 1), 0, 1);
    $("#alt").textContent = Math.round(p * 8848).toLocaleString("en-US");
    $("#km").textContent = (p * 42.195).toFixed(1);
    $("#hudbar").style.width = p * 100 + "%";

    if (!reduce && y < innerHeight * 1.3)
      document.querySelectorAll(".hero [data-speed]").forEach((el) => (el.style.transform = `translate3d(0,${y * el.dataset.speed}px,0)`));

    const route = $("#route"); if (!route) return;
    const r = route.getBoundingClientRect(), prog = clamp((innerHeight * 0.55 - r.top) / (r.height || 1), 0, 1);
    $("#routeFill").style.height = prog * 100 + "%"; $("#runner").style.top = prog * 100 + "%";
    route.querySelectorAll(".tl").forEach((t) => t.classList.toggle("reached", t.offsetTop + 24 <= prog * r.height));
  }
  addEventListener("scroll", onScroll, { passive: true });

  // ---------- typewriter ----------
  function typeLines(lines) {
    const el = $("#typed");
    if (reduce) { el.textContent = lines[0]; return; }
    let li = 0, ci = 0, del = false;
    (function step() {
      const line = lines[li]; el.textContent = line.slice(0, ci);
      let wait = del ? 25 : 55;
      if (!del && ci === line.length) { del = true; wait = 1700; }
      else if (del && ci === 0) { del = false; li = (li + 1) % lines.length; wait = 400; }
      else ci += del ? -1 : 1;
      setTimeout(step, wait);
    })();
  }

  function pickImage(cb) {
    const p = $("#picker"); p.value = "";
    p.onchange = () => { const f = p.files[0]; if (f) cb(URL.createObjectURL(f)); };
    p.click();
  }
  function safeGet(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } }
  function safeSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  update();
  if (!started) timerId = setInterval(update, 1000);
})();
