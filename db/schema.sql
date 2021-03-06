DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

-- 3 different tables: employees, departments, roles
CREATE TABLE employees (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager VARCHAR(30),
PRIMARY KEY (id)
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL(10,2),
department_id INT,
PRIMARY KEY (id)
);

CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT,
department VARCHAR(30),
PRIMARY KEY (id)
);
