CREATE DATABASE IF NOT EXISTS medical;
USE medical;

-- إنشاء مستخدم meduser والصلاحيات
CREATE USER IF NOT EXISTS 'meduser'@'%' IDENTIFIED BY 'medpass';
GRANT ALL PRIVILEGES ON medical.* TO 'meduser'@'%';
FLUSH PRIVILEGES;

-- جدول الدكاترة مع المؤهلات والتعليم والخبرة
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  specialty VARCHAR(100),
  qualifications VARCHAR(255),
  education VARCHAR(255),
  experience VARCHAR(255)
);

INSERT INTO doctors (name, specialty, qualifications, education, experience) VALUES
('Dr. Ahmed', 'Cardiology', 'MBBS, Cardiology Specialist', 'Cairo University', '10 years at Heart Clinic'),
('Dr. Mona', 'Dermatology', 'MD, Dermatology Specialist', 'Alexandria University', '8 years at Skin Care Center');

-- جدول المواعيد المتاحة
CREATE TABLE IF NOT EXISTS slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT,
  slot_time DATETIME,
  booked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

INSERT INTO slots (doctor_id, slot_time) VALUES
(1, '2025-10-15 13:00:00'),
(1, '2025-10-15 14:00:00'),
(1, '2025-10-15 17:00:00'),
(2, '2025-10-16 12:00:00'),
(2, '2025-10-16 13:30:00'),
(2, '2025-10-16 16:00:00');

-- جدول الحجوزات (appointments) مع الايميل
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(100),
  patient_email VARCHAR(100),
  doctor_id INT,
  slot_id INT,
  status VARCHAR(50) DEFAULT 'pending',
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (slot_id) REFERENCES slots(id)
);

-- إدخال حجز تجريبي
INSERT INTO appointments (patient_name, patient_email, doctor_id, slot_id, status) VALUES
('Ali Hassan', 'ali@example.com', 1, 1, 'pending'),
('Sara Youssef', 'sara@example.com', 2, 4, 'confirmed');
