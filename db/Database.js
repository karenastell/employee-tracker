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
          });
      }
    );
  }

  employeesByRole() {
    this.connection.query(`SELECT title FROM roles`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((item) => {
        // console.log(department.department);
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
        });
    });
  }

  employeesByManager() {
    this.connection.query("SELECT ", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }
  addEmployee() {
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

    // this.connection.query("SELECT", (err, result) => {
    //   if (err) throw err;
    //   console.table(result);
    // });
  }

  addRole() {
    this.connection.query("SELECT", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }

  addDepartment() {
    this.connection.query("SELECT", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }

  removeEmployee() {
    this.connection.query("SELECT", (err, result) => {
      if (err) throw err;
      console.table(result);
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
