
const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec';

const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value.trim();
  const deadline = document.getElementById('task-deadline').value;
  const tags = document.getElementById('task-tags').value.trim();

  if (!title) {
    alert('Please enter a task title.');
    return;
  }

  const task = { title, deadline, tags };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'addTask', task }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data.success) {
      form.reset();
      loadTasks();
    } else {
      alert('Failed to add task. Try again.');
    }
  } catch (error) {
    alert('Error connecting to backend.');
    console.error(error);
  }
});

async function loadTasks() {
  try {
    const res = await fetch(`${API_URL}?action=getTasks`);
    const data = await res.json();
    const tasks = data.tasks || [];

    taskList.innerHTML = tasks.length
      ? tasks
          .map((task) => {
            const deadlineText = task.deadline
              ? new Date(task.deadline).toLocaleString()
              : 'No deadline';
            const tagsText = task.tags ? `🏷️ ${task.tags}` : '';
            return `
              <li class="list-group-item">
                <strong>📝 ${task.title}</strong><br />
                <small class="text-muted">${deadlineText}</small><br />
                <small>${tagsText}</small>
              </li>
            `;
          })
          .join('')
      : `<li class="list-group-item">No tasks found.</li>`;
  } catch (error) {
    taskList.innerHTML =
      '<li class="list-group-item text-danger">Failed to load tasks.</li>';
    console.error(error);
  }
}

loadTasks();
