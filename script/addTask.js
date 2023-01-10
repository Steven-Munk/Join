let users = [];
let user;
let categoryColor = '';
let assignedContacts = [];
let subtasks = [];
const currentDate = new Date().toJSON().slice(0, 10);
let createTasktouched = false;
const buttons = ['urgent', 'medium', 'low'];
const colors = [
    'orange',
    'red',
    'green',
    'blue',
    'pink',
    'yellow',
    'ocean'
];

async function init() {
    await loadData();
    setUser();
    renderCategorySelector();
    renderContactSelector();
    colorPicker('ocean'); //set default color
    setDateOfToday();
}

/**
 * Backend Functions
*/
setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

async function loadData() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}

async function saveData() {
    let emailUser = localStorage.getItem('user-email');
    const i = users.findIndex(u => u.email == emailUser);
    users[i] = user;
    await backend.setItem('users', JSON.stringify(users));
}

/**
 * saves current user in local varriable 'user'
 */
function setUser() {
    let emailUser = localStorage.getItem('user-email');
    user = users.find(u => u.email == emailUser);
}

async function createTaskButtonTouched(category) {
    createTasktouched = true;
    if (allInputsFilled()) {
        createTask(category);
        createTasktouched = false;
        await saveData();
        showAnimationAndGoToBoard();
    };
}

function createTask(category) {
    user.epics.forEach(epic => {
        if (epic.name == document.getElementById('firstValue').innerText) {
            const id = createID(epic);
            epic.tasks.push(getTaskFromUserInput(category, id));
            epic.totalTasks++;
        }
    });
}

function getTaskFromUserInput(category, id) {
    return {
        'id': id,
        'title': document.getElementById('title').value,
        'description': document.getElementById('description').value,
        'assignedTo': assignedContacts,
        'dueDate': document.getElementById('dueDate').value,
        'prio': returnPrioState(),
        'subtasks': getSubtasks(),
        'category': category
    };
}

function setDateOfToday() {
    const datePicker = document.getElementById('dueDate');
    datePicker.value = currentDate;
    datePicker.setAttribute('min', currentDate);
}

/**
 * @param {string} epic from current task
 * @returns unique id for each task
 */
function createID(epic) {
    return (epic.name.slice(0, 4).toLowerCase() + (epic.totalTasks));
}

function showAnimationAndGoToBoard() {
    document.body.style.overflowY = 'hidden';
    document.getElementById('addedToBoard').classList.add('comeFromBottom');
    setTimeout(goToBoard, 2000);
}

function goToBoard() {
    if (currentSite() == '/board.html') {
        closeAddTaskTemplate();
        document.getElementById('addedToBoard').classList.remove('comeFromBottom');
        startRender();
    } else {
        window.location.href = 'board.html'
    }
}


/**
 * @returns boolean if all inputs are filled or not
 */
function allInputsFilled() {
    let validateAll = [
        !validate(isEmpty('title'), 'title'),
        !validate(isEmpty('description'), 'description'),
        !validate(isEmpty('dueDate'), 'dueDate'),
        !validate(prioStateIsEmpty(), 'prioState'),
        !validate(assignedToIsEmpty(), 'assignedTo'),
        !validate(categoryIsEmpty(), 'category'),
    ]
    return validateAll.every(Boolean);
}

/**
 * validate if html input element is empty or not
 * if field is empty show message "field required" under input element
 * @param {boolean} isempty if field is empty or not
 * @param {string} id HTML Element ID
 * @returns boolean if input is empty or not
 */
function validate(isempty, id) {
    if (isempty) {
        setFieldRequiredMessage(id);
        return true
    } else {
        resetFieldRequiredMessage(id);
        return false
    }
}

/**
 * 
 * @param {string} id HTML Element ID
 * @returns boolean if input is empty or not
 */
function isEmpty(id) {
    return document.getElementById(id).value == '';
}

function setFieldRequiredMessage(id) {
    document.getElementById(id + 'Validation').style.display = 'block';
}
function resetFieldRequiredMessage(id) {
    hide(id + 'Validation');
}

function prioStateIsEmpty() {
    return returnPrioState() == ''
}

function assignedToIsEmpty() {
    return assignedContacts.length == 0;
}

function categoryIsEmpty() {
    return document.getElementById('firstValue').innerText == 'Select task Category'
}

function returnPrioState() {
    let activeButton = '';
    buttons.forEach(button => {
        if (document.getElementById(button).classList.contains('active')) {
            activeButton = button;
        };
    });
    return activeButton;
};

/**
 * eventListener to open and close custom selctors
 * category selector and contact selector
 */
function setEventListener(id, opponent) {
    document.getElementById(id + 'Placeholder').addEventListener('click', () => {
        document.getElementById(id).classList.toggle('open');
        document.getElementById(opponent).classList.remove('open');
        renderAssignedContactsIfClosed()
    })
}

/**
 * set event listener for some closing functions and 
 * for form validation while input fields are filled after first validation
 */
