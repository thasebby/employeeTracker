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
                    updateEmployeeRole();
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
    const select = 'SELECT employee.id,employee.first_name,employee.last_name,workRole.role_name,department.name,workRole.role_salary,employee.manager_id FROM employee LEFT JOIN workRole ON employee.role_id =workRole.id LEFT JOIN department ON workRole.department_id = department.id';
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
                    (err, res) => {
                        console.log(`Added the ${answer.roleName} role into the ${answer.roleDepartment} department`);
                        if (err) throw err;
                        start();
                    }
                );
            });
    });
}

// add an employee: first name, last name, role, and manager
function addEmployee() {
    db.query("SELECT id,role_name FROM workRole", (err, res) => {
        const role = res.map(({ id, role_name }) => ({
            name: role_name,
            value: id,
        }));
        if (err) throw err;

        db.query(
            'SELECT id,CONCAT (first_name, " ", last_name) AS manager_name FROM employee WHERE manager_id != 0', (err, res) => {
                const manager = res.map(({ id, manager_name }) => ({
                    name: manager_name,
                    value: id,
                }));

                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "first_name",
                            message: "Enter the employee's first name:",
                        },
                        {
                            type: "input",
                            name: "last_name",
                            message: "Enter the employee's last name:",
                        },
                        {
                            type: "list",
                            name: "role_id",
                            message: "What is the employee's role:",
                            choices: role,
                        },
                        {
                            type: "list",
                            name: "manager_id",
                            message: "Who is this employee's manager?:",
                            choices: manager,
                        },
                    ])
                    .then((answer) => {
                        console.log(answer);
                        db.query(`INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES ('${answer.first_name}','${answer.last_name}',${answer.role_id},${answer.manager_id})`, (err) => {
                            console.log("New employee addedd success");
                            if (err) throw err;
                            start();
                        })
                    });
            }
        )
    })
}

//update employee role: prompt to select an employee and then prompted to update their role
function updateEmployeeRole() {
    db.query('SELECT id, CONCAT (first_name, " ", last_name) AS employee_list FROM employee', (err, res) => {
        if (err) throw err;
        const employees = res.map(({ id, employee_list }) => ({
            name: employee_list,
            value: id,
        }));

        db.query('SELECT id,role_name FROM workRole', (err, res) => {
            if (err) throw err;
            const role = res.map(({ id, role_name }) => ({
                name: role_name,
                value: id,
            }));
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employeeList",
                        message: "Select the employee to update:",
                        choices: employees,
                    },
                    {
                        type: "list",
                        name:"roleList",
                        message:"Select their new role:",
                        choices: role,
                    },
                ])
                .then((answer) => {
                    const selectedEmployee = employees.find(
                        (employee) => employee.value === answer.employeeList
                    );
                    const selectedRole = role.find(
                        (role) => role.value === answer.roleList
                    );
                    const update = "UPDATE employee SET role_id = ? WHERE id = ?";
                    db.query(update, [selectedRole.value, selectedEmployee.value], (err,res) => {
                        if (err) throw err;
                        console.log(`${selectedEmployee.name}'s new role is ${selectedRole.name}`);
                        start();
                    })


                })
        })
    })

}

app.use((req, res) => {
        res.status(404).end();
    })

app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
        start();
    });