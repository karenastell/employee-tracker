const mysql = require("mysql");
require("dotenv").config();


const connection = mysql.createConnection({
  multipleStatements: true,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  // console.log("database connected");
  
});

module.exports = connection;