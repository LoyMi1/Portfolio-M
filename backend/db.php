<?php
/**
 * Database Connection & Auto-Provisioning Handler
 * Uses PHP PDO for secure, prepared SQL execution.
 */

require_once __DIR__ . '/config.php';

function getDatabaseConnection()
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    try {
        // 1. Connect to MySQL server without selecting a DB first
        $dsnWithoutDb = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', DB_HOST, DB_PORT);
        $initPdo = new PDO($dsnWithoutDb, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        // 2. Auto-create database if not exists
        $dbName = preg_replace('/[^a-zA-Z0-9_]/', '', DB_NAME);
        $initPdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

        // 3. Reconnect directly to the target database
        $dsnWithDb = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, $dbName);
        $pdo = new PDO($dsnWithDb, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);

        // 4. Auto-create table if not exists
        $createTableSql = "
            CREATE TABLE IF NOT EXISTS `contact_messages` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `name` VARCHAR(100) NOT NULL,
                `email` VARCHAR(150) NOT NULL,
                `subject` VARCHAR(200) DEFAULT 'Portfolio Inquiry',
                `message` TEXT NOT NULL,
                `ip_address` VARCHAR(45) DEFAULT NULL,
                `user_agent` VARCHAR(255) DEFAULT NULL,
                `email_sent_status` ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
                `smtp_error` TEXT DEFAULT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        $pdo->exec($createTableSql);

        return $pdo;
    } catch (PDOException $e) {
        error_log('Database connection error: ' . $e->getMessage());
        return null;
    }
}

