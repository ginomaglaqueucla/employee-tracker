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
    return inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the role name'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the role salary'
        },
        {
            type: 'input',
            name: 'roleDepartment',
            message: 'Enter the department id'
        },
    ])
        .then(data => {
            connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.roleName}', '${data.roleSalary}', '${data.roleDepartment}')`)
                .then(([rows]) => {
                    console.table(rows);
                })
                .then(() => startApplication())
                .catch(err => {
                    console.log(err);
                })
        })
}

const addAnEmployee = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'employeeFirstName',
            message: 'Enter the first name'
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: 'Enter the last name'
        },
        {
            type: 'input',
            name: 'employeeDepartment',
            message: 'Enter the department id'
        },
        {
            type: 'input',
            name: 'employeeManager',
            message: 'Enter the manager id'
        },
    ])
        .then(data => {
            connection.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.employeeFirstName}', '${data.employeeLastName}', '${data.employeeDepartment}', '${data.employeeManager}')`)
                .then(([rows]) => {
                    console.table(rows);
                })
                .then(() => startApplication())
                .catch(err => {
                    console.log(err);
                })
        })
}

const updateEmployeeRole = () => {
    const sql = `SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee FROM employee`
    var employeeArr = [];

    connection.promise().query(sql)
        .then(([rows]) => {
            console.log(rows[0].employee);
            for (var i = 0; i < rows.length; i++) {
                employeeArr.push(rows[i].employee);
            }
            return employeeArr;
        })
        .then(employeeArr => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'updateEmployee',
                    message: 'Pick the employee to update',
                    choices: employeeArr
                },
                {
                    type: 'list',
                    name: 'updateEmployeeRole',
                    message: 'Pick the role to update to',
                    choices: ['Salesperson', 'Sales Lead', 'Software Engineer', 'Lead Engineer', 'Accountant', 'Lawyer', 'Legal Team Lead']
                },
            ])
                .then(data => {
                    var first_name = data.updateEmployee.split(" ")[0];
                    var last_name = data.updateEmployee.split(" ")[1];
                    var role_id = 0;

                    console.log(first_name, last_name);

                    if (data.updateEmployeeRole === 'Salesperson') {
                        role_id = 1;
                    }
                    else if (data.updateEmployeeRole === 'Sales Lead') {
                        role_id = 2;
                    }
                    else if (data.updateEmployeeRole === 'Software Engineer') {
                        role_id = 3;
                    }
                    else if (data.updateEmployeeRole === 'Lead Engineer') {
                        role_id = 4;
                    }
                    else if (data.updateEmployeeRole === 'Accountant') {
                        role_id = 5;
                    }
                    else if (data.updateEmployeeRole === 'Lawyer') {
                        role_id = 6;
                    }
                    else if (data.updateEmployeeRole === 'Legal Team Lead') {
                        role_id = 7;
                    }

                    connection.promise().query(`UPDATE employee SET role_id = ${role_id} WHERE first_name = '${first_name}' AND last_name = '${last_name}';`)
                        .then(([rows]) => {
                            console.table(rows);
                        })
                        .then(() => startApplication())
                        .catch(err => {
                            console.log(err);
                        })
                })
        })
}

startApplication();