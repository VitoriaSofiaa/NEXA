const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');

function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.className = 'task-item';

    const span = document.createElement('span');
    span.textContent = taskText;
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => {
        li.classList.toggle('completed');
    });

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'btn btn-sm btn-edit';
    editBtn.addEventListener('click', () => {
        const newText = prompt('Editar tarefa:', span.textContent);
        if (newText) {
            span.textContent = newText;
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Excluir';
    deleteBtn.className = 'btn btn-sm btn-delete';
    deleteBtn.addEventListener('click', () => {
        taskList.removeChild(li);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);

    return li;
}

addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = '';
    }
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

//checlist diario
const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
checklistItems.forEach(item => {
    item.addEventListener('change', () => {
        if (item.checked) {
            item.parentElement.classList.add('completed');
        } else {
            item.parentElement.classList.remove('completed');
        }
    });
});

// Adiciona funcionalidade de arrastar e soltar para a lista de tarefas
let draggedItem = null;
taskList.addEventListener('dragstart', (e) => {
    draggedItem = e.target;
    draggedItem.classList.add('dragging');
});
taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
});
taskList.addEventListener('dragend', () => {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
});
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
// Adiciona funcionalidade de editar o checklist diário
const checklistEditBtn = document.getElementById('checklist-edit-btn');
checklistEditBtn.addEventListener('click', () => {
    const checklistItems = document.querySelectorAll('.checklist-item');
    checklistItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        if (checkbox.disabled) {
            checkbox.disabled = false;
            label.style.textDecoration = 'none';
            item.classList.remove('completed');
        } else {
            checkbox.disabled = true;
            label.style.textDecoration = 'line-through';
        }
    });
});

//adiciona funcionalidade de editar e expluir tarefas ja existentes
const taskEditBtns = document.querySelectorAll('.btn-edit');
taskEditBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        const taskText = taskItem.querySelector('span').textContent;
        const newText = prompt('Editar tarefa:', taskText);
        if (newText) {
            taskItem.querySelector('span').textContent = newText;
        }
    });
});
const taskDeleteBtns = document.querySelectorAll('.btn-delete');
taskDeleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
            taskItem.remove();
        }
    });
});
