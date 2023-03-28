/**
 * This function saves the inputs of the edited task
 *
 * @param {string} id
 */
async function editTask(id) {
    if (allInputsFilled()) {
        updateTask(id);
        closeAddTaskTemplate();
        document.getElementById("opened-card-container").classList.add("d-none");
        startRender();
        await saveData();
        goThroughAllEpics();
    }
}

/**
 * updates all values in task object
 * @param {string} id of edited task
 */
function updateTask(id) {
    const task = findTaskById(id);
    task.title = document.getElementById("title").value;
    task.description = document.getElementById("description").value;
    task.dueDate = document.getElementById("dueDate").value;
    task.assignedTo = assignedContacts;
    task.prio = returnPrioState();
    task.subtasks = getSubtasks();
    updateEpic(task, id);
}

/**
 * deletes task in current epic and create task in new epic
 * if category(epic) is changed
 * @param {string} id from edited task
 */
function updateEpic(task, id) {
    const newCategory = document.getElementById("firstValue").innerText;
    if (categoryIsChanged(id, newCategory)) {
        user.epics.forEach((epic) => {
            if (epic.name == newCategory) {
                task.id = createID(epic);
                epic.tasks.push(task);
                task.id = id;
                deleteTask(id);
            }
        });
    }
}

/**
 * checks if category is changed by user or not
 * @param {string} id of edited task
 * @param {string} newCategory user input in edit task card
 * @returns boolean
 */
function categoryIsChanged(id, newCategory) {
    return newCategory != findEpicById(id).name;
}


/**
 * This function changes the Opencard so it can be edited
 *
 * @param {string} id
 */
function openCardEdit(id) {
    closeCard(id);
    showTemplateToEditTask(id);
    renderCategorySelector();
    renderContactSelector();
    fillAllInputs(id);
    removeKanbanOnPhone();
}

/**
 * This function fills the input of the editCard with the information of the task which is to be edit
 *
 * @param {object} task
 */
function fillAllInputs(id) {
    let task = findTaskById(id);
    document.getElementById("title").value = task["title"];
    document.getElementById("description").value = task["description"];
    showEpicInEditTasks(id);
    showAssignedContactsInEditTasks(task);
    document.getElementById("dueDate").value = task["dueDate"];
    activatePrioButton(task.prio);
    showSubtasksInEditTasks(task);
}

function showEpicInEditTasks(id) {
    let category = findEpicById(id);
    let firstValue = document.getElementById("firstValue");
    firstValue.innerHTML = `
      ${category.name}
      <div class="color ${category.color}"></div> 
      `;
}

function showAssignedContactsInEditTasks(task) {
    assignedContacts = task.assignedTo;
    renderContactsFromArray();
    fillContactCheckboxes();
}

function showSubtasksInEditTasks(task) {
    let subtasks = task.subtasks;
    if (subtasks.length) {
        for (let i = 0; i < subtasks.length; i++) {
            const subtask = subtasks[i];
            document.getElementById("subtaskList").innerHTML += subtasklistTemplate(
                subtask.name,
                i
            );
        }
    }
}

function fillContactCheckboxes() {
    const selectableContacts = document.getElementsByClassName("selectable");
    for (let i = 0; i < selectableContacts.length; i++) {
        const selectableContact = selectableContacts[i];
        const selectedContact = assignedContacts.find(
            (element) => element.name == selectableContact.innerText
        );
        if (selectedContact) {
            selectableContact.lastElementChild.setAttribute("checked", true);
        }
    }
}

/**
 * This function deletes the task
 *
 * @param {string} id
 */

async function deleteTask(id) {
    let epic = findEpicById(id);
    index = epic.tasks.findIndex((x) => x.id === id);
    epic.tasks.splice(index, 1);
    await saveData();
    cardWasOpened = false;
    openEdit = false;
    document.getElementById("fullscreen").style.display = "none";
    document.getElementById("opened-card-container").classList.add("d-none");
    startRender();
}

function renderCurrentCategory(category) {
    let btns = [...document.getElementsByClassName('mobile-column-btn')];
    btns.forEach((btn) => {
        if (!btn.classList.contains(category)) {
            btn.classList.remove('active')
        } else {
            btn.classList.add('active');
        }
    })
}

function changeCategory(category) {

    closeCard(currentDraggedTask)
    moveTo(category);
}