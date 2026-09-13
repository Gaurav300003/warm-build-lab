/* AESA Nagar — static site behaviour (plain JavaScript, no build step) */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ config */
  var CONFIG = {
    // WhatsApp number of the AESA admin — digits only, country code, no "+"
    ADMIN_WHATSAPP: "919876543210",
    // Lovable Cloud (Supabase) REST endpoint + public key
    SUPABASE_URL: "https://vixtxtpiylsbmvsbgdrm.supabase.co",
    SUPABASE_KEY:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpeHR4dHBpeWxzYm12c2JnZHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMjUzMTQsImV4cCI6MjA5NTYwMTMxNH0.3ikWMYwrX_YxM-cUc-HY4FGtwJQVSlh0zAWQPZJsJ3Y",
  };
  window.AESA_CONFIG = CONFIG;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* --------------------------------------------------------------- supabase */
  var SB = {
    headers: function (token) {
      var h = {
        "Content-Type": "application/json",
        apikey: CONFIG.SUPABASE_KEY,
        Authorization: "Bearer " + (token || CONFIG.SUPABASE_KEY),
      };
      return h;
    },
    insert: function (table, payload) {
      return fetch(CONFIG.SUPABASE_URL + "/rest/v1/" + table, {
        method: "POST",
        headers: SB.headers(),
        body: JSON.stringify(payload),
      });
    },
    select: function (table, token) {
      return fetch(
        CONFIG.SUPABASE_URL + "/rest/v1/" + table + "?select=*&order=created_at.desc&limit=200",
        { headers: SB.headers(token) }
      ).then(function (r) { return r.ok ? r.json() : []; });
    },
    signIn: function (email, password) {
      return fetch(CONFIG.SUPABASE_URL + "/auth/v1/token?grant_type=password", {
        method: "POST",
        headers: SB.headers(),
        body: JSON.stringify({ email: email, password: password }),
      }).then(function (r) { return r.json(); });
    },
    signUp: function (email, password) {
      return fetch(CONFIG.SUPABASE_URL + "/auth/v1/signup", {
        method: "POST",
        headers: SB.headers(),
        body: JSON.stringify({ email: email, password: password }),
      }).then(function (r) { return r.json(); });
    },
    me: function (token) {
      return fetch(CONFIG.SUPABASE_URL + "/auth/v1/user", { headers: SB.headers(token) })
        .then(function (r) { return r.ok ? r.json() : null; });
    },
    isAdmin: function (token, userId) {
      return fetch(
        CONFIG.SUPABASE_URL + "/rest/v1/user_roles?select=role&user_id=eq." + userId + "&role=eq.admin",
        { headers: SB.headers(token) }
      )
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (rows) { return rows.length > 0; });
    },
  };
  window.AESA_SB = SB;

  /* --------------------------------------------------------------- whatsapp */
  function waLink(title, fields) {
    var lines = ["*" + title + "*", ""];
    fields.forEach(function (f) {
      if (f.value) lines.push("*" + f.label + ":* " + f.value);
    });
    lines.push("", "— sent from aesanagar.org");
    return "https://wa.me/" + CONFIG.ADMIN_WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  /* ------------------------------------------------------------ mobile menu */
  function initMenu() {
    var btn = $('header button[aria-label="Menu"]');
    if (!btn) return;
    var header = btn.closest("header");
    var panel = document.createElement("nav");
    panel.className = "lg:hidden border-t border-border bg-background px-3 py-3 hidden";
    var links = $$("header nav a").filter(function (a) { return a.getAttribute("href"); });
    var seen = {};
    links.forEach(function (a) {
      var href = a.getAttribute("href");
      if (seen[href]) return;
      seen[href] = 1;
      var c = document.createElement("a");
      c.href = href;
      c.textContent = a.textContent;
      c.className = "block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary";
      panel.appendChild(c);
    });
    header.appendChild(panel);
    btn.addEventListener("click", function () { panel.classList.toggle("hidden"); });
  }

  /* --------------------------------------------------------------- carousel */
  function initCarousel() {
    var prev = $('button[aria-label="Previous slide"]');
    if (!prev) return;
    var root = prev.parentElement;
    var next = $('button[aria-label="Next slide"]', root);
    var imgs = $$("img", root);
    var dots = $$('button[aria-label^="slide"]', root);
    var eyebrow = $(".eyebrow", root);
    var h = $("h2", root);
    var p = $("h2 + p", root);
    var slides = imgs.map(function (im) { return im.getAttribute("alt"); });
    var meta = [
      { eyebrow: "AESA Bhawan", body: $("h2 + p", root) ? $("h2 + p", root).textContent : "" },
    ];
    var i = 0;
    function render() {
      imgs.forEach(function (im, k) {
        im.className = im.className.replace(/opacity-\d+/, k === i ? "opacity-100" : "opacity-0");
      });
      dots.forEach(function (d, k) {
        d.className = "h-1.5 rounded-full transition-all " + (k === i ? "w-8 bg-background" : "w-3 bg-background/40");
      });
      if (h) h.textContent = slides[i] || h.textContent;
      if (eyebrow && meta[i]) eyebrow.textContent = meta[i].eyebrow;
    }
    dots.forEach(function (d, k) { d.addEventListener("click", function () { i = k; render(); }); });
    prev.addEventListener("click", function () { i = (i - 1 + imgs.length) % imgs.length; render(); });
    next.addEventListener("click", function () { i = (i + 1) % imgs.length; render(); });
    setInterval(function () { i = (i + 1) % imgs.length; render(); }, 6000);
    render();
    if (p) p.textContent = p.textContent; // keep caption as-is
  }

  /* --------------------------------------------------------- service search */
  var PROVIDERS = [
    { name: "R. K. Joshi & Associates", category: "Architect", phone: "+919876543201", type: "Professional" },
    { name: "Patil Structural Consultants", category: "RCC Engineer", phone: "+919876543202", type: "Professional" },
    { name: "Deshmukh Surveyors", category: "Land Surveyor", phone: "+919876543203", type: "Professional" },
    { name: "Sharma Construction Co.", category: "Civil Contractor", phone: "+919876543204", type: "Contractor" },
    { name: "Mahavir Builders", category: "General Contractor", phone: "+919876543205", type: "Contractor" },
    { name: "Sai Painters", category: "Painter", phone: "+919876543206", type: "Contractor" },
    { name: "Ahmednagar Cement Depot", category: "Cement Supplier", phone: "+919876543207", type: "Supplier" },
    { name: "Bharat Steel Traders", category: "Steel Supplier", phone: "+919876543208", type: "Supplier" },
    { name: "Modern Tiles & Marbles", category: "Tiles Supplier", phone: "+919876543209", type: "Supplier" },
  ];

  function initSearch() {
    var input = $$("input").filter(function (el) {
      return (el.getAttribute("placeholder") || "").indexOf("Search ") === 0;
    })[0];
    if (!input) return;
    var root = input.closest(".rounded-2xl") || input.parentElement.parentElement;
    var state = { tab: "Professional", q: "", cat: null };
    var TABS = [
      { key: "Professional", label: "Professionals" },
      { key: "Contractor", label: "Contractors" },
      { key: "Supplier", label: "Material Suppliers" },
    ];

    function card(p) {
      return (
        '<div class="group rounded-xl border border-border bg-background p-4 hover:border-brand transition-colors">' +
        '<div class="font-display font-semibold text-ink">' + esc(p.name) + "</div>" +
        '<div class="mt-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">' +
        esc(p.category) + "</div>" +
        '<div class="mt-4 flex gap-2">' +
        '<a href="tel:' + esc(p.phone) + '" class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold hover:border-ink">Call</a>' +
        '<a target="_blank" rel="noreferrer" href="https://wa.me/' + p.phone.replace(/[^0-9]/g, "") +
        '" class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-whatsapp px-3 py-2 text-xs font-semibold text-whatsapp-foreground hover:opacity-90">WhatsApp</a>' +
        "</div></div>"
      );
    }

    function render() {
      var pool = PROVIDERS.filter(function (p) { return p.type === state.tab; });
      var cats = [];
      pool.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });
      var q = state.q.trim().toLowerCase();
      var list = pool
        .filter(function (p) { return !state.cat || p.category === state.cat; })
        .filter(function (p) {
          return !q || p.name.toLowerCase().indexOf(q) >= 0 || p.category.toLowerCase().indexOf(q) >= 0;
        });

      root.innerHTML =
        '<div class="flex flex-wrap gap-1 rounded-lg bg-secondary p-1 w-fit">' +
        TABS.map(function (t) {
          return '<button data-tab="' + t.key + '" class="rounded-md px-4 py-2 text-sm font-semibold transition-colors ' +
            (state.tab === t.key ? "bg-card text-ink shadow-sm" : "text-muted-foreground hover:text-ink") +
            '">' + t.label + "</button>";
        }).join("") +
        "</div>" +
        '<div class="mt-5"><input data-q value="' + esc(state.q) +
        '" placeholder="Search ' + state.tab.toLowerCase() +
        's by name or category…" class="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" /></div>' +
        '<div class="mt-4 flex flex-wrap gap-2">' +
        '<button data-cat="" class="rounded-full px-3 py-1.5 text-xs font-medium border ' +
        (!state.cat ? "bg-ink text-background border-ink" : "border-border text-muted-foreground hover:border-ink") +
        '">All</button>' +
        cats.map(function (c) {
          return '<button data-cat="' + esc(c) + '" class="rounded-full px-3 py-1.5 text-xs font-medium border ' +
            (state.cat === c ? "bg-ink text-background border-ink" : "border-border text-muted-foreground hover:border-ink") +
            '">' + esc(c) + "</button>";
        }).join("") +
        "</div>" +
        '<div class="mt-6 grid gap-3 sm:grid-cols-2">' +
        (list.length
          ? list.map(card).join("")
          : '<div class="sm:col-span-2 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No matches. Try a different search.</div>') +
        "</div>";

      $$("[data-tab]", root).forEach(function (b) {
        b.addEventListener("click", function () { state.tab = b.getAttribute("data-tab"); state.cat = null; render(); });
      });
      $$("[data-cat]", root).forEach(function (b) {
        b.addEventListener("click", function () {
          var c = b.getAttribute("data-cat");
          state.cat = !c || state.cat === c ? null : c;
          render();
        });
      });
      var qi = $("[data-q]", root);
      qi.addEventListener("input", function () {
        state.q = qi.value;
        var pos = qi.selectionStart;
        render();
        var n = $("[data-q]", root);
        n.focus();
        try { n.setSelectionRange(pos, pos); } catch (e) {}
      });
    }
    render();
  }

  /* ------------------------------------------------------------------ forms */
  var FORM_MAP = {
    contact: {
      table: "contact_messages",
      title: "New Contact Message — AESA Nagar",
      map: function (d) {
        return { name: d.name, email: d.email, phone: d.phone, subject: d.subject, message: d.message };
      },
    },
    membership: {
      table: "membership_applications",
      title: "New Membership Application — AESA Nagar",
      map: function (d) {
        return {
          name: d.name, email: d.email, phone: d.phone, profession: d.category || d.profession,
          licence_no: d.licence, address: d.address, notes: d.notes || d.message,
        };
      },
    },
    bhawan: {
      table: "bhawan_bookings",
      title: "New AESA Bhawan Booking — AESA Nagar",
      map: function (d) {
        return {
          name: d.name, phone: d.phone, email: d.email, hall: d.hall, event_date: d.date,
          start_time: d.start, end_time: d.end, attendees: d.attendees ? Number(d.attendees) : null,
          purpose: d.purpose, is_member: d.member === "Yes" || d.member === "yes",
          member_id: d.memberId, notes: d.notes,
        };
      },
    },
    advertise: {
      table: "ad_enquiries",
      title: "New Advertising Enquiry — AESA Nagar",
      map: function (d) {
        return {
          name: d.name, company: d.company, phone: d.phone, email: d.email,
          package: d["package"], asset: d.asset, notes: d.notes || d.message,
        };
      },
    },
    "business-card": {
      table: "ad_enquiries",
      title: "New Digital Business Card Request — AESA Nagar",
      map: function (d) {
        return {
          name: d.name, company: d.company, phone: d.phone, email: d.email,
          package: "Digital Business Card ₹1,500/yr",
          asset: d.photo || d.website,
          notes: d.description || d.notes,
        };
      },
    },
  };

  function labelFor(el) {
    var wrap = el.closest("label");
    var t = wrap ? (wrap.firstElementChild ? wrap.firstElementChild.textContent : "") : "";
    t = (t || el.getAttribute("name") || "").replace(/\*/g, "").trim();
    return t || el.getAttribute("name");
  }

  function initForms() {
    $$("form[data-form]").forEach(function (form) {
      var kind = form.getAttribute("data-form");
      var conf = FORM_MAP[kind];
      if (!conf) return;

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var data = {};
        var fields = [];
        $$("input, select, textarea", form).forEach(function (el) {
          var n = el.getAttribute("name");
          if (!n) return;
          if (el.type === "checkbox") { data[n] = el.checked ? "Yes" : "No"; }
          else { data[n] = el.value; }
          if (data[n]) fields.push({ label: labelFor(el), value: data[n] });
        });

        var btn = $('button[type="submit"], button:not([type])', form);
        if (btn) { btn.disabled = true; btn.dataset.old = btn.textContent; btn.textContent = "Sending…"; }

        var payload = conf.map(data);
        Object.keys(payload).forEach(function (k) {
          if (payload[k] === "" || payload[k] === undefined) delete payload[k];
        });

        SB.insert(conf.table, payload)
          .catch(function () {})
          .then(function () {
            window.open(waLink(conf.title, fields), "_blank");
            var ok = document.createElement("div");
            ok.className = "sm:col-span-2 rounded-xl border border-brand/30 bg-brand/5 p-6";
            ok.innerHTML =
              '<div class="font-display font-bold text-lg text-ink">Ready to send on WhatsApp</div>' +
              '<p class="mt-1 text-sm text-muted-foreground">Your details are saved with AESA. WhatsApp has opened with your message — tap Send to deliver it to the office.</p>';
            form.parentNode.insertBefore(ok, form);
            form.reset();
            if (btn) { btn.disabled = false; btn.textContent = btn.dataset.old; }
            ok.scrollIntoView({ behavior: "smooth", block: "center" });
          });
      });
    });
  }

  /* -------------------------------------------------------------------- init */
  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initCarousel();
    initSearch();
    initForms();
    if (window.AESA_PAGE_INIT) window.AESA_PAGE_INIT();
  });
})();
