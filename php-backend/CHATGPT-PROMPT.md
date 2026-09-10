# Prompt to give ChatGPT (build the full PHP version of aesanagar.org)

Copy everything below the line into ChatGPT.

---

You are a senior full-stack developer. Build me a complete, production-ready
website for **AESA Nagar — Ahmednagar Engineers, Architects & Surveyors
Association** using **plain PHP 8 + MySQL + Tailwind CSS (CDN)**, with no
frameworks, no Composer, no Node build step, so it runs on **Hostinger shared
hosting** by simply uploading files. It must also run locally with
`php -S localhost:8000` and XAMPP/MAMP MySQL.

## Deliverables

Give me every file in full, in this structure, with nothing left as "TODO":

```
public_html/
  index.php            Home
  about.php            About AESA
  membership.php       Eligibility + application form (with file uploads)
  bhawan.php           AESA Bhawan details + booking request form
  advertise.php        Advertising packages + enquiry form
  business-card.php    Digital business card generator/preview
  committees.php       Office bearers + committees
  members.php          Searchable member directory
  useful-links.php     Government / professional links
  land-records.php     Land record lookup links (7/12, mutation, DILR etc.)
  contact.php          Contact form + address + embedded map
  includes/
    config.php         DB credentials + admin WhatsApp number + site name
    db.php             PDO connection (exceptions on, prepared statements only)
    helpers.php        escaping, validation, wa.me link builder, CSRF, uploads
    header.php         <head> with per-page SEO tags + sticky nav
    footer.php         multi-column footer with an "Admin" link
  api/
    submit.php         one endpoint for all four forms
  admin/
    login.php          sign in; first account created becomes the admin
    index.php          dashboard, tabs per form, search + delete
    export.php         CSV download of the current tab
    logout.php
  uploads/             writable, with .htaccess blocking PHP execution
  assets/css/site.css  small custom CSS on top of Tailwind CDN
  schema.sql           all tables with indexes
  .htaccess            deny access to includes/ + config.php, force HTTPS
  README.md            local setup + step-by-step Hostinger deploy
```

## Database (MySQL, utf8mb4)

- `admins` — id, email (unique), password_hash, role enum('admin','moderator'), created_at
- `contact_messages` — name, phone, email, subject, message, created_at
- `membership_applications` — name, phone, email, profession, licence_no,
  website, office_address, document_path, photo_path,
  status enum('pending','approved','rejected'), created_at
- `bhawan_bookings` — name, phone, email, event_type, event_date, guests, notes,
  status enum('pending','confirmed','cancelled'), created_at
- `ad_enquiries` — company, name, phone, email, package, message, created_at
- `members` — name, profession, licence_no, phone, email, city, photo_path,
  is_published tinyint, created_at (powers the public directory)

Ship `schema.sql` with a few realistic seed rows for `members` and committees so
the site does not look empty on first load.

## Forms + WhatsApp behaviour (important)

Every public form does exactly this:
1. Validates server-side; on error, re-renders the form with the entered values
   kept and clear messages.
2. Inserts into its MySQL table with a prepared statement.
3. Builds a WhatsApp message and opens `https://wa.me/<ADMIN_NUMBER>?text=<urlencoded>`
   in a new tab so the submission reaches the admin instantly.

The WhatsApp message format is:

```
*New Membership Application — AESA Nagar*

*Name:* …
*Mobile:* …
*Email:* …
*Profession:* …
*Licence No.:* …
*Office Address:* …
```

Empty fields are omitted. The admin number lives only in `config.php`
(digits with country code, no `+`), never hardcoded in pages.

Forms should work **with JavaScript disabled** (normal POST + redirect back with
a success flash message) and, when JS is available, submit through
`api/submit.php` via fetch and open the returned `whatsapp` URL. The membership
form uses `multipart/form-data` for the licence document (PDF/JPG/PNG, max 5 MB)
and profile photo (JPG/PNG).

## Admin panel

- `/admin/login.php`: email + password. If the `admins` table is empty, show a
  "create the first admin" form and make that account role `admin`; after that,
  self-signup is closed permanently.
- Passwords with `password_hash` / `password_verify`. HTTP-only session cookies,
  `session_regenerate_id(true)` after login, CSRF token on every admin POST.
- `/admin/index.php`: tabbed tables for Contact, Membership, Bhawan and Ads;
  newest first, 50 per page with pagination, keyword search, status dropdown for
  membership and bhawan rows, delete with confirmation, links to uploaded files.
- `/admin/export.php?tab=…`: CSV download of that table.
- Every admin page sends `<meta name="robots" content="noindex">`.
- Redirect to login whenever there is no valid session.

## Design system (match this exactly)

- Editorial / architectural look: warm off-white background `#F7F6F3`, near-black
  ink `#141518`, terracotta accent `#B8562F`, hairline borders `#E5E3DE`.
- Fonts from Google Fonts: **Syne** (headings, 700/800), **Lato** (body),
  **IBM Plex Mono** (small uppercase "eyebrow" labels, letter-spaced `0.18em`).
- Generous whitespace, `rounded-2xl` cards with 1px borders, no drop shadows,
  no gradients, no purple. Buttons are solid ink with white text.
- Home page: full-width auto-advancing hero carousel (3 slides, CSS + tiny JS,
  arrows and dots), a "Notice Board" strip, a service-search block that filters
  the member directory by profession and name, quick-link cards to Membership /
  Bhawan / Advertise, and a horizontal sponsor logo rail.
- Fully responsive: sticky header with hamburger drawer under 1024px, single
  column stacking, tables scroll horizontally on mobile.
- Accessible: real `<label>`s, visible focus rings, alt text on every image,
  one `<h1>` per page, semantic `<header>/<main>/<footer>`.

## SEO

Each page passes its own `$pageTitle`, `$pageDescription` and optional
`$ogImage` into `includes/header.php`, which renders unique `<title>` (under 60
chars), meta description (under 160), `og:title`, `og:description`, `og:type`,
`twitter:card`, and a canonical link. Add `LocalBusiness`/`Organization` JSON-LD
on the home and contact pages, lazy-load images, and include a `sitemap.xml`
plus `robots.txt`.

## Security

Prepared statements everywhere, `htmlspecialchars` on every echo, CSRF tokens on
all POSTs, a simple rate limit (max 5 submissions per IP per 10 minutes stored
in a `rate_limits` table), uploads validated by extension **and** MIME type,
random generated filenames, `.htaccess` blocking PHP execution inside
`uploads/`, `includes/` denied from the web, and HTTPS forced.

## Documentation

`README.md` must cover, step by step:
1. Local setup — import `schema.sql`, edit `config.php`, run `php -S`, create the
   first admin, submit a test form, confirm it appears in the dashboard.
2. Hostinger deploy — create the MySQL database and user in hPanel, import
   `schema.sql` via phpMyAdmin, edit `config.php`, upload files into
   `public_html` with File Manager or FTP, chmod `uploads/` to 755, enable SSL
   and force HTTPS, then create the admin account immediately.
3. How to change the admin WhatsApp number, add another admin, and back up the
   database.

Output complete, copy-paste-ready file contents — no placeholders, no ellipses,
no "rest of the code is similar". Start with `schema.sql` and `includes/`, then
the pages, then the admin panel, then the README.
