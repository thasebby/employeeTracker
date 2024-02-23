const mysql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
        host: "localhost",
        user: 'root',
        password: 'sqlpass',
        database: 'ETracker_db'
    },
);

function start() {
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
                    'Add an employee',
                    'Update an employee role',
                    'Exit',
                ],
            }
        ])
        .then((answers) => {
            switch (answers.toDo) {
                case 'View all departments':
                    viewDepartments();
                    break;
                // case 'View all roles':
                //     viewRoles();
                //     break;
                // case 'View all employees':
                //     viewEmployees();
                //     break;
                // case 'Add a department':
                //     addDepartment();
                //     break;
                // case 'Add a role':
                //     addRole();
                //     break;
                // case 'Add an employee':
                //     addEmployee();
                //     break;
                // case 'Update an employee role':
                //     addEmployeeRole();
                //     break;

            }
        });
}

// view all departments
function viewDepartments() {
    const select = 'SELECT * FROM department';
    db.query(select,(err,res) => {
        console.table(res);
        if (err) throw err;
        start();
    });
}

app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});