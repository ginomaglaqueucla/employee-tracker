const e = require('express');
const fs = require('fs');
const inquirer = require('inquirer');
const connection = require('./db/connection');

const startApplication = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role']
        }
    ])
        .then((data) => {
            if (data.init === 'View All Employees') {
                viewAllEmployees();
            }
            else if (data.init === 'View All Departments') {
                viewAllDepartments();
            }
            else if (data.init === 'View All Roles') {
                viewAllRoles();
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
        })
}

const viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
    `
    connection.promise().query(sql)
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => startApplication());
}

const viewAllDepartments = () => {
    const sql = `SELECT * FROM department`

    connection.promise().query(sql)
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => startApplication());
}

const viewAllRoles = () => {
    const sql = `SELECT * FROM role`

    connection.promise().query(sql)
        .then(([rows]) => {
            console.table(rows);
        })
        .then(() => startApplication());
}

const addADept = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the department name'
        }
    ])
        .then(data => {
            connection.promise().query("INSERT INTO department SET name=?", data.departmentName)
                .then(([rows]) => {
                    console.table(rows);
                })
                .then(() => startApplication())
                .catch(err => {
                    console.log(err);
                })
        })
}

const addARole = () => {
    const sql = `SELECT department.id, department.name FROM department`;

    connection.promise().query(sql)
        .then(([rows]) => {
            console.log(rows);
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
                .then(result => {
                    connection.promise().query(
                        "INSERT INTO role SET ?", result
                    )
                })
                .then(() => startApplication())
                .catch(err => {
                    console.log(err);
                })
        })
}

const addAnEmployee = () => {
    const sql = `SELECT role.id, role.title FROM role`;
    const sql2 = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.promise().query(sql)
        .then(([rows]) => {
            console.log(rows);
            const roleArr = rows.map(row => ({ name: row.title, value: row.id }));
            connection.promise().query(sql2)
                .then(([rows]) => {
                    console.log(rows);
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
                        .then(result => {
                            connection.promise().query(
                                "INSERT INTO employee SET ?", result
                            )
                        })
                        .then(() => startApplication())
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
}

const updateEmployeeRole = () => {
    const sql = `SELECT role.id, role.title FROM role`;
    const sql2 = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) as employee FROM employee`;

    connection.promise().query(sql)
        .then(([rows]) => {
            console.log(rows);
            const roleArr = rows.map(row => ({ name: row.title, value: row.id }));
            connection.promise().query(sql2)
                .then(([rows]) => {
                    console.log(rows);
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
                            connection.promise().query(
                                "UPDATE employee SET role_id = ? WHERE id = ?", [result.role_id, result.id]
                            )
                        })
                        // .then(() => viewAllEmployees())
                        .then(() => startApplication())
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
}

startApplication();