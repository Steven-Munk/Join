async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    showCurrentPage();
}

function showCurrentPage() {
    let site;
    if (site = document.getElementById(getID(currentSite()))) {
        site.classList.add('activeSite');
        site.style.pointerEvents = 'none';
        site.style.userSelect = 'none';
    }


}

/**
 * @returns current html site
 */
function currentSite() {
    let currentSite = window.location.href;
    currentSite = currentSite.substring(currentSite.lastIndexOf('/'));
    return currentSite;
}

function getID(path) {
    const pathWithoutHTML = path.split('.html')[0]
    const id = pathWithoutHTML.slice(1);
    return id;
}


/******************Data templates for Guest User ***************************/


let epicsArray = [
    {
        "name": "Backoffice",
        "totalTasks": 0,
        "color": "blue",
        "tasks": [

        ]
    },
    {
        "name": 'Marketing',
        "totalTasks": 0,
        "color": 'red',
        "tasks": []
    },
    {
        "name": 'Development',
        "totalTasks": 0,
        "color": 'orange',
        "tasks": []
    }
]

const guestUserEpicsArray = [
    { "name": "Backoffice", "totalTasks": 1, "color": "blue", "tasks": [{ "id": "back0", "title": "Delete console.log", "description": "Alle console.log Statements löschen", "assignedTo": [{ "name": "Anja Schulz", "color": "yellow" }, { "name": "Benedikt Ziegler", "color": "pink" }, { "name": "David Eisenberg", "color": "blue" }], "dueDate": "2022-12-08", "prio": "low", "subtasks": [], "category": "feedback" }] }, { "name": "Marketing", "totalTasks": 1, "color": "red", "tasks": [{ "id": "mark0", "title": "Dummy Tasks erstellen", "description": "Mehrere Dummy tasks für den Test User erstellen", "assignedTo": [{ "name": "Kevin Lentz", "color": "dark-red" }], "dueDate": "2022-12-10", "prio": "urgent", "subtasks": [], "category": "done" }] }, { "name": "Development", "totalTasks": 2, "color": "orange", "tasks": [{ "id": "deve0", "title": "Margin anpassen", "description": "Abstände der Seite alle auf 25 px angleichen", "assignedTo": [{ "name": "Steven Munk", "color": "ocean" }, { "name": "Kevin Lentz", "color": "dark-red" }], "dueDate": "2022-12-18", "prio": "urgent", "subtasks": [], "category": "todo" }, { "id": "deve1", "title": "Code review", "description": "Jeder stellt seinen Code vor", "assignedTo": [{ "name": "Marcel Bauer", "color": "neon-green" }, { "name": "Steven Munk", "color": "ocean" }, { "name": "Kevin Lentz", "color": "dark-red" }], "dueDate": "2022-12-29", "prio": "medium", "subtasks": [{ "name": "Steven", "checked": false }, { "name": "Kevin", "checked": false }, { "name": "Marcel", "checked": false }], "category": "todo" }] }
]

let exampleContacts = [
    {
        "name": "Anton Mayer",
        "email": "antom@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "green"
    },
    {
        "name": "Anja Schulz",
        "email": "schulz@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "yellow"
    },
    {
        "name": "Benedikt Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "pink"
    },
    {
        "name": "David Eisenberg",
        "email": "david@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "blue"
    },
    {
        "name": "Eva Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "purple"
    },
    {
        "name": "Emanuel Mauer",
        "email": "emanuel@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "red"
    },
    {
        "name": "Marcel Bauer",
        "email": "marcel@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "neon-green"
    },
    {
        "name": "Steven Munk",
        "email": "steven@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "ocean"
    },
    {
        "name": "Kevin Lentz",
        "email": "kevin@gmail.com",
        "phone": "+49 11 11 1111",
        "color": "dark-red"
    },
];



/**
 * function displays the log out button if profile pic is clicked
 */
function showLogOut() {
    let logOut = document.getElementById('log-out');
    if (logOut.classList.contains('d-none')) {
        document.getElementById('log-out').classList.remove('d-none');
    } else {
        document.getElementById('log-out').classList.add('d-none');
    }
}

function logOut() {
    window.location.href = 'index.html';
}

/**
 * This function shows the addtask template
 *
 * @param {string} category if given the task will be generated in this category. Default is todo
 */
