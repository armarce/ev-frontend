let  listTasks = () =>{
    
    let token = localStorage.getItem('token');
    //console.log(token);
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + token);
    
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch("https://tasks-crud.academlo.com/api/tasks", requestOptions)
      .then(response => response.json())
      .then(tasks => {
        let tasksContainer = document.getElementById("tasks");
        let html = '';

        for(let task of tasks){
            
            let taskClass = '';
            let options = '';


            switch(task.status_id){

                case 1: 
                
                taskClass = 'start'; 
                options = `<option value="1" selected>Iniciada</option>
                <option value="2">En pausa</option>
                <option value="3">Terminada</option>`;
                
                break;                

                case 2: 
                
                taskClass = 'paused'; 
                options = `<option value="1">Iniciada</option>
                <option value="2" selected>En pausa</option>
                <option value="3">Terminada</option>`;
                
                break;
            
                case 3: 
                
                taskClass = 'end'; 
                options = `<option value="1">Iniciada</option>
                <option value="2">En pausa</option>
                <option value="3" selected>Terminada</option>
                `;   
                
                break;

                default:

                taskClass = 'start'; 
                options = `<option value="1" selected>Iniciada</option>
                <option value="2">En pausa</option>
                <option value="3">Terminada</option>
                `;

            }


            html += `
            <li class="${taskClass}">
                <nav>
                    <h2>${task.name}</h2>
                    <div>
                        <a href="#" class="del" onclick="deleteTask(${task.id});"></a>
                        <a href="#" class="edit" onclick="editTask(${task.id});"></a>
                    </div>
                </nav>
                <span>DESCRIPCIÓN</span>
                <p>${task.description}</p>
                <select onchange="updateStatus(${task.id}, this[selectedIndex].value);">
                    ${options}
                </select>
            </li>`;

        }

        tasksContainer.innerHTML = html;

      })
      .catch(error => console.log('error', error));

}

let updateStatus = (id, id_status) => {

    let token = localStorage.getItem('token');
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + token);
    
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch(`https://tasks-crud.academlo.com/api/tasks/${id}/status/${id_status}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        listTasks();
      })
      .catch(error => console.log('error', error));    

}

let deleteTask = (id) =>{

    let token = localStorage.getItem('token');
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + token);

    var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(`https://tasks-crud.academlo.com/api/tasks/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
        listTasks();

    })
    .catch(error => console.log('error', error));

}

let editTask = (id) =>{
    
    let modalContainer = document.getElementById("modal");
    modalContainer.style.display = 'block';

    let token = localStorage.getItem('token');
    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + token);
    
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch(`https://tasks-crud.academlo.com/api/tasks/${id}`, requestOptions)
      .then(response => response.json())
      .then(task => {

        let modal = `
                    <div id="modal-container">
                    <a id="close">
                    </a>
                    <h2>Editar tarea</h2>
                    <form>
                        <fieldset>
                            <label for="name">Nombre de la tarea</label>
                            <input type="input" placeholder="Escribe el nombre de la tarea" value="${task.name}"/>
                            <span id="name-counter">0/50</span>
                            <label for="description">Descripción</label>
                            <textarea name="description" placeholder="Escribe la descripción de la tarea">${task.description}</textarea>
                            <span id="description-counter">0/150</span>
                            <div id="btns">
                                <input type="submit" name="cancel" value="Cancelar"/>
                                <input type="submit" name="save" value="Guardar cambios"/>
                            </div>
                            <input type="hidden" name="id" value="${task.id}"/>
                        </fieldset>
                    </form>
                </div>`;

            modalContainer.innerHTML = modal;


      })
      .catch(error => console.log('error', error));
    



}

let login = () =>{

    document.querySelector("#log-in form").addEventListener("submit", function(event) {
    let email = document.querySelector("#log-in form input[name=email]").value;
    let password = document.querySelector("#log-in form input[name=password]").value;

    let myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    
    let urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);
    
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    
    fetch("https://tasks-crud.academlo.com/api/auth/login", requestOptions)
        .then(response => response.text())
        .then(result => {
        localStorage.setItem('token', result);
        window.location.replace('tasks.html');
    }).catch(error => console.log('error', error));

    event.preventDefault();
    });
    
}