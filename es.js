window.onload = () => {
  inicializarChecklist();
  inicializarEventosDasTarefas();
  inicializarAdicionarTarefa();
};

// Marcar/desmarcar checklist
function inicializarChecklist() {
  document
    .querySelectorAll('.checklist input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const item = checkbox.closest(".checklist-item");
        if (item) item.classList.toggle("completed", checkbox.checked);
      });
    });
}

// Eventos para tarefas existentes
function inicializarEventosDasTarefas() {
  document.querySelectorAll(".task-item").forEach((task) => {
    const span = task.querySelector("span");
    const btnEdit = task.querySelector(".btn-edit");
    const btnDelete = task.querySelector(".btn-delete");

    btnDelete?.addEventListener("click", () => task.remove());

    btnEdit?.addEventListener("click", () => {
      editarInline(span);
    });

    // Drag and drop
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragover", dragOver);
    task.addEventListener("drop", drop);
    task.addEventListener("dragend", dragEnd);
  });
}

// Função de edição inline acionada pelo botão
function editarInline(span) {
  const textoOriginal = span.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = textoOriginal;
  input.className = "inline-edit";

  const tarefa = span.closest(".task-item");
  span.replaceWith(input);
  input.focus();

  const salvar = () => {
    const novoTexto = input.value.trim() || textoOriginal;
    const novoSpan = document.createElement("span");
    novoSpan.textContent = novoTexto;
    input.replaceWith(novoSpan);

    const btnEdit = tarefa.querySelector(".btn-edit");
    btnEdit.onclick = () => editarInline(novoSpan);
  };

  input.addEventListener("blur", salvar);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      input.blur();
    }
  });
}

function inicializarAdicionarTarefa() {
  const input = document.getElementById("new-task-input");
  const btn = document.getElementById("add-task-btn");

  btn.addEventListener("click", () => adicionarTarefa(input.value));
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") adicionarTarefa(input.value);
  });
}

function adicionarTarefa(texto) {
  texto = texto.trim();
  if (!texto) return;

  const ul = document.querySelector(".task-list");
  const li = document.createElement("li");
  li.className = "task-item";
  li.setAttribute("draggable", "true");

  li.innerHTML = `
        <span>${texto}</span>
        <div class="task-actions">
            <button class="btn btn-sm btn-edit">Editar</button>
            <button class="btn btn-sm btn-delete">Excluir</button>
        </div>
    `;

  ul.insertBefore(li, ul.querySelector(".add-task"));
  document.getElementById("new-task-input").value = "";

  inicializarEventosDasTarefas();
}

let tarefaSendoArrastada = null;

function dragStart() {
  tarefaSendoArrastada = this;
  this.style.opacity = "0.5";
}

function dragOver(e) {
  e.preventDefault();
  const destino = this;
  if (destino !== tarefaSendoArrastada) {
    destino.style.borderTop = "2px solid #00aaff";
  }
}

function drop(e) {
  e.preventDefault();
  const destino = this;
  destino.style.borderTop = "";
  if (tarefaSendoArrastada && destino !== tarefaSendoArrastada) {
    const lista = destino.parentNode;
    lista.insertBefore(tarefaSendoArrastada, destino);
  }
}

function dragEnd() {
  this.style.opacity = "1";
  document.querySelectorAll(".task-item").forEach((task) => {
    task.style.borderTop = "";
  });
}
