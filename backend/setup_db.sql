
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hyperflow;

USE hyperflow;

-- Create tables

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- 3. Clients Table
CREATE TABLE IF NOT EXISTS clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(100) NOT NULL,
  description TEXT,
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  client_id INT,
  assigned_to INT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  estimated_time DECIMAL(5,2),
  actual_time DECIMAL(5,2),
  start_time DATETIME,
  end_time DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(client_id),
  FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

-- 5. Employee Attendance Table
CREATE TABLE IF NOT EXISTS employee_attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  login_time DATETIME,
  logout_time DATETIME,
  work_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 6. Communication Logs Table
CREATE TABLE IF NOT EXISTS communication_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  sender_id INT,
  channel VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(client_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  invoice_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE,
  status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- 8. Financial Records Table
CREATE TABLE IF NOT EXISTS financial_records (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  record_type ENUM('expense', 'income') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  record_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. AI Insights Table
CREATE TABLE IF NOT EXISTS ai_insights (
  insight_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  insight TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id)
);

-- Insert default roles
INSERT IGNORE INTO roles (role_name) VALUES 
('admin'),
('employee'),
('client'),
('marketing'),
('hr'),
('finance');

-- Insert a default admin user for testing (password: admin123)
INSERT IGNORE INTO users (name, email, password_hash, role_id)
SELECT 'Admin User', 'admin@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', role_id
FROM roles WHERE role_name = 'admin'
LIMIT 1;

-- Insert some test client data
INSERT IGNORE INTO clients (client_name, description, contact_info) VALUES
('Acme Inc', 'Technology solutions provider', 'contact@acme.com'),
('TechCorp', 'Software development company', 'info@techcorp.com'),
('GrowthHackers', 'Marketing agency', 'hello@growthhackers.com'),
('NewStart LLC', 'Startup incubator', 'support@newstart.com');

-- Create some test tasks
INSERT IGNORE INTO tasks (title, description, client_id, assigned_to, status, estimated_time)
SELECT 
  'Update client dashboard design', 
  'Redesign the client dashboard to improve user experience', 
  c.client_id, 
  u.user_id,
  'in_progress',
  8.5
FROM clients c, users u
WHERE c.client_name = 'Acme Inc' AND u.email = 'admin@example.com'
LIMIT 1;

INSERT IGNORE INTO tasks (title, description, client_id, assigned_to, status, estimated_time)
SELECT 
  'Prepare monthly analytics report', 
  'Create a comprehensive analytics report for client', 
  c.client_id, 
  u.user_id,
  'pending',
  4.0
FROM clients c, users u
WHERE c.client_name = 'TechCorp' AND u.email = 'admin@example.com'
LIMIT 1;

-- Create some test attendance records
INSERT IGNORE INTO employee_attendance (user_id, login_time, logout_time, work_date)
SELECT 
  user_id,
  DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR,
  DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR,
  DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))
FROM users
WHERE email = 'admin@example.com'
LIMIT 1;
