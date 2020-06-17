const connection = require("./connection");

class Database {
  constructor() {
    this.connection = connection;
  }

  testFunction() {
    console.log("connected to Database.js");
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

  createDepartments() {
    return this.connection.query("SELECT");
  }
  createEmployee() {
    return this.connection.query(SELECT);
  }
  createRole() {
    return this.connection.query(SELECT);
  }

  findDepartment() {
    return this.connection.query(SELECT);
  }
  findEmployee() {
    return this.connection.query(SELECT);
  }
  findRole() {
    return this.connection.query(SELECT);
  }

  updateDepartment() {
    return this.connection.query(SELECT);
  }
  updateEmployee() {
    return this.connection.query(SELECT);
  }
  updateRole() {
    return this.connection.query(SELECT);
  }

  quitApp() {
    console.log("Thanks for Searching!", "\n", "See ya!");
    this.connection.end();
  }
}

module.exports = Database;
