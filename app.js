const scriptURL = "https://script.google.com/macros/s/AKfycbz9gKmssx-8Hge4Dr1hKJg2qECMYaBuY8VnaPi0sYO3RxKR3de0xnXr20O_pD41e2tF9A/exec";

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
