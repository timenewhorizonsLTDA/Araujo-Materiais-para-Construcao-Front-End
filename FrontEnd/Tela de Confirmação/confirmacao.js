const inputs = document.querySelectorAll(".code-inputs input");
const button = document.querySelector("button");
const emailDoUsuario = localStorage.getItem("emailCadastrado");

if (!emailDoUsuario) {
  alert("Erro: e-mail não encontrado! Volte para a tela de cadastro.");
  window.location.href = "cadastro.html";
}

inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    if (input.value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && input.value === "" && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

button.addEventListener("click", () => {
  let codigo = "";
  inputs.forEach((i) => (codigo += i.value));
  const codigoCorreto = "123456";

  if (codigo.length < 6) {
    alert("Digite todos os 6 dígitos!");
    return;
  }

  if (codigo === codigoCorreto) {
    window.location.href = "painelGerente.html";
  } else {
    alert("Código incorreto. Verifique seu email.");
  }
});
