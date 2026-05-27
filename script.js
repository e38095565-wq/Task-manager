const addBtn = document.getElementById("addBtn");
const taskContainer = document.getElementById("taskContainer");
const statsText = document.getElementById("statsText");
const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

renderTasks();

addBtn.addEventListener("click", addTask);

searchInput.addEventListener("input", renderTasks);

filterInput.addEventListener("change", renderTasks);

function addTask(){

  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const priorityInput = document.getElementById("priorityInput");

  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;
  const priority = priorityInput.value;

  if(text === "" || deadline === ""){
    alert("Fill all fields");
    return;
  }

  const task = {
    id:Date.now(),
    text,
    deadline,
    priority,
    completed:false
  };

  tasks.push(task);

  saveTasks();

  renderTasks();

  taskInput.value = "";
  deadlineInput.value = "";
}

function renderTasks(){

  taskContainer.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filterInput.value;

  let completedCount = 0;

  tasks.forEach(task => {

    if(task.completed){
      completedCount++;
    }

    if(!task.text.toLowerCase().includes(searchValue)){
      return;
    }

    if(filterValue === "completed" && !task.completed){
      return;
    }

    if(filterValue === "pending" && task.completed){
      return;
    }

    const card = document.createElement("div");

    card.className = "task-card";

    if(task.completed){
      card.classList.add("completed");
    }

    card.innerHTML = `
      <h2>${task.text}</h2>

      <p>
        Deadline: ${formatDate(task.deadline)}
      </p>

      <p>
        ${getRemainingTime(task.deadline)}
      </p>

      <span class="priority ${task.priority.toLowerCase()}">
        ${task.priority} Priority
      </span>

      <div class="actions">

        <button class="complete-btn">
          ${task.completed ? "Undo" : "Complete"}
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>
    `;

    const completeBtn = card.querySelector(".complete-btn");
    const deleteBtn = card.querySelector(".delete-btn");

    completeBtn.addEventListener("click", () => {
      toggleTask(task.id);
    });

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    taskContainer.appendChild(card);
  });

  statsText.textContent =
    `${completedCount} / ${tasks.length} Tasks Completed`;
}

function toggleTask(id){

  tasks = tasks.map(task => {

    if(task.id === id){
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();

  renderTasks();
}

function deleteTask(id){

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();

  renderTasks();
}

function saveTasks(){

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

function formatDate(date){

  return new Date(date).toLocaleString();
}

function getRemainingTime(deadline){

  const now = new Date();
  const target = new Date(deadline);

  const diff = target - now;

  if(diff <= 0){
    return "Deadline Passed";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (diff / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (diff / (1000 * 60)) % 60
  );

  return `${days}d ${hours}h ${minutes}m remaining`;
}