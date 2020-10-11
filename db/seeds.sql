INSERT INTO department (id, name)
VALUES
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal'),

INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'Salesperson', 80000, 1),
    (2, 'Sales Lead', 100000, 1),

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'Doe', 0, 3),
