// === Variáveis globais e modais ===
let idEditando = null;
let pendingDeleteId = null;
const modalConfirmDelete = document.getElementById("modalConfirmarDelete");
const senhaConfirmInput = document.getElementById("senhaConfirmacao");

// === Seletores principais ===
const cardFuncionarios = document.querySelectorAll(".card-gerente")[0];
const modal = document.getElementById("modalEditarFuncionario");
const closeModal = document.querySelector(".closeModal");
const buscarFuncInput = document.getElementById("buscarFunc");
const tbody = document.getElementById("listaFuncionarios");

// === Token JWT do gerente ===
const token = localStorage.getItem("token");
console.log("Token do gerente:", token);

// === Abrir modal principal ===
cardFuncionarios.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  listarFuncionarios();
});

// === Fechar modal principal ===
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  limparCampos();
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    limparCampos();
  }
});

// === Listar funcionários ===
async function listarFuncionarios() {
  try {
    const response = await fetch("http://localhost:8080/gerente/buscar", {
      headers: { Authorization: "Bearer " + token },
    });
    if (!response.ok) throw new Error("Erro ao buscar funcionários");

    const funcionarios = await response.json();
    exibirFuncionarios(funcionarios);
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    alert("Erro ao carregar lista de funcionários.");
  }
}

// === Exibir funcionários ===
function exibirFuncionarios(funcionarios) {
  tbody.innerHTML = "";

  funcionarios.forEach((f) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${f.id}</td>
      <td>${f.nome}</td>
      <td>${f.email}</td>
      <td>${f.telefone || f.contato || "-"}</td>
      <td>
        <button class="editar" data-id="${f.id}">✏️</button>
        <button class="excluir" data-id="${f.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// === Cadastrar ou Editar funcionário ===
async function salvarFuncionario() {
  const nome = document.getElementById("nomeFunc").value.trim();
  const cpf = document.getElementById("cpfFunc").value.trim();
  const email = document.getElementById("emailFunc").value.trim();
  const telefone = document.getElementById("telFunc").value.trim();

  if (!nome || !email || !telefone || (!idEditando && !cpf)) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  const dados = {
    nome: nome,
    email: email,
    contato: telefone,
  };

  if (!idEditando) dados.cpf = cpf;

  try {
    const url = idEditando
      ? `http://localhost:8080/gerente/editar/${idEditando}`
      : "http://localhost:8080/gerente/adicionar";
    const method = idEditando ? "PUT" : "POST";

    console.log("📤 Enviando requisição:", method, url, dados);

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(dados),
    });

    const text = await response.text();
    console.log("📥 Resposta do servidor:", response.status, text);

    if (response.ok) {
      alert(
        idEditando
          ? "Funcionário atualizado com sucesso!"
          : "Funcionário cadastrado com sucesso!"
      );
      listarFuncionarios();
      limparCampos();
      idEditando = null;
    } else {
      if (text.includes("Campo ja cadastrado")) {
        alert("Nenhuma alteração detectada. Modifique algum campo antes de salvar.");
      } else if (text.includes("FuncionarioJaExistenteException")) {
        alert("Já existe um funcionário com este CPF.");
      } else {
        alert("Erro ao salvar funcionário: " + text);
      }
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao salvar funcionário: " + error.message);
  }
}

// === Preparar formulário para edição ===
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("editar")) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch("http://localhost:8080/gerente/buscar", {
        headers: { Authorization: "Bearer " + token },
      });
      const funcionarios = await response.json();
      const func = funcionarios.find((f) => f.id == id);

      if (func) {
        idEditando = id;
        document.getElementById("nomeFunc").value = func.nome;
        document.getElementById("emailFunc").value = func.email;
        document.getElementById("telFunc").value = func.telefone || func.contato || "";
        document.getElementById("cpfFunc").value = func.cpf || "";
        document.getElementById("cpfFunc").disabled = true;
        alert("Você está editando o funcionário: " + func.nome);
      }
    } catch (error) {
      console.error("Erro ao carregar funcionário:", error);
    }
  }
});

// === Excluir funcionário (abre modal de confirmação) ===
tbody.addEventListener("click", (e) => {
  const btnDelete = e.target.closest(".excluir");
  if (!btnDelete) return;

  const id = btnDelete.dataset.id;
  pendingDeleteId = id;

  modalConfirmDelete.style.display = "flex";
  senhaConfirmInput.value = "";
  senhaConfirmInput.focus();
});

function fecharModalDelete() {
  modalConfirmDelete.style.display = "none";
  pendingDeleteId = null;
  senhaConfirmInput.value = "";
}

async function confirmarDeleteFuncionario() {
  if (!pendingDeleteId) {
    alert("Erro interno: id não definido.");
    fecharModalDelete();
    return;
  }

  const senha = senhaConfirmInput.value.trim();
  if (!senha) {
    alert("Digite a senha do gerente para confirmar.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/gerente/deletar/${pendingDeleteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ senha: senha }),
      }
    );

    if (response.ok || response.status === 204) {
      alert("Funcionário excluído com sucesso!");
      fecharModalDelete();
      listarFuncionarios();
      return;
    }

    if (response.status === 401) {
      alert("Senha incorreta.");
      return;
    }
    if (response.status === 404) {
      alert("Funcionário não encontrado.");
      fecharModalDelete();
      listarFuncionarios();
      return;
    }

    const text = await response.text();
    console.error("Erro ao excluir:", response.status, text);
    alert("Erro ao excluir funcionário: " + (text || response.status));
  } catch (err) {
    console.error("Erro de conexão ao excluir:", err);
    alert("Erro ao conectar ao servidor.");
  }
}

// === Filtro de pesquisa ===
buscarFuncInput.addEventListener("input", async (e) => {
  const termo = e.target.value.toLowerCase();
  try {
    const response = await fetch("http://localhost:8080/gerente/buscar", {
      headers: { Authorization: "Bearer " + token },
    });
    const funcionarios = await response.json();

    const filtrados = funcionarios.filter(
      (f) =>
        f.nome.toLowerCase().includes(termo) ||
        f.email.toLowerCase().includes(termo)
    );

    exibirFuncionarios(filtrados);
  } catch (error) {
    console.error("Erro na busca:", error);
  }
});

// === Limpar campos ===
function limparCampos() {
  document.getElementById("nomeFunc").value = "";
  document.getElementById("cpfFunc").value = "";
  document.getElementById("emailFunc").value = "";
  document.getElementById("telFunc").value = "";
  document.getElementById("cpfFunc").disabled = false;
}