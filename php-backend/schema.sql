-- AESA Nagar — MySQL schema
-- Local: mysql -u root -p < schema.sql
-- Hostinger: hPanel → phpMyAdmin → select your DB → Import this file
--            (remove the CREATE DATABASE / USE lines first, the DB already exists)

CREATE DATABASE IF NOT EXISTS `aesa_nagar` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `aesa_nagar`;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(190) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','moderator') NOT NULL DEFAULT 'moderator',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(190) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(190) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `membership_applications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(190) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `profession` VARCHAR(120) NOT NULL,
  `licence_no` VARCHAR(120) NOT NULL,
  `website` VARCHAR(255) NULL,
  `office_address` TEXT NOT NULL,
  `document_path` VARCHAR(255) NULL,
  `photo_path` VARCHAR(255) NULL,
  `status` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `bhawan_bookings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(190) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(190) NULL,
  `event_type` VARCHAR(120) NULL,
  `event_date` DATE NULL,
  `guests` INT NULL,
  `notes` TEXT NULL,
  `status` ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `ad_enquiries` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company` VARCHAR(190) NULL,
  `name` VARCHAR(190) NOT NULL,
  `phone` VARCHAR(40) NOT NULL,
  `email` VARCHAR(190) NULL,
  `package` VARCHAR(120) NULL,
  `message` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
