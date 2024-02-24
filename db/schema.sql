-- Drops Database if it Exists
DROP DATABASE IF EXISTS emptrack_db;

-- Creates New Database
CREATE DATABASE emptrack_db;

-- Activates Database
USE emptrack_db;

-- Create Table for Department
DROP TABLE IF EXISTS department;
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

-- Create Table for Role
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR (30) NOT NULL,
    salary DECIMAL (10,2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

-- Create Table for Employee
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT
);