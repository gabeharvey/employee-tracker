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