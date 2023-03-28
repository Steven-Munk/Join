/**
 * This function is used to render the tasks on board.html
 *
 * @param {object} task
 * @param {object} epic
 */

function renderTask(task, epic) {
  return /*html*/ `
      <div onclick="openCard('${task["id"]}')" draggable="true" ondragstart="startDragging('${task["id"]}')" class="task-card">
      <span class="epic ${epic["color"]}">${epic["name"]}</span>
      <h4 class="task-name">${task["title"]}</h4>
      <p class="task-description">${task["description"]}</p>
      <div id="subtasks${task["id"]}" class="d-flex-jc-sb w-100">
      </div>
      <div class="d-flex-jc-sb w-100">
          <div id="assigned${task["id"]}" class="contacts">
          </div><img src="assets/${task["prio"]}.svg">
      </div>
  </div>`;
}

/**
 * This function is used to render the tasks on the opened card board.html
 *
 * @param {object} task
 * @param {object} epic
 */

function renderTaskCard(task, epic) {
  return /*html*/ `
      <div onclick="dontClose(event)" id="edit-area" class="task-card">
      <span style="transform: scale(0.8); position: relative; right: 15px;" class="epic ${epic["color"]}">${epic["name"]}</span>
      <h4 class="task-name">${task["title"]}</h4>
      <p class="task-description">${task["description"]}</p>
        <div id="mobile-column-btns-container">
        <span onclick="changeCategory('todo')" class="mobile-column-btn todo">Todo</span>
        <span onclick="changeCategory('progress')" class="mobile-column-btn progress">In Progress</span>
        <span onclick="changeCategory('feedback')" class="mobile-column-btn feedback">Feedback</span>
        <span onclick="changeCategory('done')" class="mobile-column-btn done">Done</span>
      </div>
      <div class="wrapper">
      <div style="padding-bottom: 40px;">
      <div><span>Due date:</span> ${task["dueDate"]}</div>
      <div><span>Priotity:</span><span class="priority ${task["prio"]}">${task["prio"]}<img class="prio_img" src="assets/${task["prio"]}.svg"</img></span></div>
      <div  id="contacts-on-card"><span>Assigned To:</span><div id="assignedCard${task["id"]}">
      </div> </div>
  </div> 
  <div id="openCardSubtasks">
  </div>
   <img onclick="closeCard('${task["id"]}')" class="close-btn" src="assets/close.svg"</img>
  <img onclick="openCardEdit('${task["id"]}')" class="edit-btn" src="assets/pencil-filled-square.svg"</img>`;
}
/*<span class="underlined" >Subtasks</span>*/

/**
 * This function renders the progressbar of the subtasks
 *
 * @param {string} id
 * @param {object} task
 * @param {number} done
 * @param {number} barProgress this contains the progress of the bar in percentage
 */
function renderSubtaskBarHTML(id, task, done, barProgress) {
  document.getElementById("subtasks" + id).innerHTML = `
        <div class="bar" style="background-image:  linear-gradient(to right, #29ABE2 ${barProgress}%,#29ABE2 ${barProgress / 100
    }px, #f4f4f4 0%)"></div><span class="fw-700">${done}/${task["subtasks"].length
    } Done</span>`;
}

/**
 * This function renders the subtasks
 *
 * @param {string} name of the subtask
 * @param {number} i is the place of the subtask which is given to an onlick function
 * @param {string} id
 *
 */

function renderSubtaskHTML(name, i, id) {
  openCardSubtasks;
  return /* html*/ `
    <div class="d-flex-gap-20"><input id="subtaskCheckbox${i}" class="checkbox" type="checkbox" onclick="taskIsDone('${i + id
    }')"><div class="subtask-titel">${name}</div>`;
}

/**
 * This function is used to render the assigned people on board.html
 * The function will happen after renderTask, because its rendered in a tenplate.
 *
 * @param {object} task to find the spot where it is rendered
 * @param {string} contactInitials
 */
function renderAssignedContactsHTML(contactInitials, task, color) {
  document.getElementById("assigned" + task["id"]).innerHTML += `
    <div class="contact ${color}">${contactInitials}</div>`;
}

/**
 * This function is used to render the assigned people on the openedCard
 *
 * @param {string} contactInitials
 * @param {object} task to find the spot where it is rendered
 * @param {string} contactName
 *
 */

function renderCardContactsHTML(contactInitials, task, contactName, color) {
  document.getElementById("assignedCard" + task["id"]).innerHTML += `
   <div class="d-flex-gap-20"><div class="contact-on-card ${color}">${contactInitials}</div><span class="contact-name">${contactName}</span></div>  `;
}

/**
 * This function renders the assigned people on the editCard
 *
 * @param {string} contact
 * @param {object} task
 */

function renderEditContactsHTML(contactInitials, task, color) {
  document.getElementById("edit-assignedTo").innerHTML += `
    <div class="contact  ${color}">${contactInitials}</div>`;
}
/**
 * This function removes the searchbar and puts it in Desktop view and changes the wording of the Addtask-Button
 * On board.html
 *
 */
