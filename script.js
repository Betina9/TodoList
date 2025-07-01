const listContainer = document.querySelector("#list-container");
const taskInput = document.querySelector('#task-input');
const toggleShowCompleted = document.querySelector("#show-completed");
const sortBy = document.querySelector("#sort-by");

let tasks = [];
let filters = { showCompleted: false, sortType: "time-desc" };

const saveTasksToStorage = () =>
  localStorage.setItem("tasks", JSON.stringify(tasks));

sortBy.addEventListener("change", (e) => {
  filters.sortType = e.target.value;
  renderPage();
});

toggleShowCompleted.addEventListener("change", (e) => {
  filters.showCompleted = e.target.checked;
  renderPage();
});

const taskForm = document.querySelector("#task-form");
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(taskForm);
  const userInput = formData.get("task-input");

  if (!userInput) {
    return alert("Input cannot be empty.");
  }

taskInput.value = "";

  tasks.push({
    timestamp: new Date(),
    description: userInput,
    completed: false,
  });
  saveTasksToStorage();

  renderPage();
});

const completeTaskInput = (task) => {
  const inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.checked = task.completed;

  inputElement.addEventListener("change", (e) => {
    task.completed = e.target.checked;
    saveTasksToStorage();
    renderPage();
  });

  return inputElement;
};

const editTaskButton = (task, descriptionElement) => {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("edit-button");
  buttonElement.textContent = "Endre";

  buttonElement.addEventListener("click", () => {
    task.description = descriptionElement.value;
    descriptionElement.readOnly = !descriptionElement.readOnly;
    buttonElement.textContent = descriptionElement.readOnly ? "Endre" : "Lagre";
    saveTasksToStorage();
  });

  return buttonElement;
};

const deleteTaskButton = (task) => {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("delete-button");
  buttonElement.textContent = "Slett";

  buttonElement.addEventListener("click", () => {
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
    }
    saveTasksToStorage();
    renderPage();
  });

  return buttonElement;
};

const filterArray = (tasksArr) => {
  return tasksArr
  .filter((task) => filters.showCompleted || !task.completed)
  .sort(sortArray);
};

const sortArray = (a, b) => {
if (filters.sortType === 'time-asc') {
  return new Date(b.timestamp) - new Date(a.timestamp
  )
}
else if (filters.sortType === 'time-desc')
 return new Date(a.timestamp) - new Date(b.timestamp)
}

else if (filters.sortType === 'alpha-desc') {
  return a.description.localeCompare(b.description);
}

else if (filters.sortType === 'alpha-asc') {
  return b.description.localeCompare(a.description);
}

const buildPage = (tasksArr) => {
  console.log(tasksArr);
  listContainer.replaceChildren();
  tasksArr.forEach((task) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    const timestampElement = document.createElement("p");
    timestampElement.classList.add("datetime");
    timestampElement.textContent = task.timestamp;

    const descriptionElement = document.createElement("input");
    descriptionElement.classList.add("description");
    descriptionElement.readOnly = true;
    descriptionElement.value = task.description;

    // Buttons
    const inputElement = completeTaskInput(task);
    const editBtn = editTaskButton(task, descriptionElement);
    const deleteBtn = deleteTaskButton(task);

    taskContainer.append(
      timestampElement,
      descriptionElement,
      inputElement,
      editBtn,
      deleteBtn
    );

    listContainer.prepend(taskContainer);
  });
};

const renderPage = () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
  buildPage(filterArray(tasks));
};
