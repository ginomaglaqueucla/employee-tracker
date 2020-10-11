INSERT INTO department (id, name)
VALUES
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal')

INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'Salesperson', 80000, 1),
    (2, 'Sales Lead', 100000, 1),
    (3, 'Software Engineer', 120000, 2),
    (4, 'Lead Engineer', 150000, 2),
    (5, 'Accountant', 125000, 3),
    (6, 'Lawyer', 190000, 4),
    (7, 'Legal Team Lead', 250000, 4)

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'Doe', 2, 3),
    (2, 'Mike', 'Chan', 1, 1),
    (3, 'Ashley', 'Rodriguez', 4, null),
    (4, 'Kevin', 'Tupik', 3, 3),
    (5, 'Marlia', 'Brown', 5, null),
    (6, 'Sarah', 'Lourd', 7, null),
    (7, 'Tom', 'Allen', 6, 6),
    (8, 'Christian', 'Eckenrode', 4, 2)
