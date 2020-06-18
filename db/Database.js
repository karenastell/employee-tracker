const connection = require("./connection");
const inquirer = require("inquirer");

class Database {
  constructor() {
    this.connection = connection;
  }

  viewEmployees() {
    this.connection.query(
      "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager_id from employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)",
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }

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
              `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager_id FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE departments.department =?`,
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
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager_id FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE roles.title =?`,
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

  employeesByManager() {
    // filter through list to only show one choice per manager
    this.connection.query(`SELECT manager_id FROM employees`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((item) => {
        // console.log(department.department);
        list.push(item.manager_id);
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
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager_id FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE employees.manager_id =?`,
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
    this.connection.query(
      `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager_id FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)`,
      (err, result) => {
        if (err) throw err;

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
              type: "choice",
              name: "manager_id",
              message: "Who Is The Employee's Manager?",
              choices: ["choice 1", "choice 2", "choice 3"],
            },
            {
              type: "choice",
              name: "title",
              message: "What Is The Employee's Role?",
              choices: ["choice 1", "choice 2", "choice 3"],
            },
          ])
          .then((answers) => {
            console.log(answers);
          });
      }
    );
  }

  addRole() {
    this.connection.query(`SELECT department_id FROM roles`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((row) => {
        list.push(row.department_id);
      });
      console.log(list);
      // role is going in, why won't it ask the other questions?
      inquirer
        .prompt(
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
            name: "department_id",
            message: "What Department Is This Role Associated With?",
            choices: list,
          }
        )
        .then((answer) => {
          this.connection.query(
            `INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`,
            [answer.role, answer.salary, answer.department_id],
            (err, result) => {
              if (err) throw err;
              console.log(result);
            }
          );
        });
    });
  }

  addDepartment() {
    inquirer.prompt({
      type: "input",
      name: "department",
      message: "What Department Would You Like To Add?",
    }).then((answer)=>{
      console.log(department);
      
      this.connection.query(
      "INSERT INTO departments (department) VALUES (?)",[answer.department],
      (err, result) => {
        if (err) throw err;
        console.log(`Department ${answer.department} has been added.`);
        
      }
    );
    });
    
  }

  removeEmployee() {
    this.connection.query("SELECT id, first_name, last_name FROM employees", (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((employee)=>{
        list.push({id: employee.id, first_name: employee.first_name, last_name: employee.last_name})
      })
     console.log(list);
      const name = [];
     list.forEach((person)=>{
      
     })
    });
  }

  updateRole() {
    this.connection.query("SELECT", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }

  updateManager() {
    this.connection.query("SELECT", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }

  viewAllRoles() {
    this.connection.query("SELECT", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }
  quitApp() {
    console.log("Thanks for Searching!", "\n", "See ya!");
    this.connection.end();
  }
}

module.exports = Database;
