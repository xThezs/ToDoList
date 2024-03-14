// Check le submit d'un text 
//Gestion Erreur d'entrée (texte_vide)
//Entré d'une ligne de tableau td tr
//Il faut un bouton validé ou suppr sur les lignes


//Récup form pour Button submit
let todoForm = document.getElementById("form_todo");

todoForm.addEventListener("submit",Addtask);

function Addtask(e){
    //Prevent Reload
    e.preventDefault();


    //Récup Balise Task
    let task_entry = document.getElementById("task_entry");
    let task = task_entry.value;

    //Récup Tbody
    let tbody = document.querySelector("#tbody");

    //Creation des Elements pour la task
    let tr=document.createElement("tr");
    let task_td=document.createElement("td");
    let button_val=document.createElement("button");
    let button_del=document.createElement("button");

    //Gestion tr
    tr.classList.add("row");
    
    //Gestion td
    task_td.innerText=task;
    task_td.classList.add("col-9");
    task_td.classList.add("tasks");

    //Gestion Validate
    //button_val.innerHTML=`<i class="far fa-trash-alt"></i>`;
    button_val.innerText="✅";
    button_val.classList.add("validate");
    button_val.classList.add("btn");
    button_val.classList.add("btn-success");
    button_val.classList.add("col-1");
    //Onclick Validate
    button_val.onclick= function validate(){
            task_td.classList.toggle("line");
    }

    //Gestion Delete
    //button_del.innerHTML="<i class="far fa-trash-alt"></i>";
    button_del.innerText="DEL";
    button_del.classList.add("delete");
    button_del.classList.add("col-1");
    button_del.classList.add("btn");
    button_del.classList.add("btn-danger");
    //Onclick Delete
    button_del.onclick= function deletetask(){
       tr.remove();
    }


    //Append Child
    tbody.appendChild(tr);
    tr.appendChild(task_td);
    tr.appendChild(button_val);
    tr.appendChild(button_del);

    //Vide Task
    task_entry.value=task_entry.defaultValue;
}
