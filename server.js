const inquirer = require("inquirer");
const Database = require("./db/Database");
const cTable = require("console.table");
const db = new Database();

// ask the user what they want to do and execute the cooresponding function
// connection will end after the user is finished with that one question because I couldn't figure out how to restart the app... I think it has to do with async functions
const startApp = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Role",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Remove Employee",
          "Update Employee Role",
          "View All Roles",
          "View All Departments",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      if (answer.choice === "View All Employees") {
        db.viewEmployees();
      } else if (answer.choice === "View All Employees By Department") {
        db.employeesByDepartment();
      } else if (answer.choice === "View All Employees By Role") {
        db.employeesByRole();
      } else if (answer.choice === "Add Employee") {
        db.addEmployee();
      } else if (answer.choice === "Add Role") {
        db.addRole();
      } else if (answer.choice === "Add Department") {
        db.addDepartment();
      } else if (answer.choice === "Remove Employee") {
        db.removeEmployee();
      } else if (answer.choice === "Update Employee Role") {
        db.updateEmployeeRole();
      } else if (answer.choice === "View All Roles") {
        db.viewAllRoles();
      } else if (answer.choice === "View All Departments") {
        db.viewAllDepartments();
      } else {
        db.quitApp();
      }
    });
};

// calls the function to begin the app
startApp();
