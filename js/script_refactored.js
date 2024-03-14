

App.start();


class App{
    static start(){
        //Read
        App.printAllTasks();
        //Récup form pour Button submit
        let todoForm = document.getElementById("form_todo");
        todoForm.addEventListener("submit",App.onAddtask);
    }

    static printAllTasks(){
        fetch("http://localhost:3030/task/read")
        .then(res=>res.json())
        .then(tasks=>{
            tasks.forEach((task,i)=>{
                
                const taskName = task.name;
                
                // Récupération des balises
                const tasksContainer = document.querySelector("tbody");
                const template = document.querySelector("#task");
                // Clone the new row and insert it into the table
                const newTask = template.content.cloneNode(true);
                let tds = newTask.querySelectorAll("td");
                let button_val=newTask.querySelector("#button_val");
                let button_del=newTask.querySelector("#button_del");
                let tr=newTask.querySelector("tr");

                // Modification du contenu des balises
                tr.setAttribute("pk",i);
                tds[0].textContent = taskName;
                button_val.innerText="✅";
                button_del.innerText="DEL";
                //If Task Done
                if(task.status==true){
                    tds[0].classList.toggle("line");
                }


                // Affichage de la nouvelle tache
                tasksContainer.appendChild(newTask);

                button_val.onclick=()=>App.validate(td,task.id);
                //Onclick Delete
                button_del.onclick =()=> App.deletetask(tr,task.id);     
            })
            
        console.log(tasks)
        });
    }

    static onAddtask(e){
        //Prevent Reload
        e.preventDefault();
        //Récup Balise Task
        let task_entry = document.getElementById("task_entry");
        let task = task_entry.value;
    
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
                console.log(App);
                App.popup(data.tasks);
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
            button_del.innerText="DEL";
            tbody.appendChild(clone);
            //Onclick Validate
            button_val.onclick=()=>App.validate(td,data.tasks.id);
            //Onclick Delete
            button_del.onclick =()=> App.deletetask(tr,data.tasks.id);
            
            
            console.log(data);             
        });
            
        //Vide Task
        task_entry.value=task_entry.defaultValue;
    }
    static deletetask(line,id){
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
    static validate(line,id){
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
    static popup(error){
        //Create Pop Up
        //PopUp innertext error.tasks
        const tbody = document.querySelector("tbody");
        const template = document.querySelector("#error");
        const clone = template.content.cloneNode(true);
        let div = clone.querySelector("div");
        div.innerText=error;
        tbody.appendChild(clone);
        setTimeout(()=>div.remove(),10000);
    
    }
}
