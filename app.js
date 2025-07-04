const scriptURL = "https://script.google.com/macros/s/AKfycbzHIVbZXz09JJSbDwrAwCk70zL37fUw_ulQ9XADo1cD-jtXnZV6_WWy89aE2dBELdBx/exec";

async function fetchTasks() {
  try {
    const response = await fetch(`${scriptURL}?action=getTasks`);
    const tasks = await response.json();

    const headers = Object.keys(tasks[0] || {});
    const taskHeaders = document.getElementById("taskHeaders");
    const taskBody = document.getElementById("taskBody");

    taskHeaders.innerHTML = "";
    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header;
      taskHeaders.appendChild(th);
    });

    taskBody.innerHTML = "";
    tasks.forEach(task => {
      const tr = document.createElement("tr");
      headers.forEach(header => {
        const td = document.createElement("td");
        td.textContent = task[header] || "";
        tr.appendChild(td);
      });
      taskBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    if (result.success) {
      alert("Task added successfully!");
      fetchTasks();
      e.target.reset();
    } else {
      alert("Error adding task: " + JSON.stringify(result));
    }
  } catch (error) {
    console.error("POST error:", error);
    alert("POST failed. See console.");
  }
});

window.onload = fetchTasks;
