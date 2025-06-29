// Replace this with your actual deployed web app URL
const API_URL = "https://script.google.com/macros/s/AKfycbzhSHFcFAhu_DMGJg_puywUTNiS1JSKbjrgjCC_ZRSCaNIhWQZhTEAdgLfqCclDuNJv/exec";

// Load tasks from backend and render in the UI
async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}?action=getTasks`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const tasks = await response.json();

    console.log("Tasks loaded:", tasks);
    renderTaskList(tasks);
  } catch (error) {
    console.error("Failed to load tasks:", error);
    showError("Failed to load tasks from server.");
  }
}

// Render tasks in the HTML task list container
function renderTaskList(tasks) {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;

  taskList.innerHTML = ""; // clear existing tasks

  if (!tasks.length) {
    taskList.innerHTML = "<p>No tasks found.</p>";
    return;
  }

  tasks.forEach(task => {
    // Create task item
    const item = document.createElement("li");
    item.className = "list-group-item";

    // Simple display: TaskID and Title, extend as needed
    item.textContent = `#${task.TaskID} - ${task.Title} [Status: ${task.Status}]`;

    taskList.appendChild(item);
  });
}

// Display an error message on UI
function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  }
}

window.onload = () => {
  loadTasks();
};
