// Alterna entre mostrar/ocultar senha
document.getElementById("togglePassword").addEventListener("click", function() {
  const senhaInput = document.getElementById("senha");
  const type = senhaInput.type === "password" ? "text" : "password";
  senhaInput.type = type;
  this.textContent = type === "password" ? "👁️" : "🙈";
});

// Validação simples do cadastro
document.getElementById("cadastroForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const aceito = document.getElementById("aceitoTermos").checked;

  if (!aceito) {
    alert("Você deve aceitar os Termos de Uso para continuar.");
    return;
  }

  if (nome && cpf && email && telefone && senha) {
    alert("✅ Cadastro realizado com sucesso!");
    console.log("Cadastro concluído:", { nome, cpf, email, telefone });
  } else {
    alert("Por favor, preencha todos os campos obrigatórios.");
  }
});