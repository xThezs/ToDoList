var express = require('express');
var cors = require('cors');

const app = express()
const port = 3030;
const mysql = require('mysql2');
app.use(
  cors({
  origin : [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  ]
  }
  ));

// create a new MySQL connection
const database=require("./database.js");
const connection=database.connection;

app.listen(port, function(err){
    if(err){
        console.log(err);
    } 
    console.log(`Example app listening on port ${port}`)
  })     
      // app.get("/tasks",(req,res)=>{
      //   database.getAllTasks((tasks)=>{
      //       res.json(tabtaks);
      //       console.log(tasks);
      //     });
      // })
      // connection.query("SELECT * FROM task ", function (err, result, fields) {
      //   if (err) throw err;
      //   tasks=result;
      //   console.log(result);
      // });

//Toogle Task
app.put("/task/changestatus/:id",function(req,response,next){
  const id=parseInt(req.params.id);
  //Handling ID not a number
  if(isNaN(id)){
    response.status(400);
    response.json("Error 400 : Input is not a number");
    return;
  }
  connection.execute('SELECT * FROM Task WHERE id=?;',[id],(err, results, fields) => {
    // Check for error
    if (err) console.log (err);
    let task=results;
    console.log(results); 
    
    //Task Not Found
    if(task.length==0)   
    {
      response.status(404);
      response.json("Error 404 : Task not found");
      return;
    }
    //Task Found 
    let statuschange=task[0].status;
    statuschange=!statuschange;
    connection.execute('UPDATE Task SET status=? WHERE id=?;',    [statuschange,id],(err, results, fields) => {
      // Check for error
      if (err) console.log (err);
      
      console.log(results); 
      response.status(200).json("La tâche "+id+" est passé au status "+statuschange);
      }
    );
  })
});

//Modify task
app.use(express.json());

app.put("/task/modify",(request,response,next)=>{
  let new_task=request.body;
  let id=parseInt(new_task.id);
  //Handling ID not a number
  if(isNaN(id)){
  response.status(400);
  response.json("Error 400 : Input is not a number");
  return;
  }
  //Request without Status Data
  if(new_task.status==undefined){
    response.status(400);
    response.json("Error 400 : There is no status data in your request");
  }
  //Request without Name Data
  if(new_task.name==undefined){
    response.status(400);
    response.json("Error 400 : There is no name data in your request");
  }

  connection.execute('SELECT * FROM Task WHERE id=?;',    [id],(err, results, fields) => {
    // Check for error
    if (err) console.log (err);
    let task=results;
    console.log(results); 
    
    //Task Not Found
    if(task.length==0)   
    {
      response.status(404);
      response.json("Error 404 : Task not found");
      return;
    }
    //Handling status is not Boolean
    if(typeof(new_task.status)!="boolean"){
      response.status(400);
      response.json("Error 400 : Status is not a boolean");
      return;
    }  
    //Handling task name already exist
    //Modifying Task 
    connection.execute('UPDATE Task SET name=? , status=? WHERE id=?;',    
    [new_task.name,new_task.status,id],(err, results, fields) => {
        // Check for error
        if (err) console.log (err);
        
        console.log(results); 
        response.status(200).json("La tâche a été modifié ");
      }
    );
  })
})
//Delete Task
app.delete("/task/delete/:id",(request,response,next)=>
{
  const id=parseInt(request.params.id);
  //Handling ID not a number
  if(isNaN(id)){
    response.status(400);
    response.json("Error 400 : Input is not a number");
    return;
    }
  connection.execute('SELECT * FROM Task WHERE id=?;',[id],(err, results, fields) => {
    // Check for error
    if (err) console.log (err);
    let task=results;
    console.log(results); 
    
    //Task Not Found
    if(task.length==0)   
    {
      response.status(404);
      response.json("Error 404 : Task not found");
      return;
    }
    //Task Found 
    connection.execute('DELETE FROM Task WHERE id=?;',    [id],(err, results, fields) => {
      // Check for error
      if (err) console.log (err);
      
      console.log(results); 
      response.status(200).json("La tâche "+id+" a été supprimé ");
      }
    );
  })
})

// Read Task
app.get("/task/read",(request,response,next)=>{
  const limit=parseInt(request.params.limit);
  connection.execute('SELECT * FROM Task ;',(err, results, fields) => {
    // Check for error
    if (err) console.log (err);
    console.log(results); 
    response.status(200).json(results);
  });
  
})

//Create Task
app.use(express.json());
app.post("/task/add",(request,response,next)=>{
  const new_task=request.body;
  console.log(new_task);
  //Request without Name Data
  if(new_task.name==undefined){
    response.status(400);
    response.json("There is no name data in your request");
    return;
  }
  console.log(new_task.name.length);
  if(new_task.name.length<5){
    response.status(400);
    response.json("Please use at least 5 characters for your task");
    return;
  }

  //Handling Name Already Exist
  connection.execute('SELECT * FROM Task WHERE name=?;',[new_task.name],(err, results, fields) => {
    // Check for error
    if (err) console.log (err);
    console.log(results);
    let task=results;
    if(task.length!=0){
      response.status(400);
      response.json("Task name already exist");
      return;
    } 
    //Creating Task
    connection.execute('INSERT INTO Task(name) VALUES (?);',    
    [new_task.name],(err, results, fields) => {
      // Check for error
      if (err) console.log (err);
      console.log(results); 
      response.status(200).json(
      {id:results.insertId,
      message:"La tâche a été inséré"
      });
    });
  })
})

app.use(function(req, res, next) {
  res.status(500).send("Sorry, this route doesn't exist");
});




