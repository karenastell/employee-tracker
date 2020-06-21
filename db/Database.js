const connection = require("./connection");
const inquirer = require("inquirer");

class Database {
  constructor() {
    this.connection = connection;
  }

  viewEmployees() {
    this.connection.query(
      "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager from employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)",
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }

  // reusable function - not working so far
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

            this.connection.query(
              `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE departments.department =?`,
              [answer.choice],
              (err, result) => {
                if (err) throw err;
                console.log("answer.choice: ", answer.choice);

                // console.log("roles.title", title);

                console.table(result);
              }
            );
          });
      }
    );
  }

  employeesByRole() {
    this.connection.query(`SELECT title FROM roles`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((item) => {
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

          this.connection.query(
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE roles.title =?`,
            [answer.choice],
            (err, result) => {
              if (err) throw err;
              console.log("answer.choice: ", answer.choice);

              // console.log("roles.title", title);

              console.table(result);
            }
          );
        });
    });
  }

  // optional
  employeesByManager() {
    // filter through list to only show one choice per manager
    this.connection.query(`SELECT manager FROM employees`, (err, result) => {
      if (err) throw err;
      const list = [];
      result.forEach((item) => {
        // console.log(department.department);
        list.push(item.manager);
      });

      inquirer
        .prompt({
          type: "list",
          name: "choice",
          message: "Which Manager:",
          choices: list,
        })
        .then((answer) => {
          console.log(answer);

          this.connection.query(
            `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id) WHERE employees.manager =?`,
            [answer.choice],
            (err, result) => {
              if (err) throw err;
              console.log("answer.choice: ", answer.choice);

              console.table(result);
            }
          );
        });
    });
  }
  addEmployee() {
    this.connection.query(
      `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, employees.manager FROM employees LEFT JOIN roles ON (employees.role_id = roles.id) LEFT JOIN departments ON (roles.department_id = departments.id)`,
      (err, result) => {
        if (err) throw err;

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
              name: "manager",
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
      }
    );
  }

  addRole() {
    this.connection.query(
      `SELECT id, department FROM departments`,
      (err, result) => {
        if (err) throw err;
        const departmentList = [];
        result.forEach((department) => {
          departmentList.push(department);
        });
        console.log("department list ", departmentList);
        const departmentsArray = [];
        departmentList.forEach((department) => {
          departmentsArray.push(department.department);
        });
        console.log(departmentsArray);

        inquirer
          .prompt([
            {
              type: "input",
              name: "role",
              message: "What Role Would You Like To Add?",
            },
            {
              type: "input",
              name: "salary",
              message: "What Is The Salary For This Role?",
            },
            {
              type: "list",
              name: "department",
              message: "What Department Is This Role Associated With?",
              choices: departmentsArray,
            },
          ])
          .then((answer) => {
            let id;
            departmentList.forEach((item) => {
              if (item.department === answer.department) {
                id = item.id;
              }
            });
            const roleArray = [];
            this.connection.query(`SELECT title FROM roles`, (err, result) => {
              if (err) throw err;
              result.forEach((role) => {
                roleArray.push(role.title);
              });
              console.log("Role Array", roleArray);
              if (roleArray.includes(answer.role)) {
                console.log(
                  `The role ${answer.role} already exists.  Please add a different role name.`
                );
                this.addRole();
              } else {
                this.connection.query(
                  `INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`,
                  [answer.role, answer.salary, id],
                  (err, result) => {
                    if (err) throw err;
                    console.log(`${answer.role} was added`);
                  }
                );
              }
            });

            // console.log(id);

            // console.log(answer);
          });
      }
    );
  }

  addDepartment() {
    const departmentsArray = [];
    this.connection.query(
      `SELECT department FROM departments`,
      (err, result) => {
        if (err) throw err;
        result.forEach((department) => {
          departmentsArray.push(department.department);
        });
        // console.log(departmentsArray);
      }
    );
    inquirer
      .prompt({
        type: "input",
        name: "department",
        message: "What Department Would You Like To Add?",
      })
      .then((answer) => {
        if (departmentsArray.includes(answer.department)) {
          console.log(
            `${answer.department} already exisits. Please add a different department name.`
          );
          this.addDepartment();
        } else {
          this.connection.query(
            `INSERT INTO departments (department) VALUES (?)`,
            [answer.department],
            (err, result) => {
              if (err) throw err;
              console.log(`The deparment ${answer.department} has been added.`);
            }
          );
        }
      });
  }

  // removeEmployee() {
  //   this.connection.query("SELECT id, first_name, last_name FROM employees", (err, result) => {
  //     if (err) throw err;
  //     const list = [];
  //     result.forEach((employee)=>{
  //       list.push({id: employee.id, first_name: employee.first_name, last_name: employee.last_name})
  //     })
  //    console.log(list);
  //     const name = [];
  //    list.forEach((person)=>{

  //    })
  //   });
  // }

  updateEmployeeRole(){
this.connection.query(`SELECT * FROM roles; SELECT * FROM employees;`, (err, result) =>{
  if(err)throw err;
  console.log("result: ", result);
  
})
  }


  reupdateEmployeeRole() {
// update role_id to match the new role title/id

    // if the role changes we need to also possibly change the department
    // which ids will the role chanage affect: employees.role_id, roles.department_id
    
    // ask which employee to change the role for
    // ask which role it will change to
    // ask which department this new role is in
    // update the roles.title, employees.role.id, roles.department_id
    this.connection.query(
      `SELECT * FROM roles`, `SELECT * FROM employees`),
      (err, result) => {
        if (err) throw err;
        console.log(result);
        // const roleArray = [];
        // const firstLastArray = [];
        // const idFirstLastArray = [];
        // result.forEach((row)=>{
        //   roleArray.push(row.title);
        //   idFirstLastArray.push({
        //     id: row.id,
        //    name: row.first_name + " " + row.last_name});
        //   firstLastArray.push(row.first_name + " " + row.last_name)
        // })
        // console.log(firstLastArray);
        // console.log(roleArray);
        // console.log(idFirstLastArray);
        
        inquirer.prompt([
          {
            type: "list",
            name: "employee",
            message: "Which Employee Would You Like To Update?",
            choices: firstLastArray,
          },
          {
            type: "list",
            name: "newRole",
            message: "Which Role Does This Employee Now Have?",
            choices: roleArray
          }
        ]).then((answers)=>{
          console.log(answers);
          console.log("answers.employee", answers.employee);
          
  //         const employeesRoleId = idFirstLastArray.find((name)=> {
  //           name.name === answers.employee;
  //         })
    
  // console.log("find: ", employeesRoleId);
  
          // this.connection.query(`UPDATE employees SET role_id = ? WHERE id = ?` [])
        });
      }
    ;
  }

  viewAllRoles() {
    this.connection.query("SELECT title FROM roles", (err, result) => {
      if (err) throw err;
      console.table(result);
    });
  }

  viewAllDepartments() {
    this.connection.query(
      "SELECT department FROM departments",
      (err, result) => {
        if (err) throw err;
        console.table(result);
      }
    );
  }
  quitApp() {
    console.log("Thanks for Searching!", "\n", "See ya!");
    this.connection.end();
  }
}

module.exports = Database;
