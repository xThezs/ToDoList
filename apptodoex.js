const express = require('express');
const app = express()
const port = 3000;
const mysql = require('mysql2');
// create a new MySQL connection

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

app.listen(port, function(err){
    if(err){
        console.log(err);
    } 
    console.log(`Example app listening on port ${port}`)
  })


  let tasks=[];
  connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM task", function (err, result, fields) {
      if (err) throw err;
      tasks=result;
      console.log(tasks);
    });
  });
  


let countId = tasks.length;

//Toogle Task
app.put("/task/changestatus/:id",function(req,response,next){
    const id=parseInt(req.params.id);
    const index = tasks.findIndex((task) => task.id == id);
    if(index==-1)   
    {
        response.status(404);
        response.json("Error 404 : Task not found");
        return;
    }
    tasks[index].status=!tasks[index].status;
    let stocktask=tasks[index];
    //Task Not Found

     //Handling ID not a number
    
     if(!Number.isInteger(id)){
        response.status(400);
        response.json("Error 400 : Input is not a number");
        return;
    }

    //Task Found
    response.status(200).json("La tâche "+stocktask.name+" est passé au status "+stocktask.status);
    
})

//Create Task
app.use(express.json());
app.post("/task/add",(request,response,next)=>{
    const new_task=request.body;
    const index = tasks.findIndex((task) => task.id == new_task.id);
    let  isDoublon;
    //Error Handling task ID already exist
    console.log(tasks.length);
  
    new_task.id=countId+1;
    //Handling status is not Boolean
    if(typeof(new_task.status)!="boolean"){
        response.status(400);
        response.json("Error 400 : Status is not a boolean");
        return;

    }
    
    //Handling task name already exist
    tasks.forEach((task)=>{    
        if(new_task.name==task.name){
            isDoublon=true;
        }
    })
    if(isDoublon){
        response.status(400);
        response.json("Error 400 : Task name already exist");
        return;
    }

    tasks.push(new_task);
    console.log(tasks);
    countId+=1
    response.status(200).json(new_task);
})





//Modify task
app.use(express.json());

app.put("/task/modify",(request,response,next)=>{
    let new_task=request.body;
    //Finding task Index
    const index = tasks.findIndex((task) => task.id == new_task.id);

   
    //Handling task not found
    if(index==-1)
    {
        response.status(404);
        response.json("Error 404 : Task not found");
        return;
    }

    let stocktask=tasks[index];
    tasks.splice(index,1,new_task);
    console.log(tasks[index]);
    response.status(200).json(stocktask);  
})

//Delete Task

app.delete("/task/delete/:id",(request,response,next)=>
{
    const id=parseInt(request.params.id);
    const index = tasks.findIndex((task) => task.id == id);
    let deleted_task;
    
    //Handling ID not a number
    
    if(!Number.isInteger(id)){
        response.status(400);
        response.json("Error 400 : Input is not a number");
        return;
    }
    
    
    //Handling Task not found
    if(index==-1){
        response.status(404);
        response.json("Error 404 : Task not found");
        return;
    }

    deleted_task=tasks[index];
    tasks.splice(index,1);
    console.log(tasks);
    response.status(200).json(deleted_task);
})


// Read Task
app.get("/task/:limit",(request,response,next)=>{
    const limit=parseInt(request.params.limit);

    //Handling ID not a number
        
    if(!Number.isInteger(limit)){
        response.status(400);
        response.json("Error 400 : Input is not a number");
        return;
    }

    let result=[];
    //Add task in Result
    result=tasks.splice(0,limit);

    response.status(200).json(result);
})


app.use(function(req, res, next) {
    res.status(500).send("Sorry, this route doesn't exist");
});
