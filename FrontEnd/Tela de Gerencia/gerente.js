let idFuncionarioEdicao = null;

async function listarFuncionarios() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:8080/gerente/buscar", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("Erro ao buscar funcionários.");
      return;
    }

    const funcionarios = await response.json();
    const tabela = document.getElementById("listaFuncionarios");
    tabela.innerHTML = "";

    funcionarios.forEach((func) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-cpf", func.cpf);
      tr.innerHTML = `
        <td>${func.nome}</td>
        <td>${func.email}</td>
        <td>${func.telefone}</td>
        <td>
          <button onclick="carregarFuncionarioParaEdicao(${func.id}, this)">Editar</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
    alert("Falha na conexão.");
  }
}

function editarFuncionario(id, nome, email, telefone, cpf) {
  idFuncionarioEditando = id;

  document.getElementById("nomeFunc").value = nome;
  document.getElementById("cpfFunc").value = cpf;
  document.getElementById("emailFunc").value = email;
  document.getElementById("telFunc").value = telefone;

  document.getElementById("cpfFunc").disabled = true;
}

function prepararCadastroNovo() {
  idFuncionarioEdicao = null;

  document.getElementById("nomeFunc").value = "";
  document.getElementById("cpfFunc").value = "";
  document.getElementById("emailFunc").value = "";
  document.getElementById("telFunc").value = "";

  document.getElementById("cpfFunc").disabled = false;
}

function carregarFuncionarioParaEdicao(id, botao) {
  idFuncionarioEdicao = id;

  const linha = botao.closest("tr");

  document.getElementById("nomeFunc").value = linha.children[0].textContent;
  document.getElementById("emailFunc").value = linha.children[1].textContent;
  document.getElementById("telFunc").value = linha.children[2].textContent;

  document.getElementById("cpfFunc").value = linha.dataset.cpf;
  document.getElementById("cpfFunc").disabled = true;
}

async function salvarEdicaoFuncionario() {
  const token = localStorage.getItem("token");

  const funcData = {
    nome: document.getElementById("nomeFunc").value,
    email: document.getElementById("emailFunc").value,
    contato: document.getElementById("telFunc").value,
  };

  let url = "";
  let method = "";

  if (idFuncionarioEdicao == null) {
    funcData.cpf = document.getElementById("cpfFunc").value;
    url = "http://localhost:8080/gerente/adicionar";
    method = "POST";
  } else {
    url = `http://localhost:8080/gerente/editar/${idFuncionarioEdicao}`;
    method = "PUT";
  }

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(funcData),
    });

    if (!response.ok) {
      const txt = await response.text();
      alert("Erro ao salvar funcionário:\n" + txt);
      return;
    }
    alert("Salvo com sucesso!");
    listarFuncionarios();

    if (idFuncionarioEdicao != null) {
      prepararCadastroNovo();
    } else {
      limparCampos();
    }
  } catch (e) {
    console.error(e);
    alert("Falha ao salvar");
  }
}

function limparCampos() {
  idFuncionarioEdicao = null;
  document.getElementById("nomeFunc").value = "";
  document.getElementById("emailFunc").value = "";
  document.getElementById("telFunc").value = "";
  document.getElementById("cpfFunc").value = "";

  document.getElementById("cpfFunc").disabled = false;
}

const cardFuncionarios = document.querySelectorAll(".card-gerente")[0];
const modal = document.getElementById("modalEditarFuncionario");
const closeModalBtn = modal.querySelector(".closeModal");

cardFuncionarios.addEventListener("click", function (e) {
  e.preventDefault();
  prepararCadastroNovo();
  modal.style.display = "flex";
  carregarFuncionarios();
});

closeModalBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