function renderDesktopView() {
  document.getElementById("btn-add-task").innerHTML = "";
  document.getElementById("btn-add-task").innerHTML =
    'Add Task <img src="assets/plus-white.svg">'; // Wording
  document.getElementById("mobile-search").innerHTML = "";
  document.getElementById("desktop-search").innerHTML =
    '<input id="search" placeholder="Find task" type="text" onkeyup="searchTask()"></input>';
}

/**
 * This function removes the searchbar and puts it in Mobile view and removes the wording of the Addtask-Button
 * On board.html
 *
 */
function renderMobileView() {
  document.getElementById("btn-add-task").innerHTML = "";
  document.getElementById("btn-add-task").innerHTML =
    '<img src="assets/plus-white.svg">'; // removed Wording
  document.getElementById("desktop-search").innerHTML = "";
  document.getElementById("mobile-search").innerHTML =
    '<input id="search" placeholder="Find task" type="text" onkeyup="searchTask()"></input>';
}

/**
 * This function is the HTML needed to render a placeholder in the kanban
 *
 * @param {string} category is given so the placeholder has his own ID
 * @returns PlaceholderHTML
 */

function placeholderCardHTML(category) {
  return `<div class="dummy-card" id="dummy-card${category}-tasks">
    <div>
    </div>
    </div>`;
}

/**
 * This function is the HTML needed to render the card which asks if you wanna delete the task
 *
 *
 * @param {string}
 * @returns askDeleteHTML
 */

function askDeleteHTML(id) {
  return `
  <div onclick="dontClose(event)" class="task-card f-end">
    <h2>Are you sure you wanna delete this task?</h2>
    <div class="d-flex-gap-20"> <div onclick="deleteTask('${id}')" class="button" id="delete">Delete</div><div onclick="closeCard()" class="button" id="createTask">Keep</div></div>
  </div>
`;
}

/**
 * This function manipulates the html so the card opens.
 *
 * @param {string} id
 * @param {object} epic
 * @param {object} task
 */

function openCardHTML(id, epic, task) {
  document
    .getElementById("opened-card-container")
    .setAttribute("onclick", `closeCard('${id}')`);
  document.getElementById("opened-card-container").classList.remove("d-none");
  document.getElementById("opened-card-container").innerHTML = renderTaskCard(
    task,
    epic
  );
}

/**
 * This functions closes the card
 *
 */

function closeCardHTML() {
  document.getElementById("fullscreen").style.display = "none";
  document.getElementById("opened-card-container").classList.add("d-none");
}

/**
 * This function retruns the editTaskCard
 *
 * @param {string} id
 * @returns
 */

function editTaskHTML(id) {
  return /* html */ `

  <img onclick="closeCard('${id}')" id="close" src="./assets/close.svg" alt="">
  <div>
      <div>

          <div class="inputContainer">
              <label for="edit-title">Title</label>
              <input type="text" placeholder="Enter a title" id="edit-title">
              <div id="titleValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="edit-description">Description</label>
              <textarea id="edit-description" placeholder="Enter a Description" cols="30" rows="5"></textarea>
              <div id="descriptionValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="edit-dueDate">Due Date</label>
              <input type="date" placeholder="" id="edit-dueDate">
              <div id="dueDateValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="customSelect">Assigned</label>
              <div id="assigned" class="customSelect">
                  <!-- Content will be rendered by js-->
              </div>
              <div id="assignedToValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
              <div id="edit-assignedTo">
                  <!-- Content will be rendered by js-->
              </div>
          </div>
      </div>
      <div>
          <div class="inputContainer">
              <label>Prio</label>
              <div class="row">
                  <button id="urgent" class="prioButton" onclick="activatePrioButton('urgent')">
                      Urgent
                      <img src="./assets/urgent.svg" alt="">
                  </button>
                  <button id="medium" class="prioButton" onclick="activatePrioButton('medium')">
                      Medium
                      <img src="./assets/medium.svg" alt="">
                  </button>
                  <button id="low" class="prioButton" onclick="activatePrioButton('low')">
                      Low
                      <img src="./assets/low.svg" alt="">
                  </button>
              </div>
              <div id="prioStateValidation" class="formValidation">
                  <span>This field is required</span>
              </div>
          </div>
          <div class="inputContainer">
              <label for="subtask">Subtasks</label>
              <div id="subtask">
                  <div class="input" onclick="renderSubtaskInput()">
                      Add new subtask
                  </div>
              </div>
              <div id="openCardSubtasks"> </div> 
              <!-- <ul id="subtaskList"> -->
                  <!-- Content will be rendered by js-->
              <!-- </ul> --> -->
          </div>

          <div class="buttonContainer">
              <div onclick="askDeleteTask('${id}');" class="button" id="delete">
                  Delete task
                  <img src="./assets/clear.svg" alt="">
              </div>
              <div onclick="editTask('${id}')" class="button" id="createTask">
                  Save changes
                  <img src="./assets/createTask.svg" alt="">
              </div>
          </div>
      </div>
  </div>
  <div id="addedToBoard">
      <span>Task added to board</span>
      <img src="./assets/board.svg" alt="">
  </div>

  `;
}
