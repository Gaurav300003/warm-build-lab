<?php
declare(strict_types=1);
// Single endpoint for all four public forms.
// POST  api/submit.php?form=contact|membership|bhawan|advertise
// Accepts JSON or multipart/form-data (multipart needed for file uploads).
// Returns: { ok: true, id: 12, whatsapp: "https://wa.me/..." }
// The frontend should open the returned `whatsapp` URL in a new tab.

require_once __DIR__ . '/../lib/helpers.php';

cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_out(['ok' => false, 'error' => 'Use POST'], 405);
}

$form = $_GET['form'] ?? '';
$in = input();

try {
    switch ($form) {
        case 'contact':
            require_fields($in, ['name', 'phone', 'subject', 'message']);
            $st = db()->prepare('INSERT INTO contact_messages (name, phone, email, subject, message) VALUES (?,?,?,?,?)');
            $st->execute([s($in, 'name'), s($in, 'phone'), s($in, 'email'), s($in, 'subject'), s($in, 'message')]);
            $wa = wa_link('New Contact Message — ' . cfg()['site_name'], [
                'Name' => s($in, 'name'), 'Phone' => s($in, 'phone'), 'Email' => s($in, 'email'),
                'Subject' => s($in, 'subject'), 'Message' => s($in, 'message'),
            ]);
            break;

        case 'membership':
            require_fields($in, ['name', 'phone', 'email', 'profession', 'licence_no', 'office_address']);
            $doc = save_upload('document');
            $photo = save_upload('photo', ['jpg', 'jpeg', 'png']);
            $st = db()->prepare('INSERT INTO membership_applications (name, phone, email, profession, licence_no, website, office_address, document_path, photo_path) VALUES (?,?,?,?,?,?,?,?,?)');
            $st->execute([
                s($in, 'name'), s($in, 'phone'), s($in, 'email'), s($in, 'profession'),
                s($in, 'licence_no'), s($in, 'website'), s($in, 'office_address'), $doc, $photo,
            ]);
            $wa = wa_link('New Membership Application — ' . cfg()['site_name'], [
                'Name' => s($in, 'name'), 'Mobile' => s($in, 'phone'), 'Email' => s($in, 'email'),
                'Profession' => s($in, 'profession'), 'Licence No.' => s($in, 'licence_no'),
                'Website' => s($in, 'website'), 'Office Address' => s($in, 'office_address'),
            ]);
            break;

        case 'bhawan':
            require_fields($in, ['name', 'phone']);
            $st = db()->prepare('INSERT INTO bhawan_bookings (name, phone, email, event_type, event_date, guests, notes) VALUES (?,?,?,?,?,?,?)');
            $st->execute([
                s($in, 'name'), s($in, 'phone'), s($in, 'email'), s($in, 'event_type'),
                s($in, 'event_date'), ($g = s($in, 'guests')) !== null ? (int)$g : null, s($in, 'notes'),
            ]);
            $wa = wa_link('New Bhawan Booking Request — ' . cfg()['site_name'], [
                'Name' => s($in, 'name'), 'Phone' => s($in, 'phone'), 'Email' => s($in, 'email'),
                'Event Type' => s($in, 'event_type'), 'Date' => s($in, 'event_date'),
                'Guests' => s($in, 'guests'), 'Notes' => s($in, 'notes'),
            ]);
            break;

        case 'advertise':
            require_fields($in, ['name', 'phone']);
            $st = db()->prepare('INSERT INTO ad_enquiries (company, name, phone, email, package, message) VALUES (?,?,?,?,?,?)');
            $st->execute([s($in, 'company'), s($in, 'name'), s($in, 'phone'), s($in, 'email'), s($in, 'package'), s($in, 'message')]);
            $wa = wa_link('New Advertising Enquiry — ' . cfg()['site_name'], [
                'Company' => s($in, 'company'), 'Name' => s($in, 'name'), 'Phone' => s($in, 'phone'),
                'Email' => s($in, 'email'), 'Package' => s($in, 'package'), 'Message' => s($in, 'message'),
            ]);
            break;

        default:
            json_out(['ok' => false, 'error' => 'Unknown form. Use ?form=contact|membership|bhawan|advertise'], 400);
    }

    json_out(['ok' => true, 'id' => (int)db()->lastInsertId(), 'whatsapp' => $wa]);
} catch (Throwable $ex) {
    error_log('[submit] ' . $ex->getMessage());
    json_out(['ok' => false, 'error' => 'Could not save your submission. Please try again.'], 500);
}
