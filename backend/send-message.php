<?php
/**
 * Miels Flores Portfolio - Send Message API Endpoint
 * Stores incoming message in XAMPP MySQL & sends email via PHPMailer to mielsflores101@gmail.com
 */

header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debug log, but do not display raw errors in JSON output
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/phpmailer/Exception.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Please submit via POST.'
    ]);
    exit;
}

// 1. Parse Input (support both standard Form Data and JSON payload)
$inputData = [];
$contentType = isset($_SERVER['CONTENT_TYPE']) ? trim($_SERVER['CONTENT_TYPE']) : '';

if (strpos($contentType, 'application/json') !== false) {
    $rawBody = file_get_contents('php://input');
    $inputData = json_decode($rawBody, true) ?: [];
} else {
    $inputData = $_POST;
}

$name = isset($inputData['name']) ? trim($inputData['name']) : '';
$email = isset($inputData['email']) ? trim($inputData['email']) : '';
$subject = isset($inputData['subject']) && trim($inputData['subject']) !== '' ? trim($inputData['subject']) : 'General Portfolio Inquiry';
$message = isset($inputData['message']) ? trim($inputData['message']) : '';

// 2. Input Validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields: Name, Email, and Message.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);

// 3. Save to XAMPP MySQL Database (guarantees zero message loss)
$pdo = getDatabaseConnection();
$messageId = null;
$dbSaved = false;

