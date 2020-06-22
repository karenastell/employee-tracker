const connection = require("./connection");
const inquirer = require("inquirer");

class Database {
  constructor() {
    this.connection = connection;
  }

  viewEmployees() {
    this.connection.query(
      "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager from employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)",
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }

  // reusable function - not working so far
  viewBy(column, table, message) {
    this.connection.query(`SELECT ${column} FROM ${table}`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((item) => {
        // console.log(department.department);
        list.push(item.column);
      });
      inquirer
        .prompt({
          type: "list",
          name: "choice",
          message: `Which ${message}:`,
          choices: list,
        })
        .then((answer) => {
          console.log(answer);
        });
    });
  }

  employeesByDepartment() {
    // this.viewBy(department, departments, Department)
    this.connection.query(
      `SELECT department FROM departments`,
      (err, result) => {
        if (err) throw err;
        const list = [];
        result.forEach((item) => {
          // console.log(department.department);
          list.push(item.department);
        });

        inquirer
          .prompt({
            type: "list",
            name: "choice",
            message: "Which Department:",
            choices: list,
          })
          .then((answer) => {
            console.log(answer);

            this.connection.query(
              `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE departments.department =?`,
              [answer.choice],
              (err, result) => {
                if (err) throw err;
                console.log("answer.choice: ", answer.choice);

                // console.log("roles.title", title);

                console.table(result);
              }
            );
          });
      }
    );
  }

