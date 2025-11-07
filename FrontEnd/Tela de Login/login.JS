const API_URL = "http://localhost:8080/auth/login"; // ajuste a porta se necessário

document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    // Envia requisição de login
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
      const data = await response.json();

      // Armazena o token JWT no localStorage
      localStorage.setItem("token", data.token);

      // ✅ Redireciona para a página do gerente
      window.location.href = "../Tela de Gerencia/gerente.html";
    } else if (response.status === 401) {
      alert("Credenciais inválidas. Verifique seu e-mail e senha.");
    } else {
      alert("Erro ao tentar fazer login. Código: " + response.status);
    }
  } catch (error) {
    console.error("Erro de conexão:", error);
    alert("Falha ao conectar ao servidor. Verifique se o backend está rodando.");
  }
});

// ===============================
// Recuperar senha (em breve)
// ===============================
document.querySelector(".remember-forgot a").addEventListener("click", function (event) {
  event.preventDefault();
  alert("A função de recuperação de senha será implementada em breve.");
});
