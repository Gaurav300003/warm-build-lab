<?php
declare(strict_types=1);
require_once __DIR__ . '/_layout.php';

$admin = require_admin();

const TABS = [
    'contact_messages' => 'Contact',
    'membership_applications' => 'Membership',
    'bhawan_bookings' => 'Bhawan',
    'ad_enquiries' => 'Ads',
];

$tab = $_GET['tab'] ?? 'contact_messages';
if (!isset(TABS[$tab])) $tab = 'contact_messages';

// Delete a row
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    check_csrf();
    $st = db()->prepare('DELETE FROM `' . $tab . '` WHERE id = ?');
    $st->execute([(int)($_POST['id'] ?? 0)]);
    header('Location: index.php?tab=' . urlencode($tab));
    exit;
}

$rows = db()->query('SELECT * FROM `' . $tab . '` ORDER BY created_at DESC LIMIT 200')->fetchAll();
$cols = $rows ? array_keys($rows[0]) : [];

layout_head(TABS[$tab]);
?>
<div class="bar">
  <div>
    <div class="eyebrow">Admin Dashboard</div>
    <h1>Submissions</h1>
  </div>
  <div class="muted" style="display:flex;gap:12px;align-items:center">
    <span><?= e($admin['email']) ?></span>
    <a class="tab" href="export.php?tab=<?= e($tab) ?>">Export CSV</a>
    <a class="tab" href="logout.php">Sign out</a>
  </div>
</div>

<div class="tabs" style="margin-bottom:16px">
  <?php foreach (TABS as $key => $label): ?>
    <a class="tab <?= $key === $tab ? 'on' : '' ?>" href="index.php?tab=<?= e($key) ?>"><?= e($label) ?></a>
  <?php endforeach; ?>
</div>

<div class="card">
<?php if (!$rows): ?>
  <div class="empty">No submissions yet.</div>
<?php else: ?>
  <table>
    <thead><tr><?php foreach ($cols as $c): ?><th><?= e($c) ?></th><?php endforeach; ?><th></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <?php foreach ($cols as $c): ?>
          <td><?= $r[$c] === null || $r[$c] === '' ? '<span class="muted">—</span>' : e((string)$r[$c]) ?></td>
        <?php endforeach; ?>
        <td>
          <form method="post" onsubmit="return confirm('Delete this record?')">
            <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
            <button class="btn ghost" type="submit">Delete</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
<?php endif; ?>
</div>
<p class="muted" style="margin-top:10px">Showing latest 200 records.</p>
<?php layout_foot();