  employeesByRole() {
    this.connection.query(`SELECT title FROM roles`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((item) => {
        list.push(item.title);
      });

      inquirer
        .prompt({
          type: "list",
          name: "choice",
          message: "Which Role:",
          choices: list,
        })
        .then((answer) => {
          console.log(answer);

          this.connection.query(
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE roles.title =?`,
            [answer.choice],
            (err, result) => {
              if (err) throw err;
              console.log("answer.choice: ", answer.choice);

              // console.log("roles.title", title);

              console.table(result);
            }
          );
        });
    });
  }

  // optional
  employeesByManager() {
    // filter through list to only show one choice per manager
    this.connection.query(`SELECT manager FROM employees`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((item) => {
        // console.log(department.department);
        list.push(item.manager);
      });

      inquirer
        .prompt({
          type: "list",
          name: "choice",
          message: "Which Manager:",
          choices: list,
        })
        .then((answer) => {
          console.log(answer);

          this.connection.query(
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE employees.manager =?`,
            [answer.choice],
            (err, result) => {
              if (err) throw err;
              console.log("answer.choice: ", answer.choice);

              console.table(result);
            }
          );
        });
    });
  }

  addEmployee() {
    // get employee's information
    //    first_name
    //    last_name
    //    manager
    //    title
    this.connection.query(
      `SELECT first_name, last_name, role_id FROM employees; SELECT * FROM roles;`,
      (err, result) => {
        const nameArray = ["No Manager"];
        const roleArray = [];
        const idTitleArray = [];

        if (err) throw err;
        result[0].forEach((person) => {
          nameArray.push(`${person.first_name} ${person.last_name}`);
        });
        result[1].forEach((role) => {
          roleArray.push(`${role.title}`);
        });
        console.log(nameArray);
        console.log(roleArray);

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
            console.log(answers);
            console.log(result[1]);
            if (answers.manager === "No Manager") {
              answers.manager = null;
            }
            const findRole = result[1].find(
              (role) => role.title === answers.title
            );
            console.log("findRole", findRole);

            const roleID = findRole.id;
            console.log(roleID);

            this.connection.query(
              `INSERT INTO employees (first_name, last_name, role_id, manager) VALUES (?, ?, ?, ?)`,
              [answers.first_name, answers.last_name, roleID, answers.manager],
              (err, result) => {
                if (err) throw err;
                console.log(result);
                console.log(
                  `${answers.first_name} ${answers.last_name} was added`
                );
              }
            );
          });
      }
    );
  }

  addRole() {
    this.connection.query(
      `SELECT id, department FROM departments`,
      (err, result) => {
        if (err) throw err;
        const departmentList = [];
        result.forEach((department) => {
          departmentList.push(department);
        });
        console.log("department list ", departmentList);
        const departmentsArray = [];
        departmentList.forEach((department) => {
          departmentsArray.push(department.department);
        });
        console.log(departmentsArray);

        inquirer
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
            departmentList.forEach((item) => {
              if (item.department === answer.department) {
                id = item.id;
              }
            });
            const roleArray = [];
            this.connection.query(`SELECT title FROM roles`, (err, result) => {
              if (err) throw err;
              result.forEach((role) => {
                roleArray.push(role.title);
              });
              console.log("Role Array", roleArray);
              if (roleArray.includes(answer.role)) {
                console.log(
                  `The role ${answer.role} already exists.  Please add a different role name.`
                );
                this.addRole();
              } else {
                this.connection.query(
                  `INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`,
                  [answer.role, answer.salary, id],
                  (err, result) => {
                    if (err) throw err;
                    console.log(`${answer.role} was added`);
                  }
                );
              }
            });

            // console.log(id);

            // console.log(answer);
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
        result.forEach((department) => {
          departmentsArray.push(department.department);
        });
        // console.log(departmentsArray);
      }
    );
    inquirer
      .prompt({
        type: "input",
        name: "department",
        message: "What Department Would You Like To Add?",
      })
      .then((answer) => {
        if (departmentsArray.includes(answer.department)) {
          console.log(
            `${answer.department} already exisits. Please add a different department name.`
          );
          this.addDepartment();
        } else {
          this.connection.query(
            `INSERT INTO departments (department) VALUES (?)`,
            [answer.department],
            (err, result) => {
              if (err) throw err;
              console.log(`The deparment ${answer.department} has been added.`);
            }
          );
        }
      });
  }

  removeEmployee() {
    this.connection.query(
      `SELECT id, first_name, last_name FROM employees;`,
      (err, result) => {
        if (err) throw err;
        const idNames = [];
        const names = [];
        result.forEach((employee) => {
          idNames.push({
            id: employee.id,
            name: `${employee.first_name} ${employee.last_name}`,
          });
          names.push(`${employee.first_name} ${employee.last_name}`);
        });
        console.log(idNames);
        console.log(names);
        inquirer
          .prompt([
            {
              type: "list",
              name: "employee",
              message: "Which Employee Would You Like To Remove?",
              choices: names,
            },
          ])
          .then((answer) => {
            const findEmployee = idNames.find(
              (employee) => employee.name === answer.employee
            );
            console.log(findEmployee);
            const id = findEmployee.id;
            this.connection.query(`DELETE FROM employees WHERE id = ?`, [id], (err)=>{
              if(err) throw err;
              console.log(`${answer.employee} has been removed`);
              
            })
          });
      }
    );
  }

  updateEmployeeRole() {
    this.connection.query(
      `SELECT * FROM roles; SELECT * FROM employees;`,
      (err, result) => {
        if (err) throw err;
        console.log("result: ", result);
        const firstLastNames = [];
        const idFirstLast = [];
        const roleNames = [];
        result[1].forEach((name) => {
          firstLastNames.push(`${name.first_name} ${name.last_name}`);
          idFirstLast.push({
            id: name.id,
            first_name: name.first_name + " " + name.last_name,
          });
        });
        console.log(idFirstLast);
        console.log(firstLastNames);
        result[0].forEach((role) => {
          roleNames.push(role.title);
        });
        console.log(roleNames);

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
            console.log(answers);

            const findRole = result[0].find(
              (role) => role.title === answers.newRole
            );
            console.log(findRole);

            const newRoleID = findRole.id;
            console.log(newRoleID);

            const findEmployee = idFirstLast.find(
              (employee) => employee.first_name === answers.employee
            );

            console.log(findEmployee);
            const employeeID = findEmployee.id;

            this.connection.query(
              `UPDATE employees SET role_id = ? WHERE id = ?`,
              [newRoleID, employeeID],
              (err) => {
                if (err) throw err;
                console.log(
                  `${answers.employee} has a new role of ${answers.newRole}`
                );
              }
            );
          });
      }
    );
  }

  viewAllRoles() {
    this.connection.query("SELECT title FROM roles", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }

  viewAllDepartments() {
    this.connection.query(
      "SELECT department FROM departments",
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }
  quitApp() {
    console.log("Thanks for Searching!", "\n", "See ya!");
    this.connection.end();
  }
}

module.exports = Database;
