const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
        host:"localhost",
        user: 'root',
        password:'sqlpass',
        database:'ETracker_db'
    },
);

inquirer
    .prompt([
        {
            type: 'list',
            name: 'toDo',
            message: 'What would you like to do?:',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add and employee',
                'Update an employee role',
            ],
        }
    ])
    // .then((answers) => {
    //     console.log ('choice made')
    // });

    app.use((req,res) => {
        res.status(404).end();
    })

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });