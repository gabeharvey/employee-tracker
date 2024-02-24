-- Place Data into Department Table
INSERT INTO department (department_name)
VALUES
("Management"),
("Board of Directors"),
("Public Relations"),
("Finance"),
("Human Resources"),
("Investor Relations"),
("Marketing"),
("Legal"),
("Quality Assurance"),
("Social Media"),
("Sales"),
("Information Technology");

-- Place Data into Role Table
INSERT INTO roles (title, salary, department_id)
VALUES
("CEO", 800000.00, 1),
("Chairman of the Board", 250000.00, 2),
("PR Director", 200000.00, 3),
("CFO", 600000.00, 4),
("HR Director", 300000.00, 5),
("Investor Relations Lead", 250000.00, 6),
("Marketing Director", 400000.00, 7),
("Legal Director" 650000.00, 8),
("QA Director", 375000.00, 9),
("Social Media Lead", 385000.00, 10),
("Sales Manager", 155000.00, 11),
("IT Director", 900000.00, 12);

-- Place Data into Employee Table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Michael", "Scott", 1, 1),
("Dwight", "Schrute", 2, 2),
("Jim", "Halpert", 3, 3),
("Pam", "Beesly", 4, 4),
("Erin", "Hannon", 5, 5),
("Jan", "Levinson", 6, 6),
("Kevin", "Malone", 7, 7),
("Oscar", "Martinez", 8, 8),
("Angela", "Martin", 9, 9),
("Kelly", "Kapoor", 10, 10),
("Stanley", "Hudson", 11, 11),
("Darryl", "Philbin", 12, 12);