window.addEventListener('click', (event) => {
    renderAssignedContactsIfClosed();
    if (event.target.id == 'fullscreen') {
        closeAddTaskTemplate();
    }
    if (createTasktouched) {
        allInputsFilled();
    }
    if (event.target.className != 'placeholder' &&
        event.target.className != 'category' &&
        event.target.className != 'selectable assigned' &&
        event.target.className != 'checkbox' &&
        event.target.className != 'assigned' &&
        event.target.id != 'firstValue'
    ) {
        closeAllCustomSelectors();
    };
})

window.addEventListener('keypress', (event) => {
    const subtaskInput = document.getElementById('subtaskInput') || '';
    const newCategory = document.getElementById('categorySelectorPlaceholder')?.nextElementSibling || '';
    const categoryInput = document.getElementById('categoryInput');
    if (event.key == 'Enter' && document.activeElement == subtaskInput) {
        addSubtask();
    }
    if (event.key == 'Enter' && document.activeElement == newCategory) {
        renderNewCategoryInput();
    }
    if (event.key == 'Enter' && document.activeElement == categoryInput) {
        addCategoryButtonTouched();
    }

})

function closeAllCustomSelectors() {
    document.getElementById('categorySelector').classList.remove('open');
    document.getElementById('assignedSelector').classList.remove('open');
    scrollToTop();
    renderAssignedContactsIfClosed();
}

/**
 * render the inital circles from assigned contacts
 * only when selector is closed
 */
function renderAssignedContactsIfClosed() {
    setTimeout(() => {
        if (document.getElementById('assignedSelector').offsetHeight > 50 ||
            document.getElementById('categorySelector').offsetHeight > 50) {
            hide('assignedToContainer');
        } else {
            show('assignedToContainer', 'flex');
        }
    }, 380);
}

/**
 * necessary while closing the custom selectors
 */
function scrollToTop() {
    document.getElementById('assignedSelector').scrollTop = 0;
    document.getElementById('categorySelector').scrollTop = 0;
}

/**
 * render choosen prio Button 
 * @param {string} id HTML element ID
 */
function activatePrioButton(id) {
    resetPrioButtons();
    let button = document.getElementById(id);
    button.classList.add('active');
    switch (id) {
        case 'urgent':
            button.classList.add('red')
            break;
        case 'medium':
            button.classList.add('orange')
            break;
        case 'low':
            button.classList.add('green')
            break;
        default:
            break;
    }
}

function resetPrioButtons() {
    buttons.forEach(button => {
        document.getElementById(button).classList = 'prioButton';
    });
}

/**
 * render input field for new category(epic)
 */
function renderNewCategoryInput() {
    show('colorPicker', 'flex');
    document.getElementById('categorySelector').innerHTML = newCategoryTemplate();
    document.getElementById('categoryInput').focus();
}

/**
 * check if there is an input or not
 * and depending add new category to current user
 */
async function addCategoryButtonTouched() {
    const categoryName = document.getElementById('categoryInput').value;
    if (categoryName) {
        await addCategory(categoryName);
        renderCategorySelector();
        hide('colorPicker');
        showCategory(lastCategory());
        resetFieldRequiredMessage('category');
    } else {
        setFieldRequiredMessage('category');
    }
}

/**
 * @returns last category from current user
 */
function lastCategory() {
    return (user.epics.length - 1).toString();
}

async function addCategory(categoryName) {
    user.epics.push(newCategory(categoryName))
    await saveData();
}

/**
 * @param {string} categoryName 
 * @returns Object 
 */
function newCategory(categoryName) {
    return {
        "name": categoryName,
        "totalTasks": 0,
        "color": categoryColor,
        "tasks": []
    }
}

function colorPicker(id) {
    resetPicker();
    let choosedColor = document.getElementById(id);
    choosedColor.classList.add('active');
    categoryColor = id;
}

function resetPicker() {
    categoryColor = '';
    colors.forEach(color => {
        document.getElementById(color).classList = 'color';
    });
}

function renderCategorySelector() {
    document.getElementById('categorySelector').innerHTML = categorySelectorTemplate();
    renderSingleCategorys();
    hide('colorPicker');
    setEventListener('categorySelector', 'assignedSelector');
    resetFieldRequiredMessage('category');
}

/**
 * show choosen category at custom selctor
 * @param {string} id unique id for each category(epic)
 */
function showCategory(id) {
    let firstValue = document.getElementById('firstValue');
    firstValue.innerHTML = renderChoosenCategory(id);
    closeAllCustomSelectors();
}

function renderContactSelector() {
    let selector = document.getElementById('assignedSelector');
    selector.innerHTML = contactSelectorTemplate();
    renderSingleContacts(selector);
    selector.innerHTML += inviteContactSelectorTemplate();
    setEventListener('assignedSelector', 'categorySelector');
    resetFieldRequiredMessage('assignedTo');
}