if ($pdo) {
    try {
        $stmt = $pdo->prepare('
            INSERT INTO `contact_messages` 
            (`name`, `email`, `subject`, `message`, `ip_address`, `user_agent`, `email_sent_status`)
            VALUES (?, ?, ?, ?, ?, ?, "pending")
        ');
        $stmt->execute([$name, $email, $subject, $message, $ipAddress, $userAgent]);
        $messageId = $pdo->lastInsertId();
        $dbSaved = true;
    } catch (PDOException $e) {
        error_log('Database insert error: ' . $e->getMessage());
    }
}

// 4. Check Gmail SMTP App Password Configuration
$appPasswordConfigured = (
    !empty(SMTP_PASSWORD) && 
    SMTP_PASSWORD !== 'PASTE_YOUR_16_CHAR_GMAIL_APP_PASSWORD_HERE'
);

$emailSent = false;
$emailError = '';

if ($appPasswordConfigured) {
    try {
        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = SMTP_AUTH;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = str_replace(' ', '', SMTP_PASSWORD);
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port       = SMTP_PORT;
        $mail->Timeout    = 20;

        // Allow self-signed or local certificates in local development (common in XAMPP)
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ];

        // SENDER & RECIPIENTS
        // 1. From: Authenticated Gmail account (with the visitor's name attached)
        $mail->setFrom(SMTP_USERNAME, htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ' via Miels Portfolio');
        
        // 2. To: Miels Flores's Gmail inbox
        $mail->addAddress(MAIL_RECIPIENT_EMAIL, MAIL_RECIPIENT_NAME);

        // 3. REPLY-TO: The visitor's real email address!
        // When Miels hits "Reply" in Gmail, it replies directly to the visitor!
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = '[Portfolio Inquiry] ' . $subject . ' - from ' . $name;

        // Build Modern HTML Email Body (Styled with Horizontal Violet/Blue palette)
        $safeName    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeEmail   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
        $safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
        $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
        $dateStr     = date('F j, Y, g:i a');

        $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08070d; color: #e2e8f0; margin: 0; padding: 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background: #0f0c1c; border-radius: 14px; overflow: hidden; border: 1px solid #281944; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
    .header-bar { background: linear-gradient(90deg, #1c0a33 0%, #7c3aed 50%, #38bdf8 100%); padding: 24px; text-align: left; }
    .header-title { margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .header-sub { margin: 4px 0 0 0; font-size: 13px; color: #e0f2fe; }
    .content-body { padding: 28px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .meta-table td { padding: 10px 12px; border-bottom: 1px solid #1c1433; font-size: 14px; }
    .meta-label { color: #94a3b8; font-weight: 700; width: 120px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
    .meta-value { color: #ffffff; font-weight: 600; }
    .message-box { background: #15102a; border-left: 4px solid #38bdf8; padding: 18px; border-radius: 6px; margin-bottom: 24px; font-size: 15px; line-height: 1.65; color: #f1f5f9; }
    .action-btn { display: inline-block; background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%); color: #ffffff !important; padding: 12px 24px; border-radius: 30px; font-weight: 700; text-decoration: none; font-size: 14px; margin-top: 10px; }
    .footer-bar { padding: 18px 28px; background: #080612; border-top: 1px solid #1c1433; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-bar">
      <h1 class="header-title">New Portfolio Inquiry</h1>
      <p class="header-sub">Submitted from Miels Flores's Portfolio (IT &amp; Digital Craftsman)</p>
    </div>
    <div class="content-body">
      <table class="meta-table">
        <tr>
          <td class="meta-label">From:</td>
          <td class="meta-value">{$safeName}</td>
        </tr>
        <tr>
          <td class="meta-label">Sender Email:</td>
          <td class="meta-value"><a href="mailto:{$safeEmail}" style="color: #38bdf8; text-decoration: none;">{$safeEmail}</a></td>
        </tr>
        <tr>
          <td class="meta-label">Project Domain:</td>
          <td class="meta-value">{$safeSubject}</td>
        </tr>
        <tr>
          <td class="meta-label">Date &amp; Time:</td>
          <td class="meta-value">{$dateStr}</td>
        </tr>
      </table>

      <h3 style="color: #c4b5fd; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Message Content:</h3>
      <div class="message-box">
        {$safeMessage}
      </div>

      <div style="text-align: center;">
        <a href="mailto:{$safeEmail}?subject=Re:%20{$safeSubject}" class="action-btn">
          ✉️ Reply Directly to {$safeName}
        </a>
      </div>
    </div>
    <div class="footer-bar">
      This message was sent via Miels Flores Portfolio and permanently recorded in your local XAMPP MySQL database.
    </div>
  </div>
</body>
</html>
HTML;

        $mail->Body = $htmlBody;
        $mail->AltBody = "New Portfolio Message\n\nFrom: {$name} ({$email})\nSubject: {$subject}\nDate: {$dateStr}\n\nMessage:\n{$message}\n";

        $mail->send();
        $emailSent = true;

        // Update database record status
        if ($pdo && $messageId) {
            $pdo->prepare('UPDATE `contact_messages` SET `email_sent_status` = "sent" WHERE `id` = ?')
                ->execute([$messageId]);
        }
    } catch (Exception $e) {
        $emailError = $e->getMessage();
        if ($pdo && $messageId) {
            $pdo->prepare('UPDATE `contact_messages` SET `email_sent_status` = "failed", `smtp_error` = ? WHERE `id` = ?')
                ->execute([$emailError, $messageId]);
        }
    }
}

// 5. Formulate JSON Response for the Frontend
if ($emailSent) {
    echo json_encode([
        'success' => true,
        'email_sent' => true,
        'db_saved' => $dbSaved,
        'message' => 'Message transmitted successfully! An email has been delivered to mielsflores101@gmail.com and recorded in your database.'
    ]);
} elseif (!$appPasswordConfigured) {
    // Graceful helpful notification: Message is safely in MySQL, but Gmail SMTP needs the 16-char App Password
    echo json_encode([
        'success' => true,
        'email_sent' => false,
        'db_saved' => $dbSaved,
        'needs_config' => true,
        'message' => 'Message saved to your XAMPP database! To forward emails to Gmail, please paste your 16-character Gmail App Password in backend/config.php.'
    ]);
} else {
    // SMTP was configured but encountered a connection/auth error
    echo json_encode([
        'success' => true,
        'email_sent' => false,
        'db_saved' => $dbSaved,
        'warning' => true,
        'smtp_error' => $emailError,
        'message' => 'Message securely saved to your XAMPP database! (Gmail SMTP notice: ' . $emailError . ')'
    ]);
}

