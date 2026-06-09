CREATE DATABASE IF NOT EXISTS techcelerators_lms;
USE techcelerators_lms;

CREATE TABLE IF NOT EXISTS counselors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  sheet_url VARCHAR(255),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150),
  source ENUM('Meta', 'Instagram', 'Website', 'WhatsApp', 'Referral', 'Walk-in', 'FormCirculation') NOT NULL,
  course VARCHAR(150),
  city VARCHAR(120),
  state VARCHAR(120),
  connectivity_status ENUM('connected', 'dnp', 'vulgar', 'cut_call', 'switch_off', 'wrong_number', 'time_given') NOT NULL DEFAULT 'connected',
  current_status ENUM('follow_up', 'dnp', 'denied', 'payment_done') NOT NULL DEFAULT 'follow_up',
  assigned_to INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_leads_phone UNIQUE (phone),
  INDEX idx_leads_phone (phone),
  INDEX idx_leads_email (email),
  INDEX idx_leads_source (source),
  INDEX idx_leads_status (current_status),
  INDEX idx_leads_connectivity (connectivity_status),
  INDEX idx_leads_assigned_to (assigned_to),
  CONSTRAINT fk_leads_counselor FOREIGN KEY (assigned_to) REFERENCES counselors(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS allocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  counselor_id INT NOT NULL,
  allocated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  allocated_by VARCHAR(120) NOT NULL,
  INDEX idx_allocations_lead (lead_id),
  INDEX idx_allocations_counselor (counselor_id),
  CONSTRAINT fk_allocations_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_allocations_counselor FOREIGN KEY (counselor_id) REFERENCES counselors(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS lead_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  action_type ENUM('status_change', 'assignment', 'allocation', 'note_added') NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  performed_by VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_lead (lead_id),
  INDEX idx_activity_action (action_type),
  CONSTRAINT fk_activity_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE ON UPDATE CASCADE
);
