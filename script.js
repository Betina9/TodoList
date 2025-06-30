const listContainer = document.querySelector("#list-container");

let tasks = [];
let filters = { showCompleted: false };

const taskForm = document.querySelector("#task-form");
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(taskForm);
  const userInput = formData.get("task-input");

  if (!userInput) {
    return alert("Input cannot be empty.");
  }

  tasks.push({
    timestamp: new Date(),
    description: userInput,
    completed: false,
  });

  renderPage();
});

const completeTaskInput = (task) => {
  const inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.checked = task.completed;

  inputElement.addEventListener("change", (e) => {
    task.completed = e.target.checked;
    renderPage();
  });

  return inputElement;
};

const filterArray = (tasksArr) => {
  return tasksArr.filter((task) => filters.showCompleted || !task.completed);
};

const buildPage = (tasksArr) => {
  console.log(tasksArr);
  listContainer.replaceChildren();
  tasksArr.forEach((task) => {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");

    const timestampElement = document.createElement("p");
    timestampElement.classList.add("datetime");
    timestampElement.textContent = task.timestamp;

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("description");
    descriptionElement.textContent = task.description;

    // Buttons
    const inputElement = completeTaskInput(task);

    taskContainer.append(timestampElement, descriptionElement, inputElement);
    listContainer.prepend(taskContainer);
  });
};

const renderPage = () => {
  buildPage(filterArray(tasks));
};
