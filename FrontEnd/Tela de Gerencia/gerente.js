// ==============================
// AUTENTICAÇÃO E PERMISSÃO
// ==============================
(function checarAutenticacao() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../login/login.html"; // redireciona para login
    return;
  }

  try {
    // decodifica token JWT (necessário incluir jwt-decode no HTML)
    const decoded = jwt_decode(token);
    const roles = decoded.roles || decoded.authorities || decoded.role || [];

    const rolesArray = Array.isArray(roles) ? roles : [roles];

    if (!rolesArray.includes("GERENTE")) {
      alert("Você não tem permissão para acessar esta página.");
      window.location.href = "../login/login.html";
      return;
    }

    console.log("✅ Acesso permitido para GERENTE");
  } catch (err) {
    console.error("Token inválido:", err);
    alert("Token inválido. Faça login novamente.");
    localStorage.removeItem("token");
    window.location.href = "../login/login.html";
  }
})();

// ==============================
// VARIÁVEIS GLOBAIS
// ==============================
let idFuncionarioEdicao = null;

// ==============================
// CARREGAR FUNCIONÁRIOS
// ==============================
async function carregarFuncionarios() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:8080/gerente/buscar", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    if (!response.ok) throw new Error("Erro ao buscar funcionários");

    const funcionarios = await response.json();
    const tbody = document.querySelector("#listaFuncionarios");
    tbody.innerHTML = "";

    funcionarios.forEach((f) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${f.id}</td>
        <td>${f.nome}</td>
        <td>${f.email}</td>
        <td>${f.telefone}</td>
      `;
      tr.addEventListener("click", () => abrirModalEdicao(f));
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
    alert("Erro ao carregar funcionários");
  }
}

// ==============================
// MODAL FUNCIONÁRIOS
// ==============================
const cardFuncionarios = document.querySelectorAll(".card-gerente")[0];
const modalEditar = document.getElementById("modalEditarFuncionario");
const closeModal = modalEditar.querySelector(".closeModal");

cardFuncionarios.addEventListener("click", function (e) {
  e.preventDefault();
  modalEditar.style.display = "flex";
  carregarFuncionarios();
});

closeModal.addEventListener("click", function () {
  modalEditar.style.display = "none";
});

window.addEventListener("click", function (e) {
  if (e.target === modalEditar) {
    modalEditar.style.display = "none";
  }
});

// ==============================
// ABRIR MODAL DE EDIÇÃO
// ==============================
function abrirModalEdicao(funcionario) {
  idFuncionarioEdicao = funcionario.id;

  document.getElementById("nomeFunc").value = funcionario.nome;
  document.getElementById("cpfFunc").value = funcionario.cpf || "";
  document.getElementById("emailFunc").value = funcionario.email;
  document.getElementById("telFunc").value = funcionario.telefone;

  modalEditar.style.display = "block";
}

// ==============================
// SALVAR CADASTRO/EDIÇÃO
// ==============================
async function salvarFuncionario() {
  const token = localStorage.getItem("token");

  const nome = document.getElementById("nomeFunc").value.trim();
  const cpf = document.getElementById("cpfFunc").value.trim();
  const email = document.getElementById("emailFunc").value.trim();
  const contato = document.getElementById("telFunc").value.trim();

  if (!nome || !email || !contato) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const url = idFuncionarioEdicao
    ? `http://localhost:8080/gerente/editar/${idFuncionarioEdicao}`
    : "http://localhost:8080/gerente/adicionar";

  const metodo = idFuncionarioEdicao ? "PUT" : "POST";

  const body = idFuncionarioEdicao
    ? { nome, email, contato }
    : { nome, cpf, email, contato };

  try {
    const resp = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const erro = await resp.text();
      alert("❌ Erro: " + erro);
      return;
    }

    alert("✅ Funcionário salvo com sucesso!");
    idFuncionarioEdicao = null;
    modalEditar.style.display = "none";
    carregarFuncionarios();
  } catch (err) {
    console.error(err);
    alert("❌ Erro de conexão.");
  }
}

// ==============================
// MODAL DE DELETE
// ==============================
function abrirModalDelete() {
  document.getElementById("modalConfirmarDelete").style.display = "block";
}

function fecharModalDelete() {
  document.getElementById("modalConfirmarDelete").style.display = "none";
}

// ==============================
// CONFIRMAR DELETE
// ==============================
async function confirmarDeleteFuncionario() {
  const token = localStorage.getItem("token");
  const id = idFuncionarioEdicao;
  const senha = document.getElementById("senhaConfirmacao").value;

  try {
    const resp = await fetch(`http://localhost:8080/gerente/deletar/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ senha }),
    });

    if (resp.status === 401) {
      alert("Senha incorreta");
      return;
    }

    if (resp.status === 404) {
      alert("Funcionário não encontrado");
      return;
    }

    if (!resp.ok) {
      alert("Erro ao excluir funcionário");
      return;
    }

    alert("✅ Funcionário excluído com sucesso!");
    fecharModalDelete();
    modalEditar.style.display = "none";
    carregarFuncionarios();
  } catch (e) {
    console.error(e);
    alert("Erro ao excluir funcionário");
  }
}

// ==============================
// LOGOUT
// ==============================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "../login/login.html";
}
