const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const addBtn = document.getElementById("addBtn");
const themeBtn = document.getElementById("themeBtn");

document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
themeBtn.addEventListener("click", toggleTheme);

function addTask() {
    const text = taskInput.value.trim();
    const date = dateInput.value;
    const priority = priorityInput.value;

    if (!text) {
        alert("Please enter a task");
        return;
    }

    createTask({ text, date, priority, completed: false });
    saveTasks();

    taskInput.value = "";
    dateInput.value = "";
}

function createTask(task) {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `
        <strong>${task.text}</strong>
        <span class="priority">${task.priority} | ${task.date || "No date"}</span>
    `;

    li.addEventListener("click", () => {
        li.classList.toggle("completed");
        saveTasks();
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete-btn";

    del.addEventListener("click", (e) => {
        e.stopPropagation();
        li.remove();
        saveTasks();
    });

    li.appendChild(info);
    li.appendChild(del);
    taskList.appendChild(li);

    updateCounter();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
        const info = li.querySelector(".task-info");
        const text = info.querySelector("strong").textContent;
        const [priority, dateText] = info.querySelector(".priority").textContent.split(" | ");

        tasks.push({
            text,
            priority,
            date: dateText === "No date" ? "" : dateText,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounter();
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task));
    updateCounter();
}

function updateCounter() {
    const total = document.querySelectorAll("li").length;
    const completed = document.querySelectorAll("li.completed").length;
    counter.textContent = `${completed}/${total} Completed`;
}

function toggleTheme() {
    document.body.classList.toggle("light");
}
