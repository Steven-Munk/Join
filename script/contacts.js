let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let email;
let indexOfUser;
let contacts;
let certainContact;
let firstLetters;
let initials;
let contactMail;
let contactColor;
let contactPhone;
let allNames = [];
let allFirstLetters = [];
let allLettersOnce = [];
let IDOfEditContact;

/**
 * is called if html body element is onload
 */
async function initContacts() {
    await initMain();
    importContacts();
    renderList();
}

/**
 * function defines variables for futher use in js code
 */
function importContacts() {
    contacts = user['contacts'];
}

/**
 * function renders the list of all contacts
 */
function renderList() {
    getAllNames();
    getFirstCharOfNames();
    renderAllExistingLetters();
    renderAllContacts();
}

/**
 * function gets all the names of all the contacts the user has
 */
function getAllNames() {
    for (let i = 0; i < contacts.length; i++) {
        const name = contacts[i];
        allNames.push(name['name']);
    }
    allNames.sort();
}

/**
 *function gets the first letter of all names 
 */
function getFirstCharOfNames() {
    for (let i = 0; i < allNames.length; i++) {
        const name = allNames[i];
        allFirstLetters.push(name.charAt(0));
    }
}

/**
 * function checks, what letters must be renderd, depending on the first letter of every name
 */
function renderAllExistingLetters() {
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (allFirstLetters.includes(letter)) {
            allLettersOnce.push(letter);
            renderLetterCategory(letter);
        }
    }
}

/**
 * function renders all contacts, into the right letter catrgory, depending on the first letter of the name
 */
function renderAllContacts() {
    for (let i = 0; i < allLettersOnce.length; i++) {
        const letter = allLettersOnce[i];
        for (let d = 0; d < allNames.length; d++) {
            const name = allNames[d];
            if (name.charAt(0) == letter) {
                renderSingleContact(name, letter);
            }
        }
    }
}

/**
 * function defines all variables needed for rendering contact, depending on name
 * @param {string} name 
 */
function getVariablesForContact(name) {
    certainContact = contacts.find(u => u.name == name);
    firstLetters = name.match(/\b(\w)/g);
    initials = firstLetters.join('');
    contactMail = certainContact['email'];
    contactColor = certainContact['color'];
    contactPhone = certainContact['phone'];
}

/**
 * function renders a single contact into list
 * @param {string} letter 
 */
function renderSingleContact(name, letter) {
    getVariablesForContact(name)
    listContactHTML(name, letter);
}

/**
 * function renders selected contact in a huge display
 * @param {string} name 
 */
function showContactEntrie(name) {
    getVariablesForContact(name);
    checkForMobileView();
    selectetContactHTML(name);
    showActiveContact(name.replace(' ', ''));
}

/**
 * function hides list on mobile devices, so that contact entrie can be seen
 */
function checkForMobileView() {
    if (screen.width <= 1080) {
        document.getElementById('contactEntrie').classList.remove('mobile-entrie');
        document.getElementById('list').classList.add('d-none');
        document.getElementById('add-btn').classList.add('d-none');
    }
}

function openMobileList() {
    document.getElementById('list').classList.remove('d-none');
    document.getElementById('add-btn').classList.remove('d-none');
    document.getElementById('contactEntrie').classList.add('mobile-entrie');
}

/**
 * function creates and saves a new contact
 */
async function createNewContact() {
    let name = document.getElementById('newName').value;
    let email = document.getElementById('newEmail').value;
    let phone = document.getElementById('newPhone').value;
    let color = colors[Math.floor(Math.random() * 8)];
    contacts.push({ 'name': name, 'email': email, 'phone': phone, 'color': color })
    await saveData();
    addChangesToList(name);
    closeNewContact();
}

/**
 * function opens pop up for new contact
 */
function newContactWindow() {
    document.getElementById('pop-up-container').classList.remove('d-none');
    setTimeout(animateNewContact, 1);
}

/**
 * function animates new contact window
 */
function animateNewContact() {
    document.getElementById('pop-up-window').classList.add('not-hidden-mobile');
    document.getElementById('pop-up-window').classList.add('not-hidden');
}

/**
 * valueion closes new contact pop up
 */
function closeNewContact() {
    document.getElementById('newName').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPhone').value = '';
    document.getElementById('pop-up-container').classList.add('d-none');
    document.getElementById('pop-up-window').classList.remove('not-hidden');
    document.getElementById('pop-up-window').classList.remove('not-hidden-mobile');
}

/*
 * function prevents popup from closing 
 * @param {event} event 
 */
function dontClosePopup(event) {
    event.stopPropagation();
}

/**
 * function renders edit pop up
 * @param {string} name 
 */
function editPopUp(name) {
    showEditWindow();
    renderEditWindow(name);
}

/**
 * function renders gray screen and animarion of edit window
 */
function showEditWindow() {
    document.getElementById('pop-up-edit').classList.remove('d-none');
    setTimeout(animateEditWindow, 100);
}

/**
 * function animates edit window
 */
function animateEditWindow() {
    document.getElementById('pop-up-edit-window').classList.add('not-hidden');
    document.getElementById('pop-up-edit-window').classList.add('not-hidden-mobile');
}

/**
 * function renders the HTML and all information for the edit window
* @param {string} name 
 */
function renderEditWindow(name) {
    getVariablesForContact(name);
    renderEditHTML();
    ensertInfoIntoEdit(name);
}

/**
 * function enserts info of contact into edit HTML
 * @param {string} name 
 */
function ensertInfoIntoEdit(name) {
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = contactMail;
    document.getElementById('editPhone').value = contactPhone;
    IDOfEditContact = contacts.findIndex(u => u.name == name);
}

/**
 * function changes infos of contacts, based on the id of the contact
 */
async function saveContactChanges() {
    let oldContact = contacts[IDOfEditContact];
    oldContact['name'] = document.getElementById('editName').value;
    oldContact['email'] = document.getElementById('editEmail').value;
    oldContact['phone'] = document.getElementById('editPhone').value;
    let name = oldContact['name'];
    await backend.setItem('users', JSON.stringify(users));
    addChangesToList(name);
    closeEdit();
}

/**
 * function closes edit window
 */
function closeEdit() {
    document.getElementById('pop-up-edit').classList.add('d-none');
    document.getElementById('pop-up-edit-window').classList.remove('not-hidden');
}

/**
 * function renders recent changes to contact page 
 */
function addChangesToList(name) {
    document.getElementById('list').innerHTML = '';
    allNames = [];
    allFirstLetters = [];
    allLettersOnce = [];
    renderList();
    document.getElementById('selected-contact').innerHTML = '';
    showContactEntrie(name);
}

/**
 * function shows add task pop up
 */
function openTaskTemplate() {
    showAddTask('todo');
}

function showActiveContact(activeContact) {
    let singleContacts = [...document.getElementsByClassName('single-contact')];
    singleContacts.forEach((contact) => {
        contact.classList.remove('activeContact');
    })
    document.getElementById(activeContact).classList.add('activeContact');
}