#!/usr/bin/env python3
"""Regenerate the static/ HTML export from the running dev server.

Usage:  python3 static/build.py          (dev server must be on :8080)
"""
import os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(ROOT), "src")
BASE = "http://localhost:8080"

PAGES = {
    "": "index.html",
    "about": "about.html",
    "membership": "membership.html",
    "bhawan": "bhawan.html",
    "advertise": "advertise.html",
    "business-card": "business-card.html",
    "committees": "committees.html",
    "members": "members.html",
    "land-records": "land-records.html",
    "useful-links": "useful-links.html",
    "contact": "contact.html",
    "admin/login": "admin-login.html",
}

ROUTE_TO_FILE = {"/": "index.html", "/admin/login": "admin-login.html", "/admin": "admin.html"}
for p, f in PAGES.items():
    if p:
        ROUTE_TO_FILE["/" + p] = f


def fetch(path):
    return subprocess.check_output(["curl", "-s", BASE + "/" + path]).decode("utf-8", "replace")


def convert(html):
    # tag forms with their source route so app.js knows which table to write to
    def tag_form(m):
        route = m.group(2).split("/")[-1].split(".")[0]
        return '<form data-form="%s" class="%s">' % (route.replace("admin_", "admin-"), m.group(1))

    html = re.sub(r'<form class="([^"]*)" data-tsd-source="([^"]*)"[^>]*>', tag_form, html)
    html = re.sub(r'\sdata-tsd-source="[^"]*"', "", html)
    html = re.sub(r"<script\b[^>]*>.*?</script>", "", html, flags=re.S)
    html = re.sub(r'<link[^>]*rel="modulepreload"[^>]*>', "", html)
    html = re.sub(r'<link[^>]*href="/src/styles\.css[^"]*"[^>]*>', '<link rel="stylesheet" href="assets/site.css">', html)
    html = html.replace("/src/assets/", "assets/")
    # internal links -> .html files
    def link(m):
        href = m.group(1)
        return 'href="%s"' % ROUTE_TO_FILE.get(href, href)

    html = re.sub(r'href="(/[a-z0-9\-/]*)"', link, html)
    html = html.replace("</body>", '<script src="assets/app.js"></script></body>')
    return html


def main():
    assets = os.path.join(ROOT, "assets")
    os.makedirs(assets, exist_ok=True)
    css = subprocess.check_output(["curl", "-s", BASE + "/src/styles.css?direct"]).decode()
    if "tailwindcss" not in css[:200]:
        sys.exit("could not fetch compiled CSS — is the dev server running?")
    open(os.path.join(assets, "site.css"), "w").write(css)
    for f in os.listdir(os.path.join(SRC, "assets")):
        shutil.copy(os.path.join(SRC, "assets", f), os.path.join(assets, f))
    pages = {}
    for path, out in PAGES.items():
        pages[out] = convert(fetch(path))

    # admin pages get an extra script
    pages["admin-login.html"] = pages["admin-login.html"].replace(
        "</body>", '<script src="assets/admin.js"></script></body>'
    )

    # dashboard: reuse a page shell, swap the <main> body for the admin mount point
    shell = pages["committees.html"]
    body = ('<main class="flex-1"><section class="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-20"'
            ' id="admin-root"><div class="text-center text-sm text-muted-foreground">Loading…</div>'
            "</section></main>")
    shell = re.sub(r"<main[^>]*>.*?</main>", body, shell, flags=re.S)
    shell = shell.replace("<title>Committees", "<title>Admin")
    shell = shell.replace("</body>", '<script src="assets/admin.js"></script></body>')
    pages["admin.html"] = shell

    for out, html in pages.items():
        open(os.path.join(ROOT, out), "w").write(html)
        print("wrote", out)


if __name__ == "__main__":
    main()
