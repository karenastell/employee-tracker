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

  employeesByDepartment(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })

  }

  employeesByRole(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }
  employeesByManager(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }
  addEmployee(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }
 
  addRole(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }

  addDepartment(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }

  removeEmployee(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }

  updateRole(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }

  updateManager(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }

  viewAllRoles(){
    this.connection.query("SELECT", (err, result)=>{
      if(err) throw err;
      console.table(result);
    })
  }
  quitApp() {
    console.log("Thanks for Searching!", "\n", "See ya!");
    this.connection.end();
  }
}

module.exports = Database;