function renderSingleContacts(selector) {
    for (let id = 0; id < user.contacts.length; id++) {
        const contact = user.contacts[id];
        selector.innerHTML += singleContactTemplate(contact, id, contact.color);
    }
}

function renderInviteContactInput() {
    document.getElementById('assignedSelector').innerHTML = inviteContactInputTemplate();
    document.getElementById('contactInput').focus();

}

function inviteContact() {
    let email = document.getElementById('contactInput').value;
    if (email) {
        closeAllCustomSelectors();
        sendInviteMail(email);
        renderContactSelector();
        resetFieldRequiredMessage('assignedSelector');
    } else {
        setFieldRequiredMessage('assignedSelector');
    }
}

/**
 * function not implemented yet
 * @param {string} email 
 */
function sendInviteMail(email) { }

/**
 * toggles checkbox while clicking on name left of checkbox
 * @param {string} id from contact in contact selector
 */
function toggleCheckbox(id) {
    const checkbox = document.getElementById(`check-${id}`);
    checkbox.toggleAttribute('checked');
    renderCheckedContacts();
}

/**
 * saves checked contacts in array and
 * render assigned contacts under 'assigned selector'#
 */
function renderCheckedContacts() {
    saveCheckedContactsInArray();
    renderContactsFromArray();
};


function saveCheckedContactsInArray() {
    assignedContacts = [];
    const checkboxes = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        if (checkbox.checked) {
            addContactToArray(checkbox);
        }
    };
}

function addContactToArray(checkbox) {
    const id = checkbox.id.split('-')[1];
    const name = document.getElementById(`contact-${id}`).innerText;
    const color = document.getElementById(`contact-${id}`).getAttribute('data-color');
    assignedContacts.push(contactTemplate(name, color));
}

function contactTemplate(name, color) {
    return {
        'name': name,
        'color': color
    }
}


function renderContactsFromArray() {
    clearInnerHTMLByID('assignedToContainer');
    for (let i = 0; i < assignedContacts.length; i++) {
        const contact = assignedContacts[i];
        if (i == 5 && assignedContacts.length > 5) {
            renderSingleContactFromArray(`+${assignedContacts.length - 5}`, 'red')
            return
        }
        const firstLetters = contact.name.match(/\b(\w)/g);
        const initials = firstLetters.join('');
        renderSingleContactFromArray(initials, contact.color);
    }
}

function clearInnerHTMLByID(id) {
    document.getElementById(id).innerHTML = '';
}

/**
 * render colored circle with initials from assigned contacts
 * @param {String} initials 
 * @param {String} color 
 */
function renderSingleContactFromArray(initials, color) {
    assignedToContainer.innerHTML += assignedToContactCircleTemplate(initials, color);
}

function renderSubtaskInput() {
    document.getElementById('subtask').innerHTML = subtaskInputTemplate();
    document.getElementById('subtaskInput').focus();

}

function renderAddSubtaskContainer() {
    document.getElementById('subtask').innerHTML = addSubtaskContainerTemplate();
}

function addSubtask() {
    let subtask = document.getElementById('subtaskInput').value;
    let id = document.getElementsByClassName('subtaskCheckbox').length
    document.getElementById('subtaskList').innerHTML += subtasklistTemplate(subtask, id);
    renderSubtaskInput();
}

function getSubtasks() {
    subtasks = [];
    let allSubtasks = document.getElementsByClassName('subtaskCheckbox');
    for (let i = 0; i < allSubtasks.length; i++) {
        const subtask = allSubtasks[i];
        if (subtask.checked) { addSubtaskToArray(subtask); };
    };
    return subtasks;
}

function addSubtaskToArray(subtask) {
    let id = subtask.id.slice(-1);
    let value = document.getElementById(`subtask-${id}`).innerText;
    subtasks.push(subtaskTemplate(value));
}

function subtaskTemplate(value) {
    return {
        'name': value,
        'checked': false
    }
}

function clearAllInput() {
    resetInputRequiredMessages();
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    renderCategorySelector();
    renderContactSelector();
    renderCheckedContacts();
    document.getElementById('dueDate').value = currentDate;
    resetPrioButtons();
    renderAddSubtaskContainer();
    document.getElementById('subtaskList').innerHTML = '';
}

function closeAddTaskTemplate() {
    clearAllInput();
    resetInputRequiredMessages()
    hide('fullscreen');
    addKanbanOnPhone();
}

function closeInviteInput() {
    closeAllCustomSelectors();
    renderAddSubtaskContainer();
}

function resetInputRequiredMessages() {
    let requiredMessages = document.getElementsByClassName('formValidation')
    let messagesAsArray = [...requiredMessages];
    messagesAsArray.forEach(message =>
        message.style.display = 'none'
    )
    createTasktouched = false;
}

function hide(id) {
    document.getElementById(id).style.display = 'none'
}

function show(id, mode) {
    document.getElementById(id).style.display = mode;
}

/***********************HTML Templates**************************/

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
        <input class="checkbox" type="checkbox" name="" id="check-${id}">
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