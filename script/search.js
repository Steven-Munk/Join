function searchTask() {
  clearColumns();
  let search = document.getElementById("search").value;
  search = search.toLowerCase();
  filterForTask(search);;
}

function filterForTask(search) {
  for (let j = 0; j < user["epics"].length; j++) {
    const epic = user["epics"][j];
    for (let i = 0; i < epic["tasks"].length; i++) {
      const task = epic["tasks"][i]
      const taskTitle = epic["tasks"][i]['title'];
      if (taskTitle.toLowerCase().includes(search) || epic["name"].toLowerCase().includes(search)) {
        getTasksCategory(task, epic)
      }
    }
  }
}
