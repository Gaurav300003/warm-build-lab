<?php
declare(strict_types=1);
require_once __DIR__ . '/_layout.php';

start_session();
if (current_admin()) {
    header('Location: index.php');
    exit;
}

$err = '';
$hasAdmin = (int)db()->query('SELECT COUNT(*) c FROM admins')->fetch()['c'] > 0;
$mode = $_GET['mode'] ?? ($hasAdmin ? 'login' : 'signup');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    check_csrf();
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $pass = (string)($_POST['password'] ?? '');
    try {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Enter a valid email address.');
        if (strlen($pass) < 8) throw new RuntimeException('Password must be at least 8 characters.');

        if ($mode === 'signup') {
            if ($hasAdmin) throw new RuntimeException('An admin already exists. Ask them to create your account.');
            $st = db()->prepare('INSERT INTO admins (email, password_hash, role) VALUES (?,?,?)');
            $st->execute([$email, password_hash($pass, PASSWORD_DEFAULT), 'admin']);
            $_SESSION['admin_id'] = (int)db()->lastInsertId();
        } else {
            $st = db()->prepare('SELECT * FROM admins WHERE email = ?');
            $st->execute([$email]);
            $row = $st->fetch();
            if (!$row || !password_verify($pass, $row['password_hash'])) {
                throw new RuntimeException('Wrong email or password.');
            }
            $_SESSION['admin_id'] = (int)$row['id'];
        }
        session_regenerate_id(true);
        header('Location: index.php');
        exit;
    } catch (Throwable $ex) {
        $err = $ex->getMessage();
    }
}

layout_head($mode === 'signup' ? 'Create admin' : 'Sign in');
?>
<div class="box">
  <div class="eyebrow">Admin</div>
  <h1><?= $mode === 'signup' ? 'Create admin account' : 'Admin sign in' ?></h1>
  <p class="muted"><?= $hasAdmin ? 'Only AESA admins can open the dashboard.' : 'No admin exists yet — the first account you create becomes the admin.' ?></p>
  <?php if ($err): ?><div class="err"><?= e($err) ?></div><?php endif; ?>
  <form method="post" style="margin-top:16px">
    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
    <div class="field"><label>Email</label><input type="email" name="email" required autocomplete="email"></div>
    <div class="field"><label>Password</label><input type="password" name="password" minlength="8" required autocomplete="current-password"></div>
    <button class="btn" style="width:100%" type="submit"><?= $mode === 'signup' ? 'Create account →' : 'Sign in →' ?></button>
  </form>
  <?php if (!$hasAdmin): ?>
    <p class="muted" style="margin-top:14px"><a href="login.php?mode=login">Already have an account? Sign in</a></p>
  <?php endif; ?>
</div>
<?php layout_foot();
