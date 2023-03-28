let currentDraggedTask;
let doneSubtasks;
let subtaskDone;
let printExtraContactOnes;
let cardWasOpened = false;
let openEdit = false;
let x = window.matchMedia("(max-width: 800px)");
let y = window.matchMedia("(max-width: 1080px)");
x.addListener(checkWitdh);
let dummysPrinted = false;
let kanbanCategorys = ["todo", "progress", "feedback", "done"];

/**
 * This function is used to start all functions included by visiting the webpage
 *
 */
async function initBoard() {
  await initMain();
  startRender();
  checkWitdh(x);
}

/**
 * This function starts the rendering process (Its exists just to clearify code)
 *
 */

function startRender() {
  goThroughAllEpics();
}
/**
 * This function will be started when you start dragging a Task.
 *
 *
 */

addEventListener("drag", (event) => {
  if (!dummysPrinted) {
    renderPlaceholder();
    dummysPrinted = true;
  }
});

/**
 * This function will be started when you drop a Task.
 * It will just false the variable to make the previous function work again.
 *
 */

addEventListener("drop", (event) => {
  if (dummysPrinted) {
    dummysPrinted = false;
  }
});

/**
 * This function goes through all epics of the database to start rendering one after the other
 *
 *
 */

function goThroughAllEpics() {
  clearColumns();
  let epics = user["epics"];
  for (let i = 0; i < epics.length; i++) {
    const epic = epics[i];
    goThroughAllTasks(epic);
  }
}

/**
 * This function goes through all tasks of each epic and renders them
 *
 * @param {object} epic The object containing the tasks to be rendered
 */

function goThroughAllTasks(epic) {
  for (let i = 0; i < epic["tasks"].length; i++) {
    const task = epic["tasks"][i];
    getTasksCategory(task, epic);
  }
}

/**
 * This function checks the category of the task and starts the render process
 *
 * @param {object} task the task to be rendered
 * @param {object} epic the epic is just passed through fot the render process
 */

function getTasksCategory(task, epic) {
  kanbanCategorys.forEach((element) => {
    if (task["category"] == element) {
      document.getElementById(element + "-tasks").innerHTML += renderTask(
        task,
        epic
      );
    }
  });
  getAssignedContact(task);
  checkSubtaskAmount(task);
}

/**
 * This function puts a placeholder in every other coulmn of the kanban
 *
 */
function renderPlaceholder() {
  kanbanCategorys.forEach((category) => {
    if (findTaskById(currentDraggedTask)["category"] != category) {
      document.getElementById(category + "-tasks").innerHTML +=
        placeholderCardHTML(category);
    }
  });
}


/**
 * This function clears the content of every column of the kanban
 *
 */

function clearColumns() {
  document.getElementById("todo-tasks").innerHTML = "";
  document.getElementById("progress-tasks").innerHTML = "";
  document.getElementById("feedback-tasks").innerHTML = "";
  document.getElementById("done-tasks").innerHTML = "";
}

/**
 * This function changes the ID of the currentDraggedTaske to the dragged item ones
 *
 * @param {string} id to indentify a task
 */

function startDragging(id) {
  currentDraggedTask = id;
}

/**
 * This function change the behaivior to be able to drop an item
 *
 * @param {event} ev
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * This function changes the category of the task to the category its dropped in
 *
 * @param {string} category fixed category hardcoded in HTML
 */
async function moveTo(category) {
  let draggedTask = findTaskById(currentDraggedTask);
  draggedTask["category"] = category;
  startRender();
  await saveData();
}

/**
 * This function finds the task if you give it its ID
 *
 * @returns task
 */

function findTaskById(id) {
  for (let j = 0; j < user["epics"].length; j++) {
    const epic = user["epics"][j];
    for (let i = 0; i < epic["tasks"].length; i++) {
      const task = epic["tasks"][i];
      if (id == task["id"]) {
        return task;
      }
    }
  }
}

/**
 * This function finds the epic of an task give it its ID
 *
 * @returns epic
 */

function findEpicById(id) {
  for (let j = 0; j < user["epics"].length; j++) {
    const epic = user["epics"][j];
    for (let i = 0; i < epic["tasks"].length; i++) {
      const task = epic["tasks"][i];
      if (id == task["id"]) {
        return epic;
      }
    }
  }
}

/**
 *This function compares the query witdh choosen with the window witdh of the user and relocates the searchbar as needed
 *
 * @param {mediaquery} x
 */
function checkWitdh(x) {
  if (x.matches) {
    renderMobileView();
  } else {
    renderDesktopView();
  }
}

/**
 * This function takes the username and gives out the initials e.g. Kevin Lentz = KL
 *
 * @param {object} task
 */

function getAssignedContact(task) {
  printExtraContactOnes = true;
  for (let i = 0; i < task["assignedTo"].length; i++) {
    const fullContact = task["assignedTo"][i]["name"];
    const color = task["assignedTo"][i]["color"];
    const firstLetters = fullContact.match(/\b(\w)/g);
    const initials = firstLetters.join('');
    checkLocationContacts(initials, task, fullContact, i, color);
  }
}

/**
 * This function checks if the contacts has to be rendered on the open task card,
 * or on the kanban cards, or the edit card
 *
 * @param {string} contactInitials
 * @param {object} task
 * @param {string} contactName
 * @param {number} i
 */
