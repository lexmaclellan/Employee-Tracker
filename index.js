const inquirer = require ('inquirer');
const mysql = require ('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'employee_tracker_db'
    }
)

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
                    break;
                case 'Update an Employee Role':
                    break;
            }
        })
}
function viewDepartments() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        mainMenu();
    });
}

function viewRoles() {
    db.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        mainMenu();
    });
}

function viewEmployees() {
    db.query('SELECT * FROM employees JOIN roles ON employees.role_id = roles.id', (err, results) => {
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
                console.log(data.department);
                let departmentIndex;
                for (let i = 0; i < departments.length; i++)
                {
                    if (departments[i].name === data.department) {
                        departmentIndex = i+1;
                    }
                }
                
                console.log(departmentIndex);
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [data.title, data.salary, departmentIndex], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Role added successfully.')
                    mainMenu();
                });
            })
    })

    

}

mainMenu();