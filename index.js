const inquirer = require("inquirer");
const Database = require("./db/Database");
const cTable = require("console.table")
const db = new Database;


db.testFunction();

const startQuestionsArray = [
  {
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      "View All Employees.",
      "View All Employees By Department",
      "View all Employees By Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee manager",
      "View All Roles",
    ],
  },
];

const addEmployeeArray = [
    {
        type: "input",
        name: "first_name",
        message: "What is the empolyee's first name?"
    },
    {
        type: "input",
        name: "last_name",
        message: "What is the empolyee's last name?"
    },
    {
        type: "list",
        name: "role",
        message: "What is the empolyee's role?",
        choices: [
            "Sales Lead",
            "Salesperson",
            "Lead Engineer",
            "Software Engineer",
            "Account Manager",
            "Accountant",
            "Legal Team Lead",
            "Lawyer"
        ]
    },
    {
        type: "list",
        name: "manager",
        message: "Who is the empolyee's manager?",
        choices: [
          "None"
        ]
    },
]



// if statments to handle the choices to call a specific function
// if the user selects to view Employees, it is going to call the getEmployees function down below
// call the findEmployees function from the Database class that we created