function showAddTask(category) {
    clearAllInput();
    showTemplateToAddTask(category);
    renderCategorySelector();
    renderContactSelector();
    setDateOfToday();
    removeKanbanOnPhone();
}

function closeAddTaskTemplate() {
    clearAllInput();
    resetInputRequiredMessages()
    hide('fullscreen');
    showKanban();
}

function showTemplateToAddTask(category) {
    document.getElementById("fullscreen").style.display = "block";
    document.getElementById("headline").innerHTML = "Add Task";
    document.getElementById("createText").innerHTML = "create taks";
    document.getElementById("cancelText").innerHTML = "clear";
    document.getElementById("cancelText").style.color = "black";
    document.getElementById("clear").style.backgroundColor = 'white';
    document.getElementById("cancelImage").classList.remove('filterWhite');
    document.getElementById("createTask").onclick = () => {
        createTaskButtonTouched(category);
    };
    document.getElementById("clear").onclick = () => {
        clearAllInput();
    };
}

function showTemplateToEditTask(id) {
    document.getElementById("fullscreen").style.display = "block";
    document.getElementById("headline").innerHTML = "";
    document.getElementById("createText").innerHTML = "save";
    document.getElementById("cancelText").innerHTML = "delete";
    document.getElementById("cancelText").style.color = "white";
    document.getElementById("cancelImage").classList.add('filterWhite');
    document.getElementById("clear").style.backgroundColor = '#ff3d00';
    document.getElementById("createTask").onclick = () => {
        editTask(id);
    };
    document.getElementById("clear").onclick = () => {
        deleteTask(id);
    };
}



/*****************AddTask****HTML Templates**************************/

function categorySelectorTemplate() {
    return /*html*/`
        <span id="categorySelectorPlaceholder" class="placeholder">
            <div id="firstValue">Select task Category</div>
            <img class="category" src="./assets/selectArrow.svg" alt="">
        </span>
        <span tabindex="0" onclick="renderNewCategoryInput()" class="selectable category">New Category</span>
`}

function newCategoryTemplate() {
    return /*html*/`
    <div  class="customSelectorInput">
        <input id="categoryInput" class="noBorder" placeholder="New category name" type="text">
        <div class="createClearContainer">
            <img onclick="renderCategorySelector()" src="./assets/clear.svg" alt=""> |
            <img onclick="addCategoryButtonTouched()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `;
};

function renderSingleCategorys() {
    for (let i = 0; i < user.epics.length; i++) {
        const category = user.epics[i];
        document.getElementById('categorySelector').innerHTML += `
       <span tabindex="0"  onclick="showCategory('category-${i}')" id="category-${i}" class="selectable category">${category.name}
           <div class="color ${category.color}"></div>
       </span> 
       `
    }
}

function inviteContactInputTemplate() {
    return /*html*/`
    <div class="customSelectorInput">
        <input id="contactInput" class="noBorder" placeholder="contact email" type="text">
        <div class="createClearContainer">
            <img onclick="renderContactSelector()" src="./assets/clear.svg" alt=""> |
            <img onclick="inviteContact()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `;
};

function contactSelectorTemplate() {
    return /*html*/`
        <span id="assignedSelectorPlaceholder" class="placeholder">
            Select Contact
            <img class="assigned" src="./assets/selectArrow.svg" alt="">
        </span>
    `
}

function singleContactTemplate(contact, id, color) {
    return /*html*/`
    <span data-color="${color}" onclick="toggleCheckbox(${id})" id="contact-${id}" class="selectable assigned">${contact.name}
        <input class="checkbox contactCheckbox" type="checkbox" name="" id="check-${id}">
    </span>
    `
}

function inviteContactSelectorTemplate() {
    return /*html*/`
        <span onclick="renderInviteContactInput()" class="selectable assigned">Invite new Contact
            </span id="contactImg" src="./assets/contacts.svg" alt="">
        </span>
    `
}

function renderChoosenCategory(id) {
    index = id.slice(-1);
    let category = user.epics[index]
    return /*html*/ `
            ${category.name}
            <div class="color ${category.color}"></div>
    `
}

function assignedToContactCircleTemplate(shortName, color) {
    return /*html*/ `
    <div  class="assignedTo ${color} ">${shortName}</div>
    `
}

