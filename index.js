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
                    updateEmployee();
                    break;
            }
        })
}

function viewDepartments() {
    const query = 'SELECT name FROM departments';
    db.query(query, (err, results) => {
        if (err) console.log(err);
        
        console.table(results);
        mainMenu();
    });
}

function viewRoles() {
    const query = 'SELECT roles.title, departments.name, roles.salary ' +
                  'FROM roles ' +
                  'JOIN departments ON roles.department_id = departments.id';

    db.query(query, (err, results) => {
        if (err) console.log(err);
        
        console.table(results);
        mainMenu();
    });
}

function viewEmployees() {
    const query = 'SELECT employees.first_name, employees.last_name, roles.title, departments.name, roles.salary, employees.manager_id ' +
                  'FROM employees ' +
                  'JOIN roles ON employees.role_id = roles.id ' +
                  'JOIN departments ON roles.department_id = departments.id'
    db.query(query, (err, results) => {
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
            const query = 'INSERT INTO departments (name) VALUES (?)';
            db.query(query, [data.department], (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log('Department added successfully.')
                mainMenu();
            });
        })

}

function addRole() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) console.log(err);
        
        const departments = [];
        for (let i = 0; i < results.length; i++) {
            departments.push(results[i]);
        }
        
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
                        departmentIndex = departments[i].id;
                    }
                }
                
                const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
                db.query(sql, [data.title, data.salary, departmentIndex], (err, results) => {
                    if (err) console.log(err);
                    
                    console.log('Role added successfully.')
                    mainMenu();
                });
            })
    })
}

function addEmployee() {
    db.query ('SELECT * FROM roles', (err, roleResults) => {
        if (err) console.log(err);

        const roles = [];
        for (let i = 0; i < roleResults.length; i++) {
            roles.push(roleResults[i].title);
        }

        db.query('SELECT id, CONCAT(first_name, \' \', last_name) AS full_name FROM employees', (err, employeeResults) => {
            if (err) console.log(err);

            const employees = [];
            for (let i = 0; i < employeeResults.length; i++) {
                employees.push(employeeResults[i].full_name);
            }

            const managerChoices = [];
            managerChoices.push("No Manager");
            for (let i = 0; i < employees.length; i++) {
                managerChoices.push(employees[i]);
            }
            
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
                        message: 'Choose the new employee\'s manager:',
                        choices: managerChoices
                    }
                ])
                .then((data) => {
                    let roleIndex;
                    for (let i = 0; i < roles.length; i++) {
                        if (roles[i] === data.role) {
                            roleIndex = roleResults[i].id;
                        }
                    }

                    let managerIndex;
                    if (data.manager === "No Manager") {
                        managerIndex = null;
                    }
                    else {
                        for (let i = 0; i < employees.length; i++) {
                            if (employees[i] === data.manager) {
                                managerIndex = employeeResults[i].id;
                            }
                        }
                    }

                    const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                    db.query(sql, [data.firstName, data.lastName, roleIndex, managerIndex], (err, results) => {
                        if (err) console.log(err);

                        console.log('Employee added successfully.');
                        mainMenu();
                    });
                })
        })
    })

    
    //         .then((data) => {
    //             let roleIndex;
    //             let managerIndex;
                
    //             if (data.manager === "No Manager") {
    //                 managerIndex = null;
    //             }
    //             else {
    //                 for (let i = 0; i < roles.length; i++)
    //                 {
    //                     if (roles[i].title === data.role) {
    //                         roleIndex = i+1;
    //                     }
    //                 }

    //                 for (let i = 0; i < employees.length; i++)
    //                 {
    //                     if (employees[i].full_name === data.firstName + " " + data.lastName)
    //                     {
    //                         managerIndex = i+1;
    //                     }
    //                 }  
    //             }

    //             db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
    //                     [data.firstName, data.lastName, roleIndex, managerIndex], (err, results) => {
    //                 if (err) {
    //                     console.log(err);
    //                 }
    //                 console.log('Employee added successfully.')
    //                 mainMenu();
    //             });

    //             mainMenu();
    //         })
    // })
}

function updateEmployee() {

    db.query('SELECT * FROM employees', (err, results) => {
        if (err) console.log(err);

        const employees = results.map(({
            id, first_name, last_name
        }) => ({
            id, first_name, last_name
        }));
        console.log(employees);
        
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'test',
                    message: 'Update which employee?',
                    choices: employees
                }
            ])
            .then(data => {
                const employee = data.first_name + ' ' + data.last_name;
                const params = [];
                params.push(employee);

                db.query('SELECT * FROM roles', (err, results) => {
                    if (err) console.log(err);

                    const roles = results.map(({
                        id, title
                    }) => ({
                        name: title, value: id
                    }));

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'role',
                                message: "What is the employee's new role?",
                                choices: roles
                            }
                        ])
                        .then(data => {
                            const role = data.role;
                            params.push(role);

                            const employee = params[0];
                            params[0] = role;
                            params[1] = employee;
                            
                            const query = 'UPDATE employee ' +
                                          'SET role_id = ? '
                                          'WHERE id = ?';
                            db.query(query, params, (err, results) => {
                                if (err) console.log(err);
                                console.log("Employee updated successfully.");

                                mainMenu();
                            })
                        })
                })
            })
    })
}

mainMenu();