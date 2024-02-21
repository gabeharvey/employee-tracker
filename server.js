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
            ]
        })
}