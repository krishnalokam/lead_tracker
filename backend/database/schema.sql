-- ==========================
-- Leads Table (Consolidated)
-- ==========================
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20) UNIQUE,
  source VARCHAR(50),
  followup_date DATE DEFAULT (CURDATE()),
  notes TEXT,
  status ENUM('PENDING', 'COMPLETED', 'MISSED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS duplicate_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20) ,
  source VARCHAR(50),  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
