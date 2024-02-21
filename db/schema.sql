-- Drops Database if it Exists
DROP DATABASE IF EXISTS emptrack_db;

-- Creates New Database
CREATE DATABASE emptrack_db;

-- Activates Database
USE emptrack_db;

-- Create Table for Department
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL,
);

-- Create Table for Role
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR (30) NOT NULL,
    salary DECIMAL (10,2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);