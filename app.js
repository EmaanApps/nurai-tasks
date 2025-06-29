// Replace this with your actual deployed web app URL
const API_URL = "https://script.google.com/macros/s/AKfycbzHIVbZXz09JJSbDwrAwCk70zL37fUw_ulQ9XADo1cD-jtXnZV6_WWy89aE2dBELdBx/exec";

// Utility to format ISO datetime-local input to Date string accepted by backend
function formatDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString();
}

// Fetch tasks from backend
async function fetchTasks() {
  try {
    // Example: fetch all tasks (can add query parameters if you want filtering)
    const response = await fetch(`${API_URL}?action=getTasks`);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    document.getElementById("taskList").innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}

// Render task list in the page
function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    document.getElementById("taskList").innerHTML = `<p>No tasks found.</p>`;
    return;
  }
  let html = `<table class="table table-striped table-bordered">
    <thead>
      <tr>
        <th>TaskID</th><th>Title</th><th>Description</th><th>Status</th><th>Deadline</th><th>Priority</th><th>Tags</th>
      </tr>
    </thead>
    <tbody>
  `;
  tasks.forEach(task => {
    html += `<tr>
      <td>${task.TaskID || ""}</td>
      <td>${task.Title || ""}</td>
      <td>${task.Description || ""}</td>
      <td>${task.Status || ""}</td>
      <td>${task.Deadline ? new Date(task.Deadline).toLocaleString() : ""}</td>
      <td>${task.Priority || ""}</td>
      <td>${task.Tags || ""}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("taskList").innerHTML = html;
}

// Handle form submission to add task
document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const task = {
    Title: document.getElementById("title").value.trim(),
    Description: document.getElementById("description").value.trim(),
    Status: document.getElementById("status").value,
    Deadline: formatDateInput(document.getElementById("deadline").value),
    Priority: document.getElementById("priority").value,
    Tags: document.getElementById("tags").value.trim()
  };

  if (!task.Title) {
    alert("Title is required");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addTask", task }),
    });
    const result = await response.json();

    if (result.success) {
      alert(result.message);
      e.target.reset();
      fetchTasks();
    } else {
      alert("Failed to add task: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// Initial load
fetchTasks();
