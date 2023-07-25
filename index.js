const inquirer = require ('inquirer');
const mysql = require ('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'employee_tracker_db',
        multipleStatements: true
    }
)

console.log("EMPLOYEE TRACKER");

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'view',
                message: 'What would you like to do?',
                choices: ['View All Departments',
                        'View All Roles',
                        'View All Employees',
                        'Add a Department',
                        'Add a Role',
                        'Add an Employee',
                        'Update an Employee Role']
            }
        ])
        .then((data) => {
            switch (data.view)
            {
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Update an Employee Role':
                    break;
            }
        })
}

function viewDepartments() {
    db.query('SELECT name FROM departments', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        mainMenu();
    });
}

function viewRoles() {
    db.query('SELECT roles.title, departments.name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        mainMenu();
    });
}

function viewEmployees() {
    db.query('SELECT employees.first_name, employees.last_name, roles.title, departments.name, roles.salary FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        mainMenu();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Please enter the name of the new department:'
            }
        ])
        .then((data) => {
            db.query(`INSERT INTO departments (name) VALUES (${data.department})`, (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log('Department added successfully.')
                mainMenu();
            });
        })

}

function addRole() {
    let departments = [];

    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            console.log(err);
        }
        
        departments = results.map(({
            name
        }) => ({
            name
        }));
        
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Please enter the title of the new role:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Please enter the new role\'s salary:'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Choose a department for the new role:',
                    choices: departments
                }
            ])
            .then((data) => {
                let departmentIndex;
                for (let i = 0; i < departments.length; i++)
                {
                    if (departments[i].name === data.department) {
                        departmentIndex = i+1;
                    }
                }
                
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`,
                        [data.title, data.salary, departmentIndex], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Role added successfully.')
                    mainMenu();
                });
            })
    })
}

function addEmployee() {
    let roles = [];
    let employees = [];

    db.query('SELECT * FROM roles; SELECT CONCAT(first_name, \' \', last_name) AS full_name FROM employees;', (err, results) => {
        if (err) {
            console.log(err);
        }
        
        roles = results[0].map(({
            title
        }) => ({
            title
        }));
        
        employees = results[1].map(({
            full_name
        }) => ({
            full_name
        }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'Enter the new employee\'s first name:'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'Enter the new employee\'s last name:'
                },
                {
                    type: 'list',
                    name: 'role',
                    message: 'Choose the new employee\'s role:',
                    choices: roles
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Who will manage the new employee?',
                    choices: employees
                }
            ])
            .then((data) => {
                let roleIndex;
                let managerIndex;
                
                if (data.manager === "No Manager") {
                    managerIndex = null;
                }
                else {
                    for (let i = 0; i < roleIndex.length; i++)
                    {
                        if (roles[i].title === data.role) {
                            roleIndex = i+1;
                        }
                    }

                    for (let i = 0; i < managerIndex.length; i++)
                    {
                        if (employees[i].full_name === data.firstName + " " + data.lastName)
                        {
                            managerIndex = i+1;
                        }
                    }  
                }

                db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                        [data.firstName, data.lastName, roleIndex, managerIndex], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Employee added successfully.')
                    mainMenu();
                });

                mainMenu();
            })
    })
}

mainMenu();