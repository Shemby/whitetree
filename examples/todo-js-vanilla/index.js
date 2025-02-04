const todos = ['feed the kids', 'program the code', 'drink the coffee', 'conquer the world'];

const input = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

// Functions
const renderTodoInEditMode = (todo) => {
    const li = document.createElement('li');
    const input = document.createElement('input');
    const saveBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');

    const index = todos.indexOf(todo);

    input.type = 'text';
    input.value = todo;
    li.append(input);

    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => {
        updateTodo(index, input.value);
    });
    li.append(saveBtn);

    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
        todoList.replaceChild(
            renderTodoInReadMode(todo),
            todoList.childNodes[index]
        );
    });
    li.append(cancelBtn);

    return li;
};

const renderTodoInReadMode = (todo) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');
    const index = todos.indexOf(todo);

    span.textContent = todo;
    span.addEventListener('dblclick', () => {
        todoList.replaceChild(
            renderTodoInEditMode(todo),
            todoList.childNodes[index]
        );
    });
    li.append(span);

    button.textContent = 'Done';
    button.addEventListener('click', () => {
        removeTodo(index);
    });
    li.append(button);

    return li;
};

function addTodo() {
    const description = input.value;
  
    todos.push(description);
    const todo = renderTodoInReadMode(description);
    todoList.append(todo);
  
    input.value = '';
    addTodoBtn.disabled = true;
};
  
function removeTodo(index) {
    todos.splice(index, 1);
    todoList.childNodes[index].remove();
};
  
function updateTodo(index, description) {
    todos[index] = description;
    const todo = renderTodoInReadMode(description);
    todoList.replaceChild(todo, todoList.childNodes[index]);
};

// Init view
for (const todo of todos) {
    todoList.append(renderTodoInReadMode(todo));
};

// Event Listeners
input.addEventListener('input', () => {
    addTodoBtn.disabled = input.value.length < 3;
});

input.addEventListener('keydown', ({key}) => {
    if (key === 'Enter' && input.value.length >= 3) {
        addTodo();
    }
});

addTodoBtn.addEventListener('click', () => {
    addTodo();
});