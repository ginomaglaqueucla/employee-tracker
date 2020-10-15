// Imports
const cTable = require('console.table');
const e = require('express');
const fs = require('fs');
const inquirer = require('inquirer');
const connection = require('./db/connection');

// When you start the application prompt the user for what they want to do
const startApplication = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Remove An Employee']
        }
    ])
        // based on the choice selected run a different function
        .then((data) => {
            if (data.init === 'View All Departments') {
                viewAllDepartments();
            }
            else if (data.init === 'View All Roles') {
                viewAllRoles();
            }
            else if (data.init === 'View All Employees') {
                viewAllEmployees();
            }
            else if (data.init === 'Add A Department') {
                addADept();
            }
            else if (data.init === 'Add A Role') {
                addARole();
            }
            else if (data.init === 'Add An Employee') {
                addAnEmployee();
            }
            else if (data.init === 'Update An Employee Role') {
                updateEmployeeRole();
            }
            else if (data.init === 'Remove An Employee') {
                removeEmployee();
            }
        })
}

// view all the employees by selecting the correct query parameters for my sql
const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
    `
    // display the information then reprompt the user with the questions
    connection.promise().query(sql)
        .then(([rows]) => {
            console.log("\n");
            console.table(rows);
        })
        .then(() => startApplication());
}

// view all the departments
const viewAllDepartments = () => {
    const sql = `SELECT * FROM department`

    // display the information then reprompt the user with the questions
    connection.promise().query(sql)
        .then(([rows]) => {
            console.log('\n');
            console.table(rows);
        })
        .then(() => startApplication());
}

// view all the roles
const viewAllRoles = () => {
    const sql = `SELECT * FROM role`

    // display the information then reprompt the user with the questions
    connection.promise().query(sql)
        .then(([rows]) => {
            console.log('\n');
            console.table(rows);
        })
        .then(() => startApplication());
}

// add a department by prompting the user to enter the name
const addADept = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the department name'
        }
    ])
        // update the database, the display the info and reprompt the user wih the questions
        .then(data => {
            connection.promise().query("INSERT INTO department SET name=?", data.departmentName)
                .then(([rows]) => {
                    console.table(rows);
                })
                .then(() => viewAllDepartments())
                .then(() => startApplication())
                .catch(err => {
                    console.log(err);
                })
        })
}

// add a role by prompting the user to enter in the correct information
const addARole = () => {
    const sql = `SELECT department.id, department.name FROM department`;

    connection.promise().query(sql)
        .then(([rows]) => {
            // mapping all the departments to their own array so the user can pick them
            const departmentArr = rows.map(row => ({ name: row.name, value: row.id }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the role title'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the role salary'
                },
                {
                    type: 'list',
                    name: 'department_id',
                    message: 'Pick the department',
                    choices: departmentArr
                }])
                // update the database, the display the info and reprompt the user wih the questions
                .then(result => {
                    connection.promise().query(
                        "INSERT INTO role SET ?", result
                    )
                })
                .then(() => viewAllRoles())
                .then(() => startApplication())
                .catch(err => {
                    console.log(err);
                })
        })
}

// add an employee by prompting the user
const addAnEmployee = () => {
    const sql = `SELECT role.id, role.title FROM role`;
    const sql2 = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.promise().query(sql)
        .then(([rows]) => {
            // saves off the role information into an array
            const roleArr = rows.map(row => ({ name: row.title, value: row.id }));
            connection.promise().query(sql2)
                .then(([rows]) => {
                    // // saves off the manager information into an array
                    const managerArr = rows.map(row => ({ name: row.first_name + " " + row.last_name, value: row.id }));

                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: 'Enter the first name'
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: 'Enter the last name'
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            message: 'Pick the role',
                            choices: roleArr
                        },
                        {
                            type: 'list',
                            name: 'manager_id',
                            message: 'Pick the manager',
                            choices: [...managerArr, { name: "NONE", value: null }]
                        }])
                        // updates the database with the information from the user
                        .then(result => {
                            connection.promise().query(
                                "INSERT INTO employee SET ?", result
                            )
                        })
                        .then(() => viewAllEmployees())
                        .then(() => startApplication())
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
}

// update an employee by prompting the user
const updateEmployeeRole = () => {
    const sql = `SELECT role.id, role.title FROM role`;
    const sql2 = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as employee FROM employee`;

    connection.promise().query(sql)
        .then(([rows]) => {
            // maps the role information to an array
            const roleArr = rows.map(row => ({ name: row.title, value: row.id }));
            connection.promise().query(sql2)
                .then(([rows]) => {
                    // maps the employee information to an array
                    const employeeArr = rows.map(row => ({ name: row.employee, value: row.id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'id',
                            message: 'Pick the employee',
                            choices: employeeArr
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            message: 'Pick the role',
                            choices: roleArr
                        }])
                        .then(result => {
                            // updates the database
                            connection.promise().query(
                                "UPDATE employee SET role_id = ? WHERE id = ?", [result.role_id, result.id]
                            )
                        })
                        .then(() => viewAllEmployees())
                        .then(() => startApplication())
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
}

// removes an employee selected by the user
const removeEmployee = () => {
    const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as employee FROM employee`;

    connection.promise().query(sql)
        .then(([rows]) => {
            // saves all the employee information off into an array
            const employeeArr = rows.map(row => ({ name: row.employee, value: row.id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Pick the employee to remove',
                    choices: employeeArr
                }
            ])
                .then(result => {
                    // delete the employee from the database
                    connection.promise().query(
                        "DELETE FROM employee WHERE id = ?", result.id
                    )
                })
                .then(() => viewAllEmployees())
                .then(() => startApplication())
                .catch(err => {
                    console.log(err);
                })
        })
}

startApplication();