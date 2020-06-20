INSERT INTO employees
(first_name, last_name, role_id, manager)
VALUES
("Karen", "Astell", 1, "Heidi Katz"), ("Heidi", "Katz", 2, "Brian Astell"), ("Kaleigh", "Spurio", 3, "Karen Astell"), ("Brian", "Astell", 4, "Kaleigh Spurio"), ("Kathy", "Hoppa", 3, "Karen Astell");

INSERT INTO roles
(title, salary, department_id)
VALUES
("Software Engineer", 70000, 1), ("Lead Engineer", 100000, 1), ("Lawyer", 120000, 2), ("Salesperson", 85000, 3);

INSERT INTO departments
(department)
VALUES
("Engineering"), ("Legal"), ("Sales");
