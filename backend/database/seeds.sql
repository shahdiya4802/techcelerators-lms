USE techcelerators_lms;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE lead_activity;
TRUNCATE TABLE allocations;
TRUNCATE TABLE leads;
TRUNCATE TABLE counselors;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO counselors (name, email, phone, sheet_url, active)
VALUES
('Aarav Sharma', 'aarav.sharma@techcelerators.in', '9876543201', 'https://docs.google.com/spreadsheets/d/aarav', TRUE),
('Isha Verma', 'isha.verma@techcelerators.in', '9876543202', 'https://docs.google.com/spreadsheets/d/isha', TRUE),
('Rohan Gupta', 'rohan.gupta@techcelerators.in', '9876543203', 'https://docs.google.com/spreadsheets/d/rohan', TRUE),
('Neha Singh', 'neha.singh@techcelerators.in', '9876543204', 'https://docs.google.com/spreadsheets/d/neha', TRUE),
('Kabir Mehta', 'kabir.mehta@techcelerators.in', '9876543205', 'https://docs.google.com/spreadsheets/d/kabir', TRUE),
('Sana Khan', 'sana.khan@techcelerators.in', '9876543206', 'https://docs.google.com/spreadsheets/d/sana', TRUE),
('Yash Patel', 'yash.patel@techcelerators.in', '9876543207', 'https://docs.google.com/spreadsheets/d/yash', TRUE),
('Riya Das', 'riya.das@techcelerators.in', '9876543208', 'https://docs.google.com/spreadsheets/d/riya', TRUE),
('Arjun Rao', 'arjun.rao@techcelerators.in', '9876543209', 'https://docs.google.com/spreadsheets/d/arjun', TRUE),
('Diya Nair', 'diya.nair@techcelerators.in', '9876543210', 'https://docs.google.com/spreadsheets/d/diya', TRUE),
('Kunal Jain', 'kunal.jain@techcelerators.in', '9876543211', 'https://docs.google.com/spreadsheets/d/kunal', TRUE),
('Meera Iyer', 'meera.iyer@techcelerators.in', '9876543212', 'https://docs.google.com/spreadsheets/d/meera', TRUE),
('Aman Batra', 'aman.batra@techcelerators.in', '9876543213', NULL, TRUE),
('Pooja Kulkarni', 'pooja.kulkarni@techcelerators.in', '9876543214', NULL, TRUE),
('Rahul Joshi', 'rahul.joshi@techcelerators.in', '9876543215', NULL, TRUE),
('Sneha Kapoor', 'sneha.kapoor@techcelerators.in', '9876543216', NULL, TRUE),
('Varun Arora', 'varun.arora@techcelerators.in', '9876543217', NULL, TRUE),
('Nidhi Chawla', 'nidhi.chawla@techcelerators.in', '9876543218', NULL, TRUE),
('Aditya Malhotra', 'aditya.malhotra@techcelerators.in', '9876543219', NULL, TRUE),
('Tanya Sethi', 'tanya.sethi@techcelerators.in', '9876543220', NULL, TRUE),
('Mohit Bansal', 'mohit.bansal@techcelerators.in', '9876543221', NULL, TRUE),
('Shruti Goyal', 'shruti.goyal@techcelerators.in', '9876543222', NULL, TRUE),
('Dev Khatri', 'dev.khatri@techcelerators.in', '9876543223', NULL, TRUE),
('Ananya Bose', 'ananya.bose@techcelerators.in', '9876543224', NULL, TRUE),
('Vikram Suri', 'vikram.suri@techcelerators.in', '9876543225', NULL, TRUE);

INSERT INTO leads (name, phone, email, source, course, city, state, connectivity_status, current_status, assigned_to)
WITH RECURSIVE sequence_numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM sequence_numbers WHERE n < 560
)
SELECT
  CONCAT(
    ELT(((n - 1) % 8) + 1, 'Aanya', 'Vivaan', 'Anika', 'Krish', 'Mira', 'Arnav', 'Saanvi', 'Reyansh'),
    ' ',
    ELT(((n - 1) % 10) + 1, 'Sharma', 'Patel', 'Verma', 'Singh', 'Nair', 'Gupta', 'Reddy', 'Das', 'Jain', 'Malik')
  ) AS name,
  CONCAT('9', LPAD(700000000 + n, 9, '0')) AS phone,
  CONCAT('lead', LPAD(n, 4, '0'), '@example.com') AS email,
  ELT(((n - 1) % 7) + 1, 'Meta', 'Instagram', 'Website', 'WhatsApp', 'Referral', 'Walk-in', 'FormCirculation') AS source,
  ELT(((n - 1) % 6) + 1, 'Data Science', 'Full Stack Development', 'Digital Marketing', 'UI/UX Design', 'AI Foundations', 'Business Analytics') AS course,
  ELT(((n - 1) % 10) + 1, 'Mumbai', 'Delhi', 'Pune', 'Bengaluru', 'Hyderabad', 'Chennai', 'Jaipur', 'Ahmedabad', 'Lucknow', 'Kolkata') AS city,
  ELT(((n - 1) % 8) + 1, 'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Rajasthan', 'Gujarat', 'Uttar Pradesh') AS state,
  CASE
    WHEN n % 11 = 0 THEN 'vulgar'
    WHEN n % 9 = 0 THEN 'wrong_number'
    WHEN n % 8 = 0 THEN 'switch_off'
    WHEN n % 7 = 0 THEN 'cut_call'
    WHEN n % 5 = 0 THEN 'dnp'
    WHEN n % 4 = 0 THEN 'time_given'
    ELSE 'connected'
  END AS connectivity_status,
  CASE
    WHEN n % 13 = 0 THEN 'payment_done'
    WHEN n % 7 = 0 THEN 'denied'
    WHEN n % 5 = 0 THEN 'dnp'
    ELSE 'follow_up'
  END AS current_status,
  CASE
    WHEN n % 6 = 0 THEN NULL
    ELSE ((n - 1) % 25) + 1
  END AS assigned_to
FROM sequence_numbers;

INSERT INTO allocations (lead_id, counselor_id, allocated_by)
SELECT id, assigned_to, 'system_seed'
FROM leads
WHERE assigned_to IS NOT NULL;

INSERT INTO lead_activity (lead_id, action_type, old_value, new_value, performed_by)
SELECT id, 'note_added', NULL, 'Lead imported from static MVP dataset', 'system_seed'
FROM leads;

INSERT INTO lead_activity (lead_id, action_type, old_value, new_value, performed_by)
SELECT lead_id, 'allocation', NULL, CAST(counselor_id AS CHAR), allocated_by
FROM allocations;
