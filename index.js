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
            const sql = `INSERT INTO department (name) values (${data.departmentName})`

            connection.promise().query(sql)
                .then(([rows]) => {
                    console.table(rows);
                })
                .then(() => startApplication());
        })
}

startApplication();