// Utility to format date/time nicely
function formatDateTime(dateStr, timeStr) {
  const date = new Date(dateStr + 'T' + timeStr);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

// Generate random date within 1 to 7 days from now, time 9am to 6pm quarter-hour intervals
function generateRandomFutureDateTime() {
  const now = new Date();
  const randomDayOffset = Math.floor(Math.random() * 7) + 1;
  const randomDate = new Date(now);
  randomDate.setDate(now.getDate() + randomDayOffset);

  const yyyy = randomDate.getFullYear();
  const mm = String(randomDate.getMonth() + 1).padStart(2, '0');
  const dd = String(randomDate.getDate()).padStart(2, '0');
  const dateValue = `${yyyy}-${mm}-${dd}`;

  const randomHour = Math.floor(Math.random() * 9) + 9; // 9 to 17
  const randomMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  const timeValue = `${String(randomHour).padStart(2,'0')}:${String(randomMinute).padStart(2,'0')}`;

  return { dateValue, timeValue };
}

// Save tasks to localStorage (for demo purposes)
function saveTasks(tasks) {
  localStorage.setItem('nurTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasksStr = localStorage.getItem('nurTasks');
  if (tasksStr) {
    return JSON.parse(tasksStr);
  }
  return [];
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
  tasks.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = \`
      <div class="task-title">\${task.title}</div>
      <div class="task-date-time">\${formatDateTime(task.date, task.time)}</div>
    \`;
    listDiv.appendChild(div);
  });
}

// Initialize form with random default date/time
function initFormDefaults() {
  const { dateValue, timeValue } = generateRandomFutureDateTime();
  document.getElementById('task-date').value = dateValue;
  document.getElementById('task-time').value = timeValue;
}

// Add task event handler
function handleFormSubmit(event) {
  event.preventDefault();
  const title = document.getElementById('task-title').value.trim();
  const date = document.getElementById('task-date').value;
  const time = document.getElementById('task-time').value;

  if (!title || !date || !time) {
    alert('Please fill out all fields');
    return;
  }

  const tasks = loadTasks();
  tasks.push({ title, date, time });
  saveTasks(tasks);
  renderTasks();

  // Reset form and defaults
  event.target.reset();
  initFormDefaults();
}

// Setup
document.addEventListener('DOMContentLoaded', () => {
  initFormDefaults();
  renderTasks();
  document.getElementById('task-form').addEventListener('submit', handleFormSubmit);
});