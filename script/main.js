setURL('https://steven-munk.de/smallest_backend_ever');
let users = [];
let user;

async function loadData() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    setUser();
}

async function saveData() {
    await backend.setItem('users', JSON.stringify(users));
}

function setUser() {
    let emailUser = localStorage.getItem('user-email');
    user = users.find(u => u.email == emailUser);
}

async function initMain() {
    await loadData();
    includeHTML();
}

function hide(id) {
    document.getElementById(id).style.display = 'none'
}

function show(id, mode) {
    document.getElementById(id).style.display = mode;
}

function clearInnerHTMLByID(id) {
    document.getElementById(id).innerHTML = '';
}