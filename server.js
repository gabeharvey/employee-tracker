// Packages Required for this Application
const mySQL = require("mysql12");
const cFonts = require("cfonts");
const inquirer = require("inquirer");
const { deprecate } = require("util");

// Establish MYSQL Connection
const connection = mySQL.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: "",
    database: "emptrack_db",
});

// Database Connection
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to ACME Co Employee Tracker Database.");
    start();
});

// Apply CFonts Properties to Application
cFonts.say("ACME Co Employee Tracker", {
    font: "chrome",
    align: "center",
    colors: ["gray"],
    background: ["black"],
    lineHeight: 1,
    letterSpacing: 1,
    space: true,
    maxLength: "0",
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: "node"
});

// Initialize ACME Co Employee Tracker Prompts
function start(){
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please Make Selection.",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                "Update Employee Manager",
                "View Employees by Manager",
                "View Employees by Department",
                "Delete Departments, Roles, Employees",
                "View Total Payroll by Department",
                "Exit",
            ],
        })
        .then((answer) => {
            switch(answer.action) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Update an Employee Role":
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
                case "View Employees by Manager":
                    viewEmployeesByManager();
                    break;
                case "View Employees by Department":
                    viewEmployeesByDepartment();
                    break;
                case "Delete Departments, Roles, Employees":
                    deleteDepartmentsRolesEmployees();
                    break;
                case "View Total Payroll by Department":
                    viewTotalPayrollByDepartment();
                    break;
                case "Exit":
                    connection.end();
                    console.log("Session Terminated.");
                    break;
            }
        });
};

// Allows View of All Departments
function viewAllDepartments() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

// Allows View of All Roles
function viewAllRoles() {
    const query = "SELECT role.title, role.id, department.department_name, role.salary from role join department on role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

// Allows View of All Employees
function viewAllEmployees() {
    const query = "SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employee e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id;";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

// Allows to Add Department to Database
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Please Enter New Department Name."
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO department (department_name) VALUES ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added ${answer.name} Department to Database.`);
                start();
                console.log(answer.name);
            });
        });
};

// Allows to Add Role to Database
function addRole() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Please Enter New Role.",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Please Enter Salary.",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Please Select Department for New Role.",
                    choices: res.map(
                        (department) => department.department_name
                    ),
                },
            ])
            .then((answers) => {
                const department = res.find(
                    (department) => department.name == answers.department
                );
                const query = "INSERT INTO role SET ?";
                connection.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${answers.title} Role with Salary of ${answers.salary} to ${answers.department} Department in Database.`);
                        start();
                    }
                );
            });
    });
};