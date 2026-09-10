<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function json_out(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function cors(): void
{
    header('Access-Control-Allow-Origin: ' . cfg()['cors_origin']);
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/** Reads JSON body or normal form POST into one array. */
function input(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw !== '' && str_contains((string)($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) {
        $j = json_decode($raw, true);
        return is_array($j) ? $j : [];
    }
    return $_POST;
}

function s(array $in, string $key, int $max = 5000): ?string
{
    $v = $in[$key] ?? null;
    if ($v === null) return null;
    $v = trim((string)$v);
    if ($v === '') return null;
    return mb_substr($v, 0, $max);
}

function e(?string $v): string
{
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

function require_fields(array $in, array $fields): void
{
    $missing = [];
    foreach ($fields as $f) {
        if (s($in, $f) === null) $missing[] = $f;
    }
    if ($missing) {
        json_out(['ok' => false, 'error' => 'Missing required fields: ' . implode(', ', $missing)], 422);
    }
}

/** Builds the wa.me link the frontend should open after a successful submit. */
function wa_link(string $title, array $fields): string
{
    $lines = ["*{$title}*", ''];
    foreach ($fields as $label => $value) {
        if ($value === null || trim((string)$value) === '') continue;
        $lines[] = "*{$label}:* {$value}";
    }
    $msg = implode("\n", $lines);
    return 'https://wa.me/' . cfg()['admin_whatsapp'] . '?text=' . rawurlencode($msg);
}

function start_session(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
        session_start();
    }
}

function current_admin(): ?array
{
    start_session();
    if (empty($_SESSION['admin_id'])) return null;
    $st = db()->prepare('SELECT id, email, role FROM admins WHERE id = ?');
    $st->execute([$_SESSION['admin_id']]);
    return $st->fetch() ?: null;
}

function require_admin(): array
{
    $a = current_admin();
    if (!$a) {
        header('Location: login.php');
        exit;
    }
    return $a;
}

function csrf_token(): string
{
    start_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function check_csrf(): void
{
    start_session();
    $t = $_POST['csrf'] ?? '';
    if (!is_string($t) || !hash_equals($_SESSION['csrf'] ?? '', $t)) {
        http_response_code(400);
        exit('Invalid session token. Reload the page and try again.');
    }
}

/** Saves an uploaded file into /uploads and returns the relative path. */
function save_upload(string $field, array $allowed = ['pdf', 'jpg', 'jpeg', 'png']): ?string
{
    if (empty($_FILES[$field]['name']) || ($_FILES[$field]['error'] ?? 1) !== UPLOAD_ERR_OK) {
        return null;
    }
    if (($_FILES[$field]['size'] ?? 0) > 5 * 1024 * 1024) return null; // 5 MB cap
    $ext = strtolower(pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed, true)) return null;
    $dir = __DIR__ . '/../uploads';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $name = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $dir . '/' . $name)) return null;
    return 'uploads/' . $name;
}
