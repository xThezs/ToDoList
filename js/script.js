function deletetask(line,id){
    const options={
        method : "delete",
    };
    fetch("http://localhost:3030/task/delete/"+id,options)
    .then(res=>{ 
        if (res.ok){
            return res.json();
        }
        else{
            return null;
        }
        })
    .then(data=>{
        if(data != null)
        line.remove();
   
    console.log(data)
    });
}
function validate(line,id){
    const options={
        method : "put",
    };
    fetch("http://localhost:3030/task/changestatus/"+id,options)
    .then(res=>{ 
        if (res.ok){
            return res.json();
        }
        else{
            return null;
        }
        })
    .then(data=>{
        if(data != null)
        line[0].classList.toggle("line");
   
    console.log(data)
    });
}

function handlingerror(error){
    //Create Pop Up
    //PopUp innertext error.tasks
    const tbody = document.querySelector("tbody");
    const template = document.querySelector("#error");
    const clone = template.content.cloneNode(true);
        let a = clone.querySelector("a");
        a.innerText=error;
        tbody.appendChild(clone);
        setTimeout(()=>Hide(),6000)
        setTimeout(()=>a.remove(),8000);

}
function Hide() {
    var error = document.getElementById("errorbox");
    error.style.opacity=0;
  }

//Read

fetch("http://localhost:3030/task/read")
.then(res=>res.json())
.then(data=>{
    for(i=0;i<data.length;i++){
            //Récup Tbody
        const tbody = document.querySelector("tbody");
        const template = document.querySelector("#task");
        let task=data[i].name;
        // Clone the new row and insert it into the table
            
        const clone = template.content.cloneNode(true);
        let td = clone.querySelectorAll("td");
        let button_val=clone.querySelector("#button_val");
        let button_del=clone.querySelector("#button_del");
        let tr=clone.querySelector("tr")
        tr.setAttribute("pk",i);
        td[0].textContent = task;
        button_val.innerText="✅";
        button_del.innerText="🗑️";
        //If Task Done 
        if(data[i].status==true){
            td[0].classList.toggle("line");
        }
        tbody.appendChild(clone);
         //Onclick Validate
         console.log(data[i].id);
         const id = data[i].id;
         button_val.onclick=()=>validate(td,id);
         //Onclick Delete
         button_del.onclick =()=> deletetask(tr,id);     
    }
console.log(data)
});
              





//Récup form pour Button submit
let todoForm = document.getElementById("form_todo");
todoForm.addEventListener("submit",Addtask);
function Addtask(e){
    //Prevent Reload
    e.preventDefault();
    //Récup Balise Task
    let task_entry = document.getElementById("task_entry");
    let task = task_entry.value;
    task=task.trim();

    let body={
        name : task
    };
    console.log(JSON.stringify(body));
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const options={
        body:JSON.stringify(body),
        method : "post",
        headers : myHeaders
    };
    console.log(options);
   
    fetch("http://localhost:3030/task/add",options).then(async (res)=>{
        //Creation Line si Response OK

        const data = await res.json();
        return {tasks:data,status : res.status};
        // switch(response){
        //     case '400'
        // }
    })
    .then(data=>{      
        //Récup Tbody
        if(data.status!=200){
            handlingerror(data.tasks);
            console.log(data.tasks);
            return;
        }
        const tbody = document.querySelector("tbody");
        const template = document.querySelector("#task");

        // Clone the new row and insert it into the table
        const clone = template.content.cloneNode(true);
        let td = clone.querySelectorAll("td");
        let button_val=clone.querySelector("#button_val");
        let button_del=clone.querySelector("#button_del");
        let tr=clone.querySelector("tr");
        tr.setAttribute("pk",data.tasks.id); 
        td[0].textContent = task;
        button_val.innerText="✅";
        button_del.innerText="🗑️";
        tbody.appendChild(clone);
        //Onclick Validate
        button_val.onclick=()=>validate(td,data.tasks.id);
        //Onclick Delete
        button_del.onclick =()=> deletetask(tr,data.tasks.id);
        
        
        console.log(data);             
    });
        
    //Vide Task
    task_entry.value=task_entry.defaultValue;
}



