let tasks = JSON.parse(localStorage.getItem("studyBuddyTasks") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();

  document.getElementById("taskForm").addEventListener("submit", addTask);
  document.getElementById("clearBtn").addEventListener("click", clearTasks);
});

function addTask(event) {
  event.preventDefault();
  clearErrors();

  const data = {
    title: document.getElementById("task").value.trim(),
    subject: document.getElementById("subject").value,
    hours: Number(document.getElementById("hours").value)
  };

  const errors = {};

  if (data.title.length < 3)
    errors.task = "Enter at least 3 characters.";

  if (!data.subject)
    errors.subject = "Select a subject.";

  if (!Number.isFinite(data.hours) || data.hours < 1 || data.hours > 12)
    errors.hours = "Enter 1–12 hours.";

  if (Object.keys(errors).length) {
    showErrors(errors);
    showToast("Please correct the errors.");
    return;
  }

  // Validated object is stored in the Array.
  tasks.push({
    id: Date.now(),
    ...data,
    completed: false
  });

  // Array is converted to JSON before browser storage.
  localStorage.setItem("studyBuddyTasks", JSON.stringify(tasks));

  event.target.reset();
  renderTasks();
  showToast("Study task added successfully.");
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const empty = document.getElementById("empty");

  empty.style.display = tasks.length ? "none" : "block";

  list.innerHTML = tasks.map(task => `
    <div class="col-md-6">
      <div class="task-card ${task.completed ? "done" : ""}">
        <div class="d-flex justify-content-between gap-2">
          <div>
            <h6>${escapeHTML(task.title)}</h6>
            <div class="task-meta">
              <i class="bi bi-book me-1"></i>${escapeHTML(task.subject)}
              &nbsp; • &nbsp;
              <i class="bi bi-clock me-1"></i>${task.hours} hour(s)
            </div>
          </div>
          <button class="btn btn-sm ${task.completed ? "btn-success" : "btn-outline-success"}"
                  onclick="toggleTask(${task.id})">
            <i class="bi bi-check-lg"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Display Array as JSON.
  document.getElementById("jsonOutput").textContent =
    JSON.stringify(tasks, null, 2);
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;

  localStorage.setItem("studyBuddyTasks", JSON.stringify(tasks));
  renderTasks();
}

function clearTasks() {
  if (!tasks.length) {
    showToast("There are no tasks to clear.");
    return;
  }

  tasks = [];
  localStorage.removeItem("studyBuddyTasks");
  renderTasks();
  showToast("All study tasks cleared.");
}

function showErrors(errors) {
  Object.entries(errors).forEach(([field, message]) => {
    document.getElementById(field).classList.add("invalid");
    document.getElementById(field + "Error").textContent = message;
  });
}

function clearErrors() {
  ["task", "subject", "hours"].forEach(id => {
    document.getElementById(id).classList.remove("invalid");
    document.getElementById(id + "Error").textContent = "";
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.querySelector(".toast-body").textContent = message;
  bootstrap.Toast.getOrCreateInstance(toast).show();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}