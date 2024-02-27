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
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    addEmployeeRole();
                    break;
                case 'Exit':
                    db.exit;
                    console.log("Bye!")
                    break;


            }
        });
}

// view all departments
function viewDepartments() {
    const select = 'SELECT * FROM department';
    db.query(select, (err, res) => {
        console.table(res);
        if (err) throw err;
        start();
    });
}

//view all roles 
function viewRoles() {
    const select = 'SELECT workRole.role_name,workRole.id,department.name,workRole.role_salary FROM workRole JOIN department ON workRole.department_id = department.id';
    db.query(select, (err, res) => {
        console.table(res);
        if (err) throw err;
        start();
    });
}

//view all employees
function viewEmployees() {
    const select = 'SELECT employee.id,employee.first_name,employee.last_name,workRole.role_name,department.name,workRole.role_salary FROM employee LEFT JOIN workRole ON employee.role_id =workRole.id LEFT JOIN department ON workRole.department_id = department.id';
    db.query(select, (err, res) => {
        console.table(res);
        if (err) throw err;
        start();
    });
}

// add a department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "addDepartment",
            message: "What department would you like to add?:"
        })
        .then((answer) => {
            const insert = `INSERT INTO department(name) VALUES ("${answer.addDepartment}")`;
            db.query(insert, (err, res) => {
                console.log(`Added ${answer.addDepartment} into departments`);
                if (err) throw err;
                start();
            });
        });
}
// add a role: name of role, salary and department
function addRole() {
    const select = "SELECT * FROM department";
    db.query(select, (err, res) => {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "roleName",
                    message: "What is the name of the role you would like to add?:",
                },
                {
                    type: "input",
                    name: "roleSalary",
                    message: "What is the starting salary for this role?:",
                },
                {
                    type: "list",
                    name: "roleDepartment",
                    message: "What department does this role belong to?:",
                    choices: res.map(
                        (department) => department.name
                    ),
                },
            ])
            .then((answer) => {
                const department = res.find(
                    (department) => department.name === answer.roleDepartment
                );
                const insert = "INSERT INTO workRole SET ?";
                db.query(insert,
                    {
                        role_name: answer.roleName,
                        role_salary: answer.roleSalary,
                        department_id: department.id,
                    },
                    (err,res) => {
                        console.log (`Added the ${answer.roleName} role into the ${answer.roleDepartment} department`);
                        if (err) throw err;
                        start();
                    }
                );
            });
    });
}

// add an employee

app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    start();
});