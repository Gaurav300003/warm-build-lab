<?php
declare(strict_types=1);
require_once __DIR__ . '/../lib/helpers.php';

require_admin();

$allowed = ['contact_messages', 'membership_applications', 'bhawan_bookings', 'ad_enquiries'];
$tab = $_GET['tab'] ?? '';
if (!in_array($tab, $allowed, true)) {
    http_response_code(400);
    exit('Unknown table');
}

$rows = db()->query('SELECT * FROM `' . $tab . '` ORDER BY created_at DESC')->fetchAll();

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $tab . '-' . date('Y-m-d') . '.csv"');

$out = fopen('php://output', 'w');
if ($rows) {
    fputcsv($out, array_keys($rows[0]));
    foreach ($rows as $r) fputcsv($out, array_values($r));
} else {
    fputcsv($out, ['no records']);
}
fclose($out);
