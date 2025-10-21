// Alterna entre mostrar/ocultar senha
document.getElementById("togglePassword").addEventListener("click", function() {
  const senhaInput = document.getElementById("senha");
  const type = senhaInput.type === "password" ? "text" : "password";
  senhaInput.type = type;

  // Troca o ícone de acordo com o estado
  this.textContent = type === "password" ? "👁️" : "🙈";
});

// Validação simples do login (exemplo)
document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (login === "Eudersson" && senha === "1234") {
    alert("✅ Login realizado com sucesso!");
    console.log("Login realizado com sucesso!");
  } else {
    alert("❌ Usuário ou senha incorretos.");
    console.log("Usuário ou senha incorretos.");
  }
});
