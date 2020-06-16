const connection = require("./connection");

class Database {
  constructor() {
    this.connection = connection;
  }

  testFunction() {
    console.log("connected to Database.js");
  }

  viewEmployee() {
   this.connection.query("SELECT * FROM employees", (err, result)=>{
     if(err) throw err;
     console.log(result);
     
   })
     
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
}

module.exports = Database;
