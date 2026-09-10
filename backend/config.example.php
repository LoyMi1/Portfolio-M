<?php
/**
 * Miels Flores Portfolio - Backend Configuration (Template)
 * Compatible with XAMPP (Apache + MySQL/MariaDB)
 *
 * Copy this file to config.php and fill in your Gmail App Password.
 */

// =============================================================================
// 1. DATABASE CONFIGURATION (XAMPP Defaults)
// =============================================================================
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_USER', 'root');
define('DB_PASS', '');                    // Default XAMPP MySQL password is blank
define('DB_NAME', 'miels_portfolio_db');   // Auto-created if it doesn't exist

// =============================================================================
// 2. GMAIL SMTP CONFIGURATION (PHPMailer)
// =============================================================================
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);                 // 587 for TLS (recommended) or 465 for SSL
define('SMTP_SECURE', 'tls');             // 'tls' or 'ssl'
define('SMTP_AUTH', true);

// Your Gmail Address (used to authenticate and receive emails)
define('SMTP_USERNAME', 'mielsflores101@gmail.com');

/**
 * GMAIL APP PASSWORD:
 * 1. Go to your Google Account: https://myaccount.google.com/
 * 2. Enable "2-Step Verification" under Security.
 * 3. Search for "App Passwords" (or visit: https://myaccount.google.com/apppasswords).
 * 4. Generate a new App Password named "Portfolio Mailer" (16 letters).
 * 5. Paste the 16 letters below (without spaces):
 */
define('SMTP_PASSWORD', 'PASTE_YOUR_16_CHAR_GMAIL_APP_PASSWORD_HERE');

// Recipient Details (where messages are delivered)
define('MAIL_RECIPIENT_EMAIL', 'mielsflores101@gmail.com');
define('MAIL_RECIPIENT_NAME', 'Miels Flores');

// =============================================================================
// 3. ADMIN INBOX PASSKEY (Optional protection for backend/admin-messages.php)
// =============================================================================
define('ADMIN_PASSKEY', 'your_admin_passkey_here');

// Set default timezone
date_default_timezone_set('Asia/Manila');
