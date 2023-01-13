setURL('https://gruppe-354.developerakademie.net/smallest_backend_ever');

let users = [];

async function init() {

    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];


    let emailUser = localStorage.getItem('user-email');


    let user = users.find(u => u.email == emailUser);


    let tasks = user['tasks'];


    let newTask = document.getElementById('bla bla bla');


    tasks.push(newTask);


    await backend.setItem('users', JSON.stringify(users));

}
