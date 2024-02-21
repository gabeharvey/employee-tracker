// Packages Required for this Application
const mySQL = require('mysql12');
const cFonts = require('cfonts');
const inquirer = require('inquirer');

// Establish MYSQL Connection
const connection = mySQL.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: '',
    database: 'emptrack_db',
});

// Database Connection
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to ACME Co Employee Tracker Database.');
    start();
});

// Apply CFonts Properties to Application
cFonts.say('ACME Co Employee Tracker', {
    font: 'chrome',
    align: 'center',
    colors: ['gray'],
    background: ['black'],
    lineHeight: 1,
    letterSpacing: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: 'node'
});

// Initialize ACME Co Employee Tracker Prompts
function start(){
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'Please Make Selection.',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Update Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Departments, Roles, Employees',
                'View Total Payroll by Department',
                'Exit',
            ],
        })
        .then((answer) => {
            switch(answer.action) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Update an Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;
                case 'View Employees by Manager':
                    viewEmployeesByManager();
                    break;
                case 'View Employees by Department':
                    viewEmployeesByDepartment();
                    break;
                case 'Delete Departments, Roles, Employees':
                    deleteDepartmentsRolesEmployees();
                    break;
                case 'View Total Payroll by Department':
                    viewTotalPayrollByDepartment();
                    break;
                case 'Exit':
                    connection.end();
                    console.log('Session Terminated.');
                    break;
            }
        });
};