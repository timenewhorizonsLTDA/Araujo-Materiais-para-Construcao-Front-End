// === Seletores principais ===
const cardFuncionarios = document.querySelectorAll(".card-gerente")[0];
const modal = document.getElementById("modalEditarFuncionario"); // ID corrigido
const closeModal = document.querySelector(".closeModal");
const buscarFuncInput = document.getElementById("buscarFunc");
const tbody = document.getElementById("listaFuncionarios");

// === Token JWT do gerente ===
const token = localStorage.getItem("token");
console.log("Token do gerente:", token);

// === Abrir modal ===
cardFuncionarios.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  listarFuncionarios();
});

// === Fechar modal ===
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// === Função para listar funcionários ===
async function listarFuncionarios() {
  try {
    const response = await fetch("http://localhost:8080/gerente/buscar", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) throw new Error("Erro ao buscar funcionários");

    const funcionarios = await response.json();
    exibirFuncionarios(funcionarios);
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    alert("Erro ao carregar lista de funcionários.");
  }
}

// === Exibir funcionários na tabela ===
function exibirFuncionarios(funcionarios) {
  tbody.innerHTML = "";

  funcionarios.forEach((f) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${f.id}</td>
      <td>${f.nome}</td>
      <td>${f.email}</td>
      <td>${f.contato || "-"}</td>
      <td>
        <button class="editar" data-id="${f.id}">✏️</button>
        <button class="excluir" data-id="${f.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// === Cadastrar funcionário ===
async function salvarFuncionario() {
  const nome = document.getElementById("nomeFunc").value.trim();
  const cpf = document.getElementById("cpfFunc").value.trim();
  const email = document.getElementById("emailFunc").value.trim();
  const telefone = document.getElementById("telFunc").value.trim();

  if (!nome || !cpf || !email || !telefone) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  const dados = {
    nome: nome,
    cpf: cpf,
    email: email,
    contato: telefone,
  };

  try {
    const response = await fetch("http://localhost:8080/gerente/adicionar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(dados),
    });

    if (response.ok) {
      alert("Funcionário cadastrado com sucesso!");
      listarFuncionarios();
      limparCampos();
    } else {
      const errorText = await response.text();
      alert("Erro ao cadastrar funcionário: " + errorText);
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao cadastrar funcionário: " + error.message);
  }
}

// === Excluir funcionário ===
tbody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("excluir")) {
    const id = e.target.dataset.id;

    if (confirm("Deseja realmente excluir este funcionário?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/gerente/deletar/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.ok) {
          alert("Funcionário excluído com sucesso!");
          listarFuncionarios();
        } else {
          alert("Erro ao excluir funcionário.");
        }
      } catch (error) {
        console.error("Erro:", error);
      }
    }
  }
});

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
}
