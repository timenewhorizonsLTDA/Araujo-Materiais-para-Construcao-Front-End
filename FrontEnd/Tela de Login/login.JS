const API_URL = "http://localhost:8080/auth/login"; // ajuste se necessário

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Armazena o token
        localStorage.setItem("token", token);
        console.log(token);

        // Decodifica o token JWT
        const decoded = jwt_decode(token);
        console.log("🔍 Token decodificado:", decoded);

        // Extrai roles (pode vir como roles, authorities ou role)
        const roles =
          decoded.roles || decoded.authorities || decoded.role || [];

        console.log("👥 Lista de roles encontrados:", roles);

        // Define a hierarquia dos papéis
        const hierarquia = ["CLIENTE", "FUNCIONARIO", "GERENTE"];

        // Garante que roles seja um array
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        // Encontra o papel mais alto
        let roleUsuario = null;
        for (let i = hierarquia.length - 1; i >= 0; i--) {
          if (rolesArray.includes(hierarquia[i])) {
            roleUsuario = hierarquia[i];
            break;
          }
        }

        console.log("✅ Papel final detectado:", roleUsuario);

        // Redireciona conforme o papel
        if (roleUsuario === "CLIENTE") {
          window.location.href = "../Tela Inicial/inicial.html";
        } else if (roleUsuario === "FUNCIONARIO") {
          window.location.href = "../Tela de Funcionário/funcinario.html";
        } else if (roleUsuario === "GERENTE") {
          window.location.href = "../Tela de Gerencia/gerente.html";
        } else {
          alert("Papel de usuário desconhecido. Contate o suporte técnico.");
        }
      } else if (response.status === 401) {
        alert("Credenciais inválidas. Verifique seu e-mail e senha.");
      } else {
        alert("Erro ao tentar fazer login. Código: " + response.status);
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert(
        "Falha ao conectar ao servidor. Verifique se o backend está rodando."
      );
    }
  });

// ===============================
// Recuperar senha (em breve)
// ===============================
document
  .querySelector(".remember-forgot a")
  .addEventListener("click", function (event) {
    event.preventDefault();
    alert("A função de recuperação de senha será implementada em breve.");
  });
