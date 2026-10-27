-- =====================================================
-- Digital Hospital Appointment System
-- PostgreSQL Schema
-- =====================================================

-- Create database (run this separately if needed)
-- CREATE DATABASE digital_app;

-- Connect to the database before running the rest
-- \c digital_app

-- =====================================================
-- TABLE: patient
-- =====================================================
CREATE TABLE IF NOT EXISTS patient (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  phone       VARCHAR(20),
  password    VARCHAR(255),
  is_active   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: users  (authentication table)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password     VARCHAR(255),
  role         VARCHAR(50) NOT NULL,   -- 'patient', 'doctor', 'admin'
  reference_id INT,
  is_active    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: otp_verification
-- =====================================================
CREATE TABLE IF NOT EXISTS otp_verification (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  otp         VARCHAR(10) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  is_verified SMALLINT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: password_reset_otps
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_otps (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  otp         VARCHAR(10) NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: doctor
-- =====================================================
CREATE TABLE IF NOT EXISTS doctor (
  id             SERIAL PRIMARY KEY,
  doctorfullname VARCHAR(255) NOT NULL,
  email          VARCHAR(255) UNIQUE NOT NULL,
  contact        VARCHAR(20),
  pwd            VARCHAR(255),
  department     VARCHAR(100),
  experiance     VARCHAR(100),
  photo_url      TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: departments
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: appointments
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id               SERIAL PRIMARY KEY,
  patient_name     VARCHAR(255),
  patient_email    VARCHAR(255),
  patient_phone    VARCHAR(20),
  patient_gender   VARCHAR(20),
  department       VARCHAR(100),
  doctor_id        INT REFERENCES doctor(id) ON DELETE SET NULL,
  doctorname       VARCHAR(255),
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(10) NOT NULL,
  status           VARCHAR(50) DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: appointment_history
-- =====================================================
CREATE TABLE IF NOT EXISTS appointment_history (
  id                    SERIAL PRIMARY KEY,
  appointment_id        INT REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id            INT REFERENCES patient(id) ON DELETE CASCADE,
  patient_name          VARCHAR(255),
  prescription          TEXT,
  diagnosis             TEXT,
  medicine_name         VARCHAR(255),
  medicine_dosage       VARCHAR(100),
  medicine_frequency    VARCHAR(100),
  medicine_duration     VARCHAR(100),
  next_appointment_date DATE,
  next_appointment_time VARCHAR(10),
  created_at            TIMESTAMP DEFAULT NOW()
);

