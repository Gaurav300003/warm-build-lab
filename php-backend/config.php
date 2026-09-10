<?php
// AESA Nagar — PHP backend configuration
// Local (XAMPP/MAMP/php -S) defaults. On Hostinger, replace with the values
// from hPanel → Databases → MySQL Databases.

return [
    'db' => [
        'host'   => getenv('DB_HOST') ?: '127.0.0.1',
        'name'   => getenv('DB_NAME') ?: 'aesa_nagar',
        'user'   => getenv('DB_USER') ?: 'root',
        'pass'   => getenv('DB_PASS') !== false ? getenv('DB_PASS') : '',
        'charset' => 'utf8mb4',
    ],

    // Admin WhatsApp number: country code + number, digits only, no "+".
    'admin_whatsapp' => '919876543210',

    // Allowed origin for the JS frontend (CORS). Use '*' while testing locally.
    'cors_origin' => getenv('CORS_ORIGIN') ?: '*',

    // Site name used in admin panel + WhatsApp messages
    'site_name' => 'AESA Nagar',
];
