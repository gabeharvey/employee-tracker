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
                const query = "INSERT INTO roles SET ?";
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

// Allows Employee to be Added to Database
function addEmployee() {
    connection.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.log(error);
            return;
        }
        const roles = results.map(({id, title}) => ({
            name: title,
            value: id,
        }));
        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
            (error, results) => {
                if (error) {
                    console.log(error);
                    return;
                }
                const managers = results.map(({id, name}) => ({
                    name,
                    value: id,
                }));
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "Please Enter Employee First Name.",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Please Enter Emloyee Last Name.",
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Please Select Role of Employee.",
                            choices: roles,
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Please Select Manager of Employee.",
                            choices: [
                                {name: "None", value: null},
                                ...managers,
                            ],
                        },
                    ])
                    .then((answers) => {
                        const emp = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        const place = [
                            answers.firstName,
                            answers.lastName,
                            answers.roleId,
                            answers.managerId,
                        ];
                        connection.query(emp, place, (error) => {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            console.log("Employee Added to Database.");
                            start();
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        );
    });
};

// Allows Update to Employee Role
function updateEmployeeRole() {
    const queryEmployees ="SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
    const queryRoles ="SELECT * FROM roles";
    connection.query(queryEmployees, (err, resEmployees) => {
        if (err) throw err;
        connection.query(queryRoles, (err, resRoles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Please Select the Employee You Wish to Update.",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Please Select the New Role of the Employee.",
                        choices: resRoles.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployees.find(
                        (employee) => `${employee.first_name} ${employee.last_name}` == answers.employee
                    );
                    const role = resRoles.find(
                        (role) => role.title == answers.role
                    );
                    const query ="UPDATE employee SET role_id = ? WHERE id = ?";
                    connection.query(
                        query,
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Updated the Role of ${employee.first_name} ${employee.last_name} to ${role.title} in the Database.`);
                            start();
                        }
                    );
                });
        });
    });
};

// Allows Update to Employee Manager
function updateEmployeeManager() {
    const queryDepartments = "SELECT * FROM department";
    const queryEmployees = "SELECT * FROM employee";
    connection.query(queryDepartments, (err, resDepartments) => {
        if (err) throw err;
        connection.query(queryEmployees, (err, resEmployees) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Please Select the Department.",
                        choices: resDepartments.map(
                            (department) => department.department_name
                        ),
                    },
                    {
                        type: "list",
                        name: "employee",
                        message: "Please Select the Employee to Add Manager.",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Please Select the Employee Manager.",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answers) => {
                    const department = resDepartments.find(
                        (department) =>
                            department.department_name == answers.department
                    );
                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` == answers.employee
                    );
                    const manager = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` == answers.manager
                    );
                    const query ="UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                    connection.query(
                        query,
                        [manager.id, employee.id, department.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Added ${manager.first_name} ${manager.last_name} as manager for ${employee.first_name} ${employee.last_name} in ${department.department_name}.`);
                            start();
                        }
                    );
                });
        });
    });
};

// Allows View of Employees by Manager
function viewEmployeesByManager() {
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.department_name, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM 
        employee e
        INNER JOIN roles r ON e.role_id = r.id
        INNER JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY 
        manager_name, 
        e.last_name, 
        e.first_name
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        const employeesByManager = res.reduce((acc, cur) => {
            const managerName = cur.manager_name;
            if (acc[managerName]) {
                acc[managerName].push(cur);
            } else {
                acc[managerName] = [cur];
            }
            return acc;
        }, {});
        console.log("List of Employees by Manager.");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employees = employeesByManager[managerName];
            employees.forEach((employee) => {
                console.log(`${employee.first_name} ${employee.last_name}, ${employee.title}, ${employee.department_name}`);
            });
        }
        start();
    });
};

// Allows View of Employees by Department
function viewEmployeesByDepartment() {
    const query ="SELECT department.department_name, employee.first_name, employee.last_name FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = department.id ORDER BY department.department_name ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\nList of Employees by Department.");
        console.table(res);
        start();
    });
};

// Allows Delete Department, Role, Employee
function deleteDepartmentsRolesEmployees() {
    inquirer
        .prompt({
            type: "list",
            name: "data",
            message: "This will Delete Department, Role, or Employee from Database.",
            choices: ["Department", "Role", "Employee"],
        })
        .then((answer) => {
            switch (answer.data) {
                case "Department":
                    deleteDepartment();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Employee":
                    deleteEmployee();
                    break;
                default:
                    console.log(`Following Entry is NOT Valid. ${answer.data}`);
                    start();
                    break;
            }
        });
};

// Allows Delete Department
function deleteDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "Please Select Department to Delete from Database",
                choices: [
                    ...departmentChoices,
                    { name: "Go Back", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.departmentId == "back") {
                    deleteDepartmentsRolesEmployees();
                } else {
                    const query = "DELETE FROM department WHERE id = ?";
                    connection.query(
                        query,
                        [answer.departmentId],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Deleted ${answer.departmentId} Department ID from Database.`);
                            start();
                        }
                    );
                }
            });
    });
};

// Allows Delete Role
function deleteRole() {
    const query = "SELECT * FROM roles";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        choices.push({ name: "Go Back", value: null });
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Please Select Role to be Deleted.",
                choices: choices,
            })
            .then((answer) => {
                if (answer.roleId == null) {
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM roles WHERE id = ?";
                connection.query(query, [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(`Deleted ${answer.roleId} Role from Database.
                    `);
                    start();
                });
            });
    });
};

// Allows Delete Employee


// Allows View Total Payroll by Department


// Allows Exit of Application