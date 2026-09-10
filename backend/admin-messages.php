<?php
/**
 * Miels Flores Portfolio - Local Message Inbox Viewer
 * Allows viewing all contact inquiries saved in the XAMPP MySQL database.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdo = getDatabaseConnection();
$messages = [];
$dbError = '';

if ($pdo) {
    try {
        $stmt = $pdo->query('SELECT * FROM `contact_messages` ORDER BY `created_at` DESC LIMIT 100');
        $messages = $stmt->fetchAll();
    } catch (PDOException $e) {
        $dbError = $e->getMessage();
    }
} else {
    $dbError = 'Unable to connect to MySQL server. Please ensure Apache and MySQL are running in your XAMPP Control Panel.';
}

$totalCount = count($messages);
$sentCount = count(array_filter($messages, fn($m) => $m['email_sent_status'] === 'sent'));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Miels Flores | Message Inbox (XAMPP)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #06060a;
      --card-bg: #0e0a1a;
      --border: #261642;
      --violet: #7c3aed;
      --blue: #38bdf8;
      --text: #f8fafc;
      --muted: #94a3b8;
      --grad-h: linear-gradient(90deg, #1c0a33 0%, #7c3aed 50%, #38bdf8 100%);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 30px 20px;
      line-height: 1.6;
    }
    .container { max-width: 1100px; margin: 0 auto; }
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding: 24px;
      border-radius: 16px;
      background: #0d0918;
      border: 1px solid var(--border);
      position: relative;
      overflow: hidden;
      margin-bottom: 28px;
    }
    .header-bar::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: var(--grad-h);
    }
    h1 { font-family: 'Outfit', sans-serif; font-size: 1.8rem; font-weight: 800; color: #ffffff; }
    .subtitle { color: var(--muted); font-size: 0.88rem; }
    .metrics-row { display: flex; gap: 12px; }
    .metric-pill {
      padding: 6px 14px;
      border-radius: 9999px;
      background: #191230;
      border: 1px solid var(--border);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--blue);
    }
    .back-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      background: #140e26;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }
    .back-link:hover { color: #ffffff; border-color: var(--violet); }
    .error-alert {
      padding: 16px 20px;
      border-radius: 10px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      margin-bottom: 24px;
      font-size: 0.9rem;
    }
    .messages-list { display: flex; flex-direction: column; gap: 16px; }
    .message-card {
      padding: 22px 24px;
      border-radius: 12px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      transition: transform 0.2s, border-color 0.2s;
    }
    .message-card:hover {
      transform: translateY(-2px);
      border-color: var(--violet);
    }
    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #1c1433;
    }
    .sender-info { display: flex; align-items: center; gap: 10px; }
    .sender-name { font-weight: 800; font-size: 1.1rem; color: #ffffff; }
    .sender-email { color: var(--blue); font-size: 0.85rem; text-decoration: none; }
    .card-date { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: var(--muted); }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge.sent { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .badge.pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
    .badge.failed { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
    .card-subject { font-weight: 700; font-size: 0.95rem; color: #c4b5fd; margin-bottom: 8px; }
    .card-body { color: #e2e8f0; font-size: 0.92rem; line-height: 1.6; white-space: pre-wrap; background: #080612; padding: 14px; border-radius: 8px; border: 1px solid #1c1433; margin-bottom: 14px; }
    .reply-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 6px;
      background: var(--grad-h);
      color: #ffffff;
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
    }
    .empty-state {
      padding: 60px 20px;
      text-align: center;
      color: var(--muted);
      background: #0d0918;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-bar">
      <div>
        <h1>Local Message Inbox</h1>
        <p class="subtitle">Stored in XAMPP MySQL Database (<code>miels_portfolio_db.contact_messages</code>)</p>
      </div>
      <div class="metrics-row">
        <span class="metric-pill">Total: <?= $totalCount ?></span>
        <span class="metric-pill">Emails Forwarded: <?= $sentCount ?></span>
        <a href="../index.html" class="back-link">← Back to Portfolio</a>
      </div>
    </div>

    <?php if ($dbError): ?>
      <div class="error-alert">
        <strong>Database Notice:</strong> <?= htmlspecialchars($dbError) ?>
      </div>
    <?php endif; ?>

    <?php if (empty($messages)): ?>
      <div class="empty-state">
        <h3 style="margin-bottom: 8px; color: #ffffff;">No messages received yet</h3>
        <p>Submitted inquiries from your portfolio contact form will automatically appear here.</p>
      </div>
    <?php else: ?>
      <div class="messages-list">
        <?php foreach ($messages as $msg): ?>
          <article class="message-card">
            <div class="card-top">
              <div class="sender-info">
                <span class="sender-name"><?= htmlspecialchars($msg['name']) ?></span>
                <a href="mailto:<?= htmlspecialchars($msg['email']) ?>" class="sender-email"><?= htmlspecialchars($msg['email']) ?></a>
              </div>
              <div>
                <span class="badge <?= htmlspecialchars($msg['email_sent_status']) ?>">
                  <?= htmlspecialchars($msg['email_sent_status']) ?>
                </span>
                <span class="card-date"><?= date('M j, Y - g:i a', strtotime($msg['created_at'])) ?></span>
              </div>
            </div>

            <div class="card-subject">
              Subject: <?= htmlspecialchars($msg['subject']) ?>
            </div>

            <div class="card-body"><?= htmlspecialchars($msg['message']) ?></div>

            <div>
              <a href="mailto:<?= htmlspecialchars($msg['email']) ?>?subject=Re:%20<?= urlencode($msg['subject']) ?>" class="reply-btn">
                ✉️ Reply to <?= htmlspecialchars($msg['name']) ?> (<?= htmlspecialchars($msg['email']) ?>)
              </a>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</body>
</html>

