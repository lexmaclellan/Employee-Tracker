const inquirer = require ('inquirer');

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

    })