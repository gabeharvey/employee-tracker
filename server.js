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