<?php
declare(strict_types=1);
// Health check + quick links. Safe to delete before going live.
require_once __DIR__ . '/lib/helpers.php';

$dbOk = true;
$dbMsg = 'Connected';
try {
    db()->query('SELECT 1');
} catch (Throwable $e) {
    $dbOk = false;
    $dbMsg = 'Not connected — check config.php and that schema.sql was imported.';
}
?><!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title><?= e(cfg()['site_name']) ?> backend</title>
<style>body{font:15px/1.6 system-ui;margin:0;background:#f7f7f5;color:#141518}.w{max-width:640px;margin:8vh auto;padding:0 20px}
code{background:#ececea;padding:2px 6px;border-radius:5px}.ok{color:#14804a}.bad{color:#b3261e}a{color:#b8562f}</style>
</head><body><div class="w">
<h1><?= e(cfg()['site_name']) ?> — PHP backend</h1>
<p>Database: <strong class="<?= $dbOk ? 'ok' : 'bad' ?>"><?= e($dbMsg) ?></strong></p>
<ul>
  <li><a href="admin/login.php">Admin panel</a></li>
  <li>Form endpoint: <code>api/submit.php?form=contact</code> (also <code>membership</code>, <code>bhawan</code>, <code>advertise</code>)</li>
</ul>
<p>See <code>README.md</code> for local setup and Hostinger upload steps.</p>
</div></body></html>
