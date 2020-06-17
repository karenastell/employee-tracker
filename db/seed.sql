INSERT INTO employees
(first_name, last_name, role_id, manager_id)
VALUES
("Karen", "Astell", 1, 2), ("Heidi", "Katz", 2, 1), ("Kaleigh", "Spurio", 3, 2), ("Brian", "Astell", 4, 3);

INSERT INTO roles
(title, salary, department_id)
VALUES
("Software Engineer", 70000, 1), ("Lead Engineer", 100000, 1), ("Lawyer", 120000, 2), ("Salesperson", 85000, 3);

INSERT INTO departments
(department)
VALUES
("Engineering"), ("Legal"), ("Sales");