function checkLocationContacts(contactInitials, task, contactName, i, color) {
  if (cardWasOpened) {
    if (openEdit) {
      renderEditContactsHTML(contactInitials, task, color);
    } else {
      renderCardContactsHTML(contactInitials, task, contactName, color);
    }
  }
  if (!cardWasOpened && printExtraContactOnes) {
    checkContactsToRender(contactInitials, task, contactName, i, color);
  }
}

/**
 * This function renders a max of 3 contacts. If there is more, it will print 2 and a number for how many are left.
 *
 * @param {string} contactInitials This is just given to the next function, it will be needed for rendering
 * @param {object} task
 * @param {string} contactName This isnt used here, the function is used for many other functions
 * @param {number} i to check the amount of printed items
 * @return just ends the loop
 */

function checkContactsToRender(contactInitials, task, contactName, i, color) {
  if (i <= 2 && task["assignedTo"].length <= 3) {
    renderAssignedContactsHTML(contactInitials, task, color);
    return;
  }
  if (i == 2 && task["assignedTo"].length >= 2) {
    printExtraContact(task);
  } else {
    renderAssignedContactsHTML(contactInitials, task, color);
  }
}

/**
 * This function renders the amount of extra contacts, which has to be shown.
 *
 * @param {object} task
 */

function printExtraContact(task) {
  let extraContacts = "+" + (task["assignedTo"].length - 2);
  document.getElementById("assigned" + task["id"]).innerHTML += `
    <div class="extra-contact contact">${extraContacts}</div>`;
  printExtraContactOnes = false;
}

/**
 * This function gets all the subtasks out of a task and puts its to an render
 *
 * @param {object} task
 */

function getAllSubtasks(task) {
  let i = 0;
  task["subtasks"].forEach((element) => {
    document.getElementById(`openCardSubtasks`).innerHTML += renderSubtaskHTML(
      element.name,
      i,
      task["id"]
    );
    i++;
  });
}

/**
 * This function ticks the checkboxs of the done tasks.
 *
 * @param {object} task
 */

function tickCheckBox(task) {
  let i = 0;
  task["subtasks"].forEach((element) => {
    if (element.checked) {
      subtaskDone = true;
      document.getElementById("subtaskCheckbox" + i).checked = true;
    } else {
      subtaskDone = false;
      document.getElementById("subtaskCheckbox" + i).checked = false;
    }
    i++;
  });
}

/**
 * This function switches the subtaskprocess to done when the checkbox is used,
 * or in progress depending of the state
 *
 * @param {string} id
 */

async function taskIsDone(id) {
  let task = findTaskById(id.toString().slice(1));
  let subtaskNumber = id.toString().slice(0, 1);
  if (task["subtasks"][subtaskNumber].checked) {
    task["subtasks"][subtaskNumber].checked = false;
  } else {
    task["subtasks"][subtaskNumber].checked = true;
  }
  await saveData();
}

/**
 * This function puts together the total subtasks and the done subtask, so it can be rendered
 *
 * @param {object} task
 */
function checkSubtaskAmount(task) {
  if (task["subtasks"].length) {
    checkSubtasksDone(task);
    renderSubtaskBarHTML(task["id"], task, doneSubtasks, calcBarProgress(task));
  }
}

/**
 * This function checks how many subtasks are done
 *
 * @param {object} task
 */

function checkSubtasksDone(task) {
  doneSubtasks = 0;
  for (let i = 0; i < task["subtasks"].length; i++) {
    const subtask = task["subtasks"][i];
    if (subtask["checked"]) {
      doneSubtasks++;
    }
  }
}

/**
 * This function calc the progress in percent
 *
 * @param {object} task
 * @returns {number} how long the progressbar is
 */

function calcBarProgress(task) {
  let barProgress = (doneSubtasks / task["subtasks"].length) * 100;
  return barProgress;
}

/**
 * This function opens the taskcard you click on
 *
 *@param {string} id
 */
function openCard(id) {
  cardWasOpened = true;
  let task = findTaskById(id);
  let epic = findEpicById(id);
  let category = task.category;
  openCardHTML(id, epic, task);
  getAssignedContact(task);
  getAllSubtasks(task);
  tickCheckBox(task);
  removeKanbanOnPhone();
  currentDraggedTask = id;
  renderCurrentCategory(category);
}

/**
 * This function closes the taskcard.
 *
 *@param {string} id
 */
function closeCard(id) {
  cardWasOpened = false;
  openEdit = false;
  closeCardHTML();
  checkSubtaskAmount(findTaskById(id));
  showKanban()
}

function removeKanbanOnPhone() {
  if (y.matches) {
    document.getElementById("main").classList.add("d-none");
  }
}
function showKanban() {
  document.getElementById("main").classList.remove("d-none");
}


/**
 * This function ask if you really want to delete a task to prevent missclicks
 *
 * @param {string} id
 */
function askDeleteTask(id) {
  document.getElementById(`opened-card-container`).innerHTML =
    askDeleteHTML(id);
}

/**
 * This function prevents the windows from closing if pressed on
 *
 * @param {event} event
 */
function dontClose(event) {
  event.stopPropagation();
}