function subtaskInputTemplate() {
    return /*html*/ `
      <div class="customSelectorInput input p-0">
        <input id="subtaskInput" class="noBorder" placeholder="Add new subtask" type="text">
        <div class="createClearContainer">
            <img onclick="closeInviteInput()" src="./assets/clear.svg" alt=""> |
            <img onclick="addSubtask()" src="./assets/createTask.svg" alt="">
        </div>
    </div>
    `
}

function addSubtaskContainerTemplate() {
    return /*html*/ `
        <div class="input" onclick="renderSubtaskInput()">
            Add new subtask
        </div>
    `
}

function subtasklistTemplate(subtask, id) {
    return /*html*/ `
        <div>
            <input checked="true" type="checkbox" id="subCheck-${id}" class="subtaskCheckbox">
            <span id="subtask-${id}">${subtask}</span>
        </div>
    `
}

/*****************************Contact templates *********************/

/**
 * function renders letter categories, depending on the first letter of every name
 * @param {string} letter 
 */
function renderLetterCategory(letter) {
    document.getElementById('list').innerHTML += `
        <div id="letter-${letter}" class="letter-entrie">
            <div class="letter-container">
                <p class="letter">${letter}</p>
                <div class="only-desktop"></div>
            </div>
            <img class="horizontal-line" src="./assets/contact-break-line.svg">
        </div>
    `;
}

/**
 * function provides html code for rendering contact into list
 * @param {string} name 
 * @param {string} letter 
 */
function listContactHTML(name, letter) {
    document.getElementById(`letter-${letter}`).innerHTML += `
    <div id=${name.replace(' ', '')} onclick="showContactEntrie('${name}')" class="single-contact">
        <span class="initials ${contactColor}" ;">${initials}</span>
        <div class="name-and-mail">
            <p>${name}</p>
            <p class="mail">${contactMail}</p>
        </div>
    </div>
    `;
}

/**
 * function provides html code for rendering selected contact
 * @param {string} name 
 */
function selectetContactHTML(name) {
    document.getElementById('selected-contact').innerHTML = `
    <img onclick="openMobileList()" class="mobile-back-arrow only-mobile" src="./assets/mobile-back-arrow.svg">
    <img onclick="editPopUp('${name}')" class="mobile-edit-btn only-mobile" src="./assets/mobile-contact-edir.svg">
    <div class="huge-contact">
        <span class="huge-initials ${contactColor}" ;">${initials}</span>
        <div class="huge-name-add-task">
            <p class="huge-name">${name}</p>
            <div onclick="openTaskTemplate()" class="add-task">
                <img class="add-task-img" src="./assets/blue-plus.svg">
                <p class="add-task-text">Add Task</p>
            </div>
        </div>
    </div>

    <div class="edit-div">
        <p>Contact Information</p>
        <div onclick="editPopUp('${name}')" class="edit only-desktop">
            <img src="./assets/pen-small.svg">
            <p style="font-size: 16px;">Edit Contact</p>
        </div>
    </div>

    <p class="mail-and-phone">Email</p>

    <a href="mailto:${contactMail}" class="mail">${contactMail}</a>

    <p class="mail-and-phone">Phone</p>

    <a style="justify-content:start;"  href="tel:${contactPhone}" class="phone-number">${contactPhone}</a>
    `;
}

/**
 * function renders the HTML for the edit window
 */
function renderEditHTML() {
    document.getElementById('edit-content').innerHTML = `
        <img onclick="closeEdit()" class="pop-up-exit only-desktop" src="./assets/pop-up-cross.svg">

        <div class="only-mobile">
            <span class="huge-initials pop-up-initials ${contactColor}"  ;">${initials}</span>
        </div>
    
        <div class="only-desktop">
            <span class="huge-initials pop-up-initials  ${contactColor}" ;">${initials}</span>
        </div>
    
        <div class="all-inputfields">
    
            <div class="pop-up-inputfield">
                <input id="editName" class="pop-up-input" type="text" placeholder="Name" title="Change name">
                <img src="./assets/profile-input.svg">
            </div>
    
            <div class="pop-up-inputfield">
                <input id="editEmail" class="pop-up-input" type="email" placeholder="Email" title="Change email">
                <img src="./assets/mail.svg">
            </div>
    
            <div class="pop-up-inputfield">
                <input id="editPhone" class="pop-up-input" type="tel" placeholder="Phone"
                    title="Change phone number">
                <img src="./assets/phone.svg">
            </div>
    
            <button onclick="saveContactChanges()" class="dark-btn save-btn">
                Save
            </button>

        </div>
    `;
}