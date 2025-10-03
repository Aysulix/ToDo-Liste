// ====== JavaScript für ToDo App ======

// DOM Elemente
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const template = document.getElementById("todo-item-template");
const stats = document.getElementById("items-left");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter");

// State
let todos = JSON.parse(localStorage.getItem("todos") || "[]");
let filter = "all";

// Hilfsfunktionen
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function render() {
  list.innerHTML = "";
  let filtered = todos.filter((t) =>
    filter === "active"
      ? !t.completed
      : filter === "completed"
      ? t.completed
      : true
  );
  for (const todo of filtered) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.id = todo.id;
    const checkbox = node.querySelector(".toggle");
    const title = node.querySelector(".title");
    const editBtn = node.querySelector(".edit");
    const delBtn = node.querySelector(".delete");

    checkbox.checked = todo.completed;
    title.textContent = todo.title;
    if (todo.completed) node.classList.add("completed");

    // Events
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      save();
      render();
    });

    delBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      save();
      render();
    });

    editBtn.addEventListener("click", () => {
      if (title.isContentEditable) {
        title.contentEditable = "false";
        title.blur();
        todo.title = title.textContent.trim() || todo.title;
        save();
      } else {
        title.contentEditable = "true";
        title.focus();
      }
    });

    list.appendChild(node);
  }
  stats.textContent = todos.filter((t) => !t.completed).length;
}

// Form Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  todos.push({ id: Date.now().toString(), title, completed: false });
  input.value = "";
  save();
  render();
});

// Filter
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("is-active"));
    filterBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
    filter = btn.dataset.filter;
    render();
  });
});

// Clear completed
clearBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.completed);
  save();
  render();
});

// Erste Anzeige
render();
