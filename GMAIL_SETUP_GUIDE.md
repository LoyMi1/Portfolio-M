# PHPMailer & XAMPP Setup Guide for Miels Flores

This guide explains how to connect your portfolio contact form to your **Gmail account (`mielsflores101@gmail.com`)** using **PHPMailer** and your local **XAMPP MySQL database**.

---

## 1. How Email Forwarding Works

When a visitor fills out the contact form on your portfolio and clicks **Transmit Message**:
1. **Instant Database Backup**: The inquiry is immediately saved to your local XAMPP MySQL database (`miels_portfolio_db.contact_messages`), guaranteeing you never lose a message even if the internet hiccups.
2. **PHPMailer Transmission**: An email is generated and transmitted via Gmail's secure SMTP server (`smtp.gmail.com`) directly to **`mielsflores101@gmail.com`**.
3. **One-Click Direct Reply**: The email is delivered with the visitor's email set in the **`Reply-To`** header. When you open the notification in Gmail and click **Reply**, Gmail will automatically compose an email addressed directly to the visitor!

---

## 2. Generating Your 16-Character Gmail App Password (Takes 60 Seconds)

Google requires an **App Password** for third-party scripts like PHPMailer to send emails securely.

1. Open your browser and go to your Google Account: [https://myaccount.google.com/](https://myaccount.google.com/)
2. On the left menu, click **Security**.
3. Under *"How you sign in to Google"*, make sure **2-Step Verification** is turned **ON**. (If it is already ON, proceed to step 4).
4. In the search bar at the top of the Google Account page, search for:
   ```
   App passwords
   ```
   *(Or navigate directly to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords))*
5. Enter a name for the app password, e.g., **`Portfolio Mailer`**, and click **Create**.
6. Google will display a **16-letter password** (e.g. `abcd efgh ijkl mnop`).
7. Copy this 16-letter code.

---

## 3. Configure Your Password in `backend/config.php`

Open `backend/config.php` and paste your 16-character code into line 29:

```php
// File: backend/config.php (Line 29)
define('SMTP_PASSWORD', 'your16charactercode');
```
*(Remove any spaces from the code)*

Save the file. That's it!

---

## 4. Running with XAMPP

1. Open the **XAMPP Control Panel**.
2. Start both **Apache** and **MySQL** (both should turn green).
3. Ensure your project folder is placed inside your XAMPP `htdocs` directory:
   ```
   C:\xampp\htdocs\Portfolio\
   ```
   *(Already located at `C:\xampp\htdocs\Portfolio\`)*
4. Open your browser and navigate to:
   ```
   http://localhost/Portfolio/
   ```
5. Fill out the contact form and click **Transmit Message**.
6. Check your Gmail inbox at **`mielsflores101@gmail.com`**!

---

## 5. Viewing Messages Stored in XAMPP Database

You can view all received messages in two ways:
1. **Built-in Local Inbox**: Visit `http://localhost/Portfolio/backend/admin-messages.php`
2. **phpMyAdmin**: Visit `http://localhost/phpmyadmin/` -> Select `miels_portfolio_db` -> `contact_messages`.

