const inquirer = require("inquirer");
const Database = require("./db/Database");
const cTable = require("console.table");
const db = new Database();



// ask the user what they want to do and execute the cooresponding function
// connection will end after the user is finished with that one question because I couldn't figure out how to restart the app... I think it has to do with async functions
const startApp =()=> {
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
          "View all Employees By Manager",
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
    .then((answer) =>{
        if (answer.choice === "View All Employees") {
          db.viewEmployees();
          quitApp();
        } else if (answer.choice === "View All Employees By Department") {
          db.employeesByDepartment();
          quitApp();
        } else if (answer.choice === "View All Employees By Role") {
          db.employeesByRole();
          quitApp();
        } else if (answer.choice === "View all Employees By Manager") {
          db.employeesByManager();
          quitApp();
        } else if (answer.choice === "Add Employee") {
          db.addEmployee();
          quitApp();
        } else if (answer.choice === "Add Role") {
          db.addRole();
          quitApp();
        } else if (answer.choice === "Add Department") {
          db.addDepartment();
          quitApp();
        }
        else if (answer.choice === "Remove Employee") {
          db.removeEmployee();
          quitApp();
        }
        else if (answer.choice === "Update Employee Role") {
          db.updateEmployeeRole();
          quitApp();
        } else if (answer.choice === "View All Roles") {
          db.viewAllRoles();
          quitApp();
        } else if (answer.choice === "View All Departments") {
          db.viewAllDepartments();
          quitApp();
        } else {
          db.quitApp();
        }
      }
    );
}

// calls the function to begin the app
startApp();
