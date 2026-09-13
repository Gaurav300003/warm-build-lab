/* AESA Nagar — static admin: sign in / sign up + submissions dashboard */
(function () {
  "use strict";
  var SB = window.AESA_SB;
  var KEY = "aesa_admin_token";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  function token() { return localStorage.getItem(KEY); }
  function setToken(t) { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); }

  /* ------------------------------------------------------------ login page */
  function initLogin() {
    var form = document.querySelector('form[data-form="admin-"]');
    if (!form) return;
    var msg = document.createElement("p");
    msg.className = "mt-3 text-sm text-destructive";
    form.appendChild(msg);

    var signup = document.createElement("button");
    signup.type = "button";
    signup.textContent = "Create the first admin account";
    signup.className = "mt-3 w-full rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink";
    form.appendChild(signup);

    function creds() {
      return {
        email: (form.querySelector('input[type="email"], input[name="email"]') || {}).value,
        password: (form.querySelector('input[type="password"], input[name="password"]') || {}).value,
      };
    }

    function done(res) {
      if (res && res.access_token) {
        setToken(res.access_token);
        location.href = "admin.html";
      } else {
        msg.textContent = (res && (res.error_description || res.msg || res.message)) || "Could not sign in.";
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.textContent = "";
      var c = creds();
      SB.signIn(c.email, c.password).then(done);
    });
    signup.addEventListener("click", function () {
      msg.textContent = "";
      var c = creds();
      SB.signUp(c.email, c.password).then(function (res) {
        if (res && res.access_token) return done(res);
        SB.signIn(c.email, c.password).then(done);
      });
    });
  }

  /* -------------------------------------------------------- dashboard page */
  var TABS = [
    { key: "contact_messages", label: "Contact" },
    { key: "membership_applications", label: "Membership" },
    { key: "bhawan_bookings", label: "Bhawan" },
    { key: "ad_enquiries", label: "Ads" },
  ];

  function initDashboard() {
    var root = document.getElementById("admin-root");
    if (!root) return;
    var t = token();
    if (!t) { location.href = "admin-login.html"; return; }

    SB.me(t).then(function (user) {
      if (!user || !user.id) { setToken(null); location.href = "admin-login.html"; return; }
      SB.isAdmin(t, user.id).then(function (isAdmin) {
        if (!isAdmin) {
          root.innerHTML =
            '<h1 class="font-display text-3xl font-bold">Access denied</h1>' +
            '<p class="mt-3 text-sm text-muted-foreground">Signed in as <span class="font-mono">' +
            esc(user.email) + "</span>, but this account is not an admin.</p>" +
            '<button id="out" class="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold">Sign out</button>';
          $("#out", root).addEventListener("click", function () { setToken(null); location.href = "admin-login.html"; });
          return;
        }
        var active = TABS[0].key;

        function render(rows, loading) {
          var cols = rows[0] ? Object.keys(rows[0]).filter(function (k) { return k !== "id"; }) : [];
          root.innerHTML =
            '<div class="eyebrow mb-3">Admin Dashboard</div>' +
            '<h1 class="font-display text-3xl md:text-4xl font-bold">Submissions</h1>' +
            '<div class="mt-6 flex items-center justify-between flex-wrap gap-3">' +
            '<div class="flex gap-1 flex-wrap">' +
            TABS.map(function (tb) {
              return '<button data-t="' + tb.key + '" class="rounded-md px-3 py-2 text-sm font-semibold border ' +
                (active === tb.key ? "bg-ink text-background border-ink" : "border-border bg-card text-ink hover:border-ink") +
                '">' + tb.label + "</button>";
            }).join("") +
            "</div>" +
            '<div class="flex items-center gap-3 text-xs text-muted-foreground"><span class="font-mono">' +
            esc(user.email) + '</span><a href="index.html" class="hover:text-ink">Site →</a>' +
            '<button id="out" class="rounded-md border border-border px-3 py-1.5 font-semibold text-ink">Sign out</button></div></div>' +
            '<div class="mt-6 overflow-x-auto rounded-xl border border-border bg-card">' +
            (loading
              ? '<div class="p-8 text-center text-sm text-muted-foreground">Loading…</div>'
              : rows.length === 0
              ? '<div class="p-8 text-center text-sm text-muted-foreground">No submissions yet.</div>'
              : '<table class="w-full text-sm"><thead><tr class="border-b border-border bg-secondary">' +
                cols.map(function (c) {
                  return '<th class="px-3 py-2 text-left font-mono text-[11px] uppercase tracking-widest text-muted-foreground">' +
                    esc(c.replace(/_/g, " ")) + "</th>";
                }).join("") +
                "</tr></thead><tbody>" +
                rows.map(function (r) {
                  return '<tr class="border-b border-border/60 align-top">' +
                    cols.map(function (c) {
                      return '<td class="px-3 py-2 max-w-[260px]">' + esc(r[c]) + "</td>";
                    }).join("") + "</tr>";
                }).join("") +
                "</tbody></table>") +
            "</div>";

          Array.prototype.forEach.call(root.querySelectorAll("[data-t]"), function (b) {
            b.addEventListener("click", function () { active = b.getAttribute("data-t"); load(); });
          });
          $("#out", root).addEventListener("click", function () { setToken(null); location.href = "admin-login.html"; });
        }

        function load() {
          render([], true);
          SB.select(active, t).then(function (rows) { render(rows || [], false); });
        }
        load();
      });
    });
  }

  window.AESA_PAGE_INIT = function () { initLogin(); initDashboard(); };
})();
