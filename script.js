
const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateRemaining = () => {
    remaining.textContent = todos.filter(todo => !todo.isCompleted).length;
};

const getFilteredTodos = () => {
    if (currentFilter === "active") return todos.filter(t => !t.isCompleted);
    if (currentFilter === "completed") return todos.filter(t => t.isCompleted);
    return todos;
};
const populateTodos = () => {
    todoListUl.innerHTML = getFilteredTodos().map(todo => `
        <li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""}>
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>
    `).join("");
};
addTodoBtn.addEventListener("click", () => {
    const text = inputTag.value.trim();
    if (text.length < 3) {
        alert("Todo must be at least 3 characters");
        return;
    }

    todos.push({
        id: "todo-" + Date.now(),
        title: text,
        isCompleted: false
    });

    inputTag.value = "";
    saveTodos();
    populateTodos();
    updateRemaining();
});
todoListUl.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    if (e.target.classList.contains("delete-btn")) {
        todos = todos.filter(todo => todo.id !== li.id);
    }
    if (e.target.classList.contains("todo-checkbox")) {
        todos = todos.map(todo =>
            todo.id === li.id
                ? { ...todo, isCompleted: e.target.checked }
                : todo
        );
    }

    saveTodos();
    populateTodos();
    updateRemaining();
});
const setActiveBtn = (btn) => {
    document.querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
};

allBtn.onclick = () => {
    currentFilter = "all";
    setActiveBtn(allBtn);
    populateTodos();
};

activeBtn.onclick = () => {
    currentFilter = "active";
    setActiveBtn(activeBtn);
    populateTodos();
};

completedBtn.onclick = () => {
    currentFilter = "completed";
    setActiveBtn(completedBtn);
    populateTodos();
};
clearCompletedBtn.onclick = () => {
    todos = todos.filter(todo => !todo.isCompleted);
    saveTodos();
    populateTodos();
    updateRemaining();
};
populateTodos();
updateRemaining();
