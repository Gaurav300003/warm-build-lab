<?php
declare(strict_types=1);
require_once __DIR__ . '/../lib/helpers.php';

function layout_head(string $title): void
{
    ?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title><?= e($title) ?> — <?= e(cfg()['site_name']) ?> Admin</title>
<style>
  :root{--ink:#141518;--muted:#6b7280;--line:#e5e7eb;--bg:#f7f7f5;--card:#fff;--brand:#b8562f}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  a{color:var(--ink)}
  .wrap{max-width:1180px;margin:0 auto;padding:28px 20px 60px}
  .bar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:22px}
  h1{font-size:22px;margin:0 0 4px}
  .eyebrow{font:600 11px/1 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  .tabs{display:flex;gap:6px;flex-wrap:wrap}
  .tab{padding:8px 13px;border:1px solid var(--line);border-radius:8px;background:var(--card);text-decoration:none;font-weight:600}
  .tab.on{background:var(--ink);color:#fff;border-color:var(--ink)}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:auto}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{background:#f3f3f1;text-align:left;font:600 11px/1.4 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);padding:10px}
  td{padding:10px;border-top:1px solid var(--line);vertical-align:top;max-width:280px;word-break:break-word}
  .empty{padding:38px;text-align:center;color:var(--muted)}
  .btn{display:inline-block;padding:9px 16px;border-radius:8px;background:var(--ink);color:#fff;border:0;font-weight:600;text-decoration:none;cursor:pointer}
  .btn.ghost{background:var(--card);color:var(--ink);border:1px solid var(--line)}
  input,select{width:100%;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--card);font:inherit}
  label{display:block;font-weight:600;margin:0 0 6px}
  .field{margin-bottom:14px}
  .box{max-width:400px;margin:8vh auto;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:26px}
  .err{color:#b3261e;margin-bottom:12px}
  .muted{color:var(--muted);font-size:12px}
</style>
</head>
<body><div class="wrap"><?php
}

function layout_foot(): void
{
    echo '</div></body></html>';
}
