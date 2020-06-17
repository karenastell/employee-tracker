const connection = require("./connection");

class Database {
  constructor() {
    this.connection = connection;
  }

  testFunction() {
    console.log("connected to Database.js");
  }

  viewEmployees() {
    this.connection.query("SELECT * FROM employees", (err, result) => {
      if (err) throw err;
      result.forEach((row) => {
        console.log(row.first_name, row.last_name);
      });
    });
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
