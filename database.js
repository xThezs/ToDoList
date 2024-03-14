const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'todolist',
    password: '6Ty97I6/_JS14dUh',
    database: 'todolist'
  });

  // connect to the MySQL database
connection.connect((error) => {
    if (error) {
      console.error('Error connecting to MySQL database:', error);
    } else {
      console.log('Connected to MySQL database!');
    }
  });

module.exports.getAllTasks =  (then)=>{
    connection.query("SELECT * FROM Task",(error,results)=>{
        then(results);
    });
}
    
  module.exports.connection=connection;
