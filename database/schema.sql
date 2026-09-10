-- =====================================================================
-- Miels Flores Portfolio Database Schema
-- Compatible with XAMPP MySQL / MariaDB and phpMyAdmin
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `miels_portfolio_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `miels_portfolio_db`;

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

-- Optional Index for fast sorting by date
CREATE INDEX idx_created_at ON `contact_messages` (`created_at` DESC);

