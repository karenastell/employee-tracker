const connection = require("./connection");
const inquirer = require("inquirer");

class Database {
  constructor() {
    this.connection = connection;
  }

  viewEmployees() {
    // makes a query to the database which joins the tables together to show all the employee information
    this.connection.query(
      "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager from employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)",
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
    this.stopConnection();
  }

  employeesByDepartment() {
    // makes a query to the departments table
    this.connection.query(
      `SELECT department FROM departments`,
      (err, result) => {
        if (err) throw err;
        // that query allows this list of departments to be made
        const list = [];
        result.forEach((item) => {
          list.push(item.department);
        });
        // asks which department the user would like to find
        inquirer
          .prompt({
            type: "list",
            name: "choice",
            message: "Which Department:",
            choices: list,
          })
          .then((answer) => {
            // makes a query to the database to get all of the information about the employee in the department that was chosen
            this.connection.query(
              `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE departments.department =?`,
              [answer.choice],
              (err, result) => {
                if (err) throw err;

                console.table(result);
              }
            );
            this.stopConnection();
          });
      }
    );
  }

  employeesByRole() {
    // makes a query to the roles table
    this.connection.query(`SELECT title FROM roles`, (err, result) => {
      if (err) throw err;
      // that query then is used to make a list of all the role titles
      const list = [];
      result.forEach((item) => {
        list.push(item.title);
      });
      // the user is asked which role title they would like to see
      inquirer
        .prompt({
          type: "list",
          name: "choice",
          message: "Which Role:",
          choices: list,
        })
        .then((answer) => {
          // makes a query to the database to get all of the information about the employee in the role that was chosen

          this.connection.query(
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE roles.title =?`,
            [answer.choice],
            (err, result) => {
              if (err) throw err;

              console.table(result);
            }
          );
          this.stopConnection();
        });
    });
  }

  

  addEmployee() {
    // query is made to the employees and roles tables
    this.connection.query(
      `SELECT first_name, last_name, role_id FROM employees; SELECT * FROM roles;`,
      (err, result) => {
        const nameArray = ["No Manager"];
        const roleArray = [];

        if (err) throw err;
        // arrays are made with the employees first and last name to put into the inquirer prompt choices
        result[0].forEach((person) => {
          nameArray.push(`${person.first_name} ${person.last_name}`);
        });
        // array is made with a list of roles to be put into the inquirer promp choices
        result[1].forEach((role) => {
          roleArray.push(`${role.title}`);
        });
        // user answers questions about the new employee
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What Is The Employee's First Name?",
            },
            {
              type: "input",
              name: "last_name",
              message: "What Is The Employee's Last Name?",
            },
            {
              type: "list",
              name: "manager",
              message: "Who Is The Employee's Manager?",
              choices: nameArray,
            },
            {
              type: "list",
              name: "title",
              message: "What Is The Employee's Role?",
              choices: roleArray,
            },
          ])
          .then((answers) => {
            // if there is no manager for this employee that value is set to null
            if (answers.manager === "No Manager") {
              answers.manager = null;
            }
            // loops through the array of roles to find the role that was choosen for the new employee
            const findRole = result[1].find(
              (role) => role.title === answers.title
            );
            // roleID is set to the id cooresponding to the employee's role
            const roleID = findRole.id;

            this.connection.query(
              // query to insert the new employee into the employee table
              `INSERT INTO employees (first_name, last_name, role_id, manager) VALUES (?, ?, ?, ?)`,
              [answers.first_name, answers.last_name, roleID, answers.manager],
              (err) => {
                if (err) throw err;

                console.log(
                  `${answers.first_name} ${answers.last_name} was added`
                );
              }
            );
            this.stopConnection();
          });
      }
    );
  }

  addRole() {
    this.connection.query(
      // query to the departments table to get the id and department names
      `SELECT id, department FROM departments`,
      (err, result) => {
        if (err) throw err;
        const departmentList = [];
        // makes an array of objects with a department names and ids
        result.forEach((department) => {
          departmentList.push(department);
        });

        const departmentsArray = [];
        // makes an array of department names
        departmentList.forEach((department) => {
          departmentsArray.push(department.department);
        });

        inquirer
          // asks the user information about the new role they are adding
          .prompt([
            {
              type: "input",
              name: "role",
              message: "What Role Would You Like To Add?",
            },
            {
              type: "input",
              name: "salary",
              message: "What Is The Salary For This Role?",
            },
            {
              type: "list",
              name: "department",
              message: "What Department Is This Role Associated With?",
              choices: departmentsArray,
            },
          ])
          .then((answer) => {
         
            let id;
            // sets id to the id of the department
            departmentList.forEach((item) => {
              if (item.department === answer.department) {
                id = item.id;
              }
            });
            const roleArray = [];
            this.connection.query(`SELECT title FROM roles`, (err, result) => {
              if (err) throw err;
              // makes an array of the role titles
              result.forEach((role) => {
                roleArray.push(role.title);
              });

              // loops through the roles to make sure that role doesn't already exist
              if (roleArray.includes(answer.role)) {
                console.log(
                  `The role ${answer.role} already exists.  Please add a different role name.`
                );
                this.addRole();
              } else {
                // if it doesn't exist, it addes the role
                this.connection.query(
                  `INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`,
                  [answer.role, answer.salary, id],
                  (err) => {
                    if (err) throw err;
                    console.log(`${answer.role} was added`);
                     this.stopConnection();
                  }
                );
              }
            });
            
          });
         
      }
    );
  }

  addDepartment() {
    const departmentsArray = [];
    this.connection.query(
      `SELECT department FROM departments`,
      (err, result) => {
        if (err) throw err;
        // creates an array of the department names
        result.forEach((department) => {
          departmentsArray.push(department.department);
        });
      }
    );
    inquirer
      // asks the user the new department name
      .prompt({
        type: "input",
        name: "department",
        message: "What Department Would You Like To Add?",
      })
      .then((answer) => {
        // checks to see if that department already exists
        if (departmentsArray.includes(answer.department)) {
          console.log(
            `${answer.department} already exisits. Please add a different department name.`
          );
          this.addDepartment();
        } else {
          // if it does not exist, it is added
          this.connection.query(
            `INSERT INTO departments (department) VALUES (?)`,
            [answer.department],
            (err, result) => {
              if (err) throw err;
              console.log(`The deparment ${answer.department} has been added.`);
            }
          );
         this.stopConnection(); 
        }
        
      });
  }

  removeEmployee() {
    this.connection.query(
      // queries the employees table
      `SELECT id, first_name, last_name FROM employees;`,
      (err, result) => {
        if (err) throw err;
        const idNames = [];
        const names = [];
        // creates an array of objects with the id and first and last names, and also an array with the first and last name to be used in the inquirer choices
        result.forEach((employee) => {
          idNames.push({
            id: employee.id,
            name: `${employee.first_name} ${employee.last_name}`,
          });
          names.push(`${employee.first_name} ${employee.last_name}`);
        });

        inquirer
          // asks the user which employee to remove
          .prompt([
            {
              type: "list",
              name: "employee",
              message: "Which Employee Would You Like To Remove?",
              choices: names,
            },
          ])
          .then((answer) => {
            // finds the employee in the idNames array and makes an array with that employee's information
            const findEmployee = idNames.find(
              (employee) => employee.name === answer.employee
            );
            // gets the id of the employee to be removed
            const id = findEmployee.id;
            this.connection.query(
              // queries the employee table and deletes the employee
              `DELETE FROM employees WHERE id = ?`,
              [id],
              (err) => {
                if (err) throw err;
                console.log(`${answer.employee} has been removed`);
              }
            );
            this.stopConnection();
          });
      }
    );
  }

  updateEmployeeRole() {
    // queries the roles and employees tables
    this.connection.query(
      `SELECT * FROM roles; SELECT * FROM employees;`,
      (err, result) => {
        if (err) throw err;
        const firstLastNames = [];
        const idFirstLast = [];
        const roleNames = [];
        // makes arrays and arrays of objects of the employee's name and id
        result[1].forEach((name) => {
          firstLastNames.push(`${name.first_name} ${name.last_name}`);
          idFirstLast.push({
            id: name.id,
            first_name: name.first_name + " " + name.last_name,
          });
        });
        // makes an array of role titles
        result[0].forEach((role) => {
          roleNames.push(role.title);
        });
        console.log(roleNames);
        // ask user questions about the employee's new role
        inquirer
          .prompt([
            {
              type: "list",
              name: "employee",
              message: "Which Employee Would You Like To Update?",
              choices: firstLastNames,
            },
            {
              type: "list",
              name: "newRole",
              message: "Which Role Does This Employee Now Have?",
              choices: roleNames,
            },
          ])
          .then((answers) => {
            // finds in the roles query which role is the user chose
            const findRole = result[0].find(
              (role) => role.title === answers.newRole
            );
            // takes that role and sets newRoleID to the role id

            const newRoleID = findRole.id;

            // finds in the idFirstLast array which employee is being updated
            const findEmployee = idFirstLast.find(
              (employee) => employee.first_name === answers.employee
            );

            // takes that employee and finds their id
            const employeeID = findEmployee.id;

            this.connection.query(
              // queries the employees table to update the employee's role
              `UPDATE employees SET role_id = ? WHERE id = ?`,
              [newRoleID, employeeID],
              (err) => {
                if (err) throw err;
                console.log(
                  `${answers.employee} has a new role of ${answers.newRole}`
                );
              }
            );
            this.stopConnection();
          });
      }
    );
  }

  viewAllRoles() {
    // queries the roles table and shows a list of roles
    this.connection.query("SELECT title FROM roles", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
    this.stopConnection();
  }

  viewAllDepartments() {
    // queries the departments table and shows a list of departments
    this.connection.query(
      "SELECT department FROM departments",
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
    this.stopConnection();
  }

  quitApp() {
    // quits the app by ending the connection
    console.log("Thanks for Searching!", "\n", "See ya!");
    this.connection.end();
  }

  stopConnection() {
    // stops the connection at the end of each function
    this.connection.end();
  }
}

module.exports = Database;
