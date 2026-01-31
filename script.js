let taskList = document.getElementById("taskList");
let filterMode = "all";
let timerInterval;
let timeLeft = 1 * 60;

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
    loadTheme();
});

function addTask() {
    if (!taskText.value.trim()) return;

    let tasks = getTasks();
    tasks.push({
        text: taskText.value,
        category: category.value,
        priority: priority.value,
        deadline: deadline.value,
        completed: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskText.value = "";
    deadline.value = "";
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";
    let tasks = getTasks();
    let today = new Date().toISOString().split("T")[0];

    let visibleTasks = tasks.filter(t =>
        filterMode === "today" ? t.deadline === today : true
    );

    visibleTasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = `priority-${task.priority}`;
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <div onclick="toggleComplete(${index})">
                <strong>${task.text}</strong><br>
                ${task.category} | ${task.priority} | ${task.deadline || "No date"}
            </div>
            <button onclick="deleteTask(${index})">❌</button>
        `;

        taskList.appendChild(li);
    });

    updateProgress();
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

function showToday() {
    filterMode = "today";
    renderTasks();
}

function showAll() {
    filterMode = "all";
    renderTasks();
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

/* Dark Mode */
themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark"));
};

function loadTheme() {
    if (localStorage.getItem("theme") === "true") {
        document.body.classList.add("dark");
    }
}

/* Progress Bar */
function updateProgress() {
    let tasks = getTasks();
    let completed = tasks.filter(t => t.completed).length;
    let percent = tasks.length ? (completed / tasks.length) * 100 : 0;
    progressBar.style.width = percent + "%";
    progressText.textContent = Math.round(percent) + "% Completed";
}

/* Pomodoro Timer */
function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Pomodoro complete! Take a break 😄");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimer();
}

function updateTimer() {
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    timer.textContent = `${min}:${sec.toString().padStart(2, "0")}`;
}
