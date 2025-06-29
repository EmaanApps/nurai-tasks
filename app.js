// Generate unique TaskID (simple UUID v4 style)
function generateTaskID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Save tasks to localStorage (demo only)
function saveTasks(tasks) {
  localStorage.setItem('nurTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasksStr = localStorage.getItem('nurTasks');
  return tasksStr ? JSON.parse(tasksStr) : [];
}

// Render task list
function renderTasks() {
  const tasks = loadTasks();
  const listDiv = document.getElementById('tasks-list');
  listDiv.innerHTML = '';
  if (tasks.length === 0) {
    listDiv.innerHTML = '<p>No tasks added yet.</p>';
    return;
  }
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `
      <strong>${task.Title}</strong> [${task.Type}]<br/>
      Status: ${task.Status}, Priority: ${task.Priority}<br/>
      Deadline: ${task.Deadline || 'None'}, Deadline Type: ${task.DeadlineType}<br/>
      Tags: ${task.Tags || '-'}<br/>
      Notes: ${task.Notes || '-'}
    `;
    listDiv.appendChild(div);
  });
}

// Send task data to Google Apps Script Web App (stub - update URL!)
function sendTaskToBackend(task) {
  const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL_HERE'; // <-- Replace with your URL

  return fetch(scriptUrl, {
    method: 'POST',
    mode: 'no-cors', // 'no-cors' to avoid CORS errors for demo; change if backend supports CORS
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  .then(() => {
    console.log('Task sent to backend');
  })
  .catch(err => {
    console.error('Error sending task:', err);
  });
}

// Helper: Random integer between min and max inclusive
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set default date/time on form load
function setDefaultDeadline() {
  const dateInput = document.getElementById('deadline-date');
  const timeInput = document.getElementById('deadline-time');

  // Random day offset: 0 (today), 1 (tomorrow), or 2 days ahead
  const dayOffset = randomInt(0, 2);
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + dayOffset);

  // Format YYYY-MM-DD for input[type=date]
  const yyyy = defaultDate.getFullYear();
  const mm = String(defaultDate.getMonth() + 1).padStart(2, '0');
  const dd = String(defaultDate.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;

  // Random hour between 9 and 17 (5 PM)
  const hour = randomInt(9, 17);
  // Random minute: 0 or 30
  const minute = Math.random() < 0.5 ? '00' : '30';

  // Format HH:MM for input[type=time]
  timeInput.value = `${String(hour).padStart(2, '0')}:${minute}`;
}

// Handle form submission
document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const newTask = {
    TaskID: document.getElementById('task-id').value || generateTaskID(),
    Title: document.getElementById('title').value.trim(),
    Description: document.getElementById('description').value.trim(),
    Type: document.getElementById('type').value,
    ParentID: document.getElementById('parent-id').value.trim(),
    Status: document.getElementById('status').value,
    Deadline: (document.getElementById('deadline-date').value ? document.getElementById('deadline-date').value : '') +
              (document.getElementById('deadline-time').value ? ' ' + document.getElementById('deadline-time').value : ''),
    DeadlineType: document.getElementById('deadline-type').value,
    Notification: document.getElementById('notification').value,
    Tags: document.getElementById('tags').value.trim(),
    Priority: document.getElementById('priority').value,
    CreatedAt: getCurrentTimestamp(),
    UpdatedAt: getCurrentTimestamp(),
    Notes: document.getElementById('notes').value.trim()
  };

  if (!newTask.Title) {
    alert('Title is required');
    return;
  }

  const tasks = loadTasks();
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();

  // Optionally send to backend (uncomment to enable when URL ready)
  // sendTaskToBackend(newTask);

  // Reset form and TaskID
  this.reset();
  document.getElementById('task-id').value = '';

  // Reset default deadline after form reset
  setDefaultDeadline();
});

// Initial render and setup default deadline on page load
window.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  setDefaultDeadline();
});
