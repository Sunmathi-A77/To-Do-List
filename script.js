let taskList = document.getElementById("taskList");

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let text = document.getElementById("taskText").value.trim();
    let category = document.getElementById("category").value;
    let priority = document.getElementById("priority").value;
    let deadline = document.getElementById("deadline").value;

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    let task = {
        text,
        category,
        priority,
        deadline,
        completed: false
    };

    saveTask(task);
    renderTasks();
    clearInputs();
}

function renderTasks() {
    taskList.innerHTML = "";
    let tasks = getTasks();

    // Auto-sort: Priority → Deadline
    tasks.sort((a, b) => {
        let p = { High: 1, Medium: 2, Low: 3 };
        if (p[a.priority] !== p[b.priority]) {
            return p[a.priority] - p[b.priority];
        }
        return new Date(a.deadline) - new Date(b.deadline);
    });

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.classList.add(`priority-${task.priority}`);
        if (task.completed) li.classList.add("completed");

        let info = document.createElement("div");
        info.className = "task-info";
        info.innerHTML = `
            <strong>${task.text}</strong><br>
            ${task.category} | ${task.priority} | ${task.deadline || "No deadline"}
        `;

        info.onclick = () => toggleComplete(index);

        let del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "delete";
        del.onclick = () => deleteTask(index);

        li.appendChild(info);
        li.appendChild(del);
        taskList.appendChild(li);
    });
}

function toggleComplete(index) {
    let tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(index) {
    let tasks = getTasks();
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function saveTask(task) {
    let tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
    renderTasks();
}

function clearInputs() {
    document.getElementById("taskText").value = "";
    document.getElementById("deadline").value = "";
}
