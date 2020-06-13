const inquirer = require("inquirer");
const Database = require("./db/Database");


// create a prompt when the app is started
// this will ask the user what they'd like to do
// choices: [
//     {
//         name:
//         value:
//     }
// ] 

// if statments to handle the choices to call a specific function
// if the user selects to view employees, it is going to call the getEmployees function down below
// call the findEmployees function from the Database class that we created 