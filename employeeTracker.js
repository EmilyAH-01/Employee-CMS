// require Inquirer and MySQL AND console.table
var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");

// set up MySQL connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "St81mIn2020*",
    database: "employeeDB"
});

connection.connect(function(err) {
    if (err) throw err;

    initialQueries();
})

function initialQueries() {
    inquirer
    .prompt({
        name: "action",
        type: "rawlist",
        message: "Which action would you like to perform?",
        choices: [
            "Add department, role, or employee",
            "View departments, roles, or employees",
            "Update employee roles",
            "Exit"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "Add department, role, or employee":
                addData();
                break;
            
            case "View departments, roles, or employees":
                viewData();
                break;

            case "Update employee roles":
                updateData();
                break;
            case "Exit":
                connection.end();
        }
    });
}


// Add departments, roles, employees
function addData() {
    inquirer
    .prompt({
        name: "add",
        type: "rawlist",
        message: "Which of the following would you like to add?",
        choices: [
            "Department",
            "Role",
            "Employee"
        ]
    }).then(function(answer) {
        switch (answer.add) {
            case "Department":
                inquirer
                .prompt({name: "addDept", type: "input", message: "New department: "})
                .then(function(answer) {
                    connection.query(
                        "INSERT INTO department SET ?",
                        {
                            name: answer.addDept
                        },
                        function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " department inserted.\n");

                            initialQueries();
                        });
                });
                break;

            case "Role":
                // Get departments from database
                var currentDepartments = [];
                connection.query("SELECT name FROM department", function(err, res) {
                    if (err) throw err;
                    for(let i = 0; i < res.length; i++) {
                        currentDepartments.push(res[i].name);
                    }
                })

                inquirer
                .prompt([
                    {name: "addRole", type: "input", message: "Role title: "},
                    {name: "addSalary", type: "input", message: "Role salary: "},
                    {name: "addDeptId", type: "rawlist", message: "Department the role falls under: ", choices: currentDepartments}
                ])
                .then(function(answer) {
                    function findDeptId() {
                        for(let i = 0; i < currentDepartments.length; i++) {
                            if(answer.addDeptId == currentDepartments[i]) {
                                return i + 1;
                            }
                        }
                    }
                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                            title: answer.addRole,
                            salary: answer.addSalary,
                            department_id: findDeptId()
                        },
                        function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " role inserted.\n");

                            initialQueries();
                        });
                });
                break;

            case "Employee":
                // Get roles from database
                var currentRoles = [];
                connection.query("SELECT title FROM role", function(err, res) {
                    if (err) throw err;
                    for(let i = 0; i < res.length; i++) {
                        currentRoles.push(res[i].title);
                    }
                })

                inquirer
                .prompt([
                    {name: "firstName", type: "input", message: "First name: "},
                    {name: "lastName", type: "input", message: "Last name: "},
                    {name: "empRole", type: "rawlist", message: "Employee's role: ", choices: currentRoles}
                    // {name: "empManager", type: "input", message: "Employee's manager: "}
                ])
                .then(function(answer) {
                    function findRoleId() {
                        for(let i = 0; i < currentRoles.length; i++) {
                            if(answer.empRole == currentRoles[i]) {
                                return i + 1;
                            }
                        }
                    }
                    connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: findRoleId(),
                            // manager_id: answer.empManager
                        },
                        function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " employee inserted.\n");

                            initialQueries();
                        });
                });
                break;
        }
    })
}

// View departments, roles, employees
function viewData() {
    inquirer
    .prompt({
        name: "view",
        type: "rawlist",
        message: "Which of the following would you like to view?",
        choices: [
            "Departments",
            "Roles",
            "Employees",
            "View all"
        ]
    }).then(function(answer) {
        switch (answer.view) {
            case "Departments":
                connection.connect(function(err) { // Modified from W3 Schools https://www.w3schools.com/nodejs/nodejs_mysql_select.asp
                    connection.query("SELECT * FROM department", function(err, res, fields) {
                        if (err) throw err;
                        console.table(res);
                        initialQueries();
                    });
                });
                break;

            case "Roles":
                connection.connect(function(err) { 
                    connection.query("SELECT * FROM role", function(err, res, fields) {
                        if (err) throw err;
                        console.table(res);
                        initialQueries();
                    });
                });
                break;

            case "Employees":
                connection.connect(function(err) {
                    connection.query("SELECT * FROM employee", function(err, res, fields) {
                        if (err) throw err;
                        console.table(res);
                        initialQueries();
                    });
                });
                break;
            
            case "View all":
                connection.connect(function(err) {
                    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id ";
                    query += "FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ";
                    connection.query(query, function(err, res, fields) {
                        if (err) throw err;
                        console.table(res);
                        initialQueries();
                    });
                });
                break
        }
    })
}

// Update employee roles
function updateData() {
    // Get employee last names from database
    var lastNames = [];
    connection.query("SELECT last_name FROM employee", function(err, res) {
        if (err) throw err;
        for(let i = 0; i < res.length; i++) {
            lastNames.push(res[i].last_name);
        }
    })
    console.log(lastNames);

    // Get roles from database
    var empRoles = [];
    connection.query("SELECT title FROM role", function(err, res) {
        if (err) throw err;
        for(let i = 0; i < res.length; i++) {
            empRoles.push(res[i].title);
        }
    })

    inquirer
    .prompt([
        {name: "employee", type: "rawlist", message: "Which employee's role would you like to update?", 
            choices: function() {
                var lastNames = [];
                connection.query("SELECT last_name FROM employee", function(err, res) {
                    if (err) throw err;
                    for(let i = 0; i < res.length; i++) {
                        lastNames.push(res[i]);
                    }
                })
                return lastNames;
            }},
        {name: "role", type: "rawlist", message: "What is the employee's new role?", choices: empRoles}
    ])
    .then(function(answer) {
        function findRoleId2() {
            for(let i = 0; i < empRoles.length; i++) {
                if(answer.role == empRoles[i]) {
                    return i + 1;
                }
            }
        }

        connection.query("UPDATE employee SET ? WHERE ?",
        [
            {role_id: findRoleId2()}, 
            {last_name: answer.employee}
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee role updated.\n");
        });
    })
}
