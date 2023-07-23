INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer" 120000, 2),
       ("Account Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Sleve", "McDichael", 1, null),
       ("Bobson", "Dugnutt", 2, 1),
       ("Mike", "Truk", 3, null),
       ("Mario", "McRlwain", 4, 3),
       ("Shown", "Furcotte", 5, null),
       ("Dwigt", "Rortugal", 6, 5),
       ("Karl", "Dandleton", 7, null),
       ("Anatoli", "Smorin", 8, 7);