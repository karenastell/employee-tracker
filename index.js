const inquirer = require("inquirer");
const Database = require("./db/Database");
// const cTable = require("console.table");
// const connection = require("./db/connection");
const db = new Database();

// inquirer questions on start
const startQuestionsArray = [
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
      "Update Employee Manager",
      "View All Roles",
      "Quit",
    ],
  },
];

const addEmployeeArray = [
  {
    type: "input",
    name: "first_name",
    message: "What is the empolyee's first name?",
  },
  {
    type: "input",
    name: "last_name",
    message: "What is the empolyee's last name?",
  },
  {
    type: "list",
    name: "role",
    message: "What is the empolyee's role?",
    choices: [],
  },
  {
    type: "list",
    name: "manager",
    message: "Who is the empolyee's manager?",
    choices: ["None"],
  },
];

// ask the user what they want to do and execute the cooresponding function
const startApp = () => {
  inquirer.prompt(startQuestionsArray).then((answer) => {
    if (answer.choice === "View All Employees") {
      db.viewEmployees();
    } else if (answer.choice === "View All Employees By Department") {
      db.employeesByDepartment();
    } else if (answer.choice === "View All Employees By Role") {
      db.employeesByRole();
    } else if (answer.choice === "View All Employees By Manager") {
      db.employeesByManager();
    } else if (answer.choice === "Add Employee") {
      db.addEmployee();
    } else if (answer.choice === "Add Role") {
      db.addRole();
    } else if (answer.choice === "Add Department") {
      db.addDepartment();
    } else if (answer.choice === "Remove Employee") {
      db.removeEmployee();
    } else if (answer.choice === "Update Employee Role") {
      db.updateRole();
    } else if (answer.choice === "Update Employee Manager") {
      db.updateManager();
    } else if (answer.choice === "View All Roles") {
      db.viewAllRoles();
    } else {
      db.quitApp();
    }
    startApp();
  });
};

startApp();
