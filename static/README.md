# AESA Nagar — static site (HTML + CSS + JavaScript + Tailwind)

A dependency-free copy of the AESA Nagar website. No build step, no framework —
open `index.html` in a browser or upload the whole folder to any web host
(Hostinger, cPanel, Netlify, GitHub Pages, S3…).

## Files

```
index.html            Home (hero carousel, sponsors, stats, service search, notices)
about.html            About AESA
membership.html       Membership application form
bhawan.html           AESA Bhawan booking form
advertise.html        Advertising enquiry form
business-card.html    Digital business card request form
committees.html       Committees / BOD
members.html          Members directory
land-records.html     Land record help
useful-links.html     Useful links
contact.html          Contact form
admin-login.html      Admin sign in / first-admin sign up
admin.html            Admin dashboard (all form submissions)
assets/site.css       Compiled Tailwind CSS + AESA design tokens
assets/app.js         Menu, carousel, directory search, form → database + WhatsApp
assets/admin.js       Admin auth + submissions table
assets/*.jpg          Images
```

## Configure before going live

Open `assets/app.js` and edit the top `CONFIG` block:

- `ADMIN_WHATSAPP` — the AESA WhatsApp number, digits only with country code
  and no `+` (e.g. `919876543210`).
- `SUPABASE_URL` / `SUPABASE_KEY` — already pointed at the project's database.
  The key is the public (anon) key and is safe in the browser; the database
  only allows inserting new submissions and reading them as a signed-in admin.

## How the forms work

On submit, each form saves the entry to the database and then opens WhatsApp
with a prefilled message to the admin number. If the database is unreachable,
WhatsApp still opens so no enquiry is lost.

## Admin

1. Open `admin-login.html`.
2. First time: enter an email + password and click **Create the first admin
   account** (the first account created becomes the admin automatically).
3. Afterwards, sign in to see all submissions at `admin.html`.

## Regenerating

`build.py` regenerates the HTML from the React app while the dev server runs:

```
python3 static/build.py
```
