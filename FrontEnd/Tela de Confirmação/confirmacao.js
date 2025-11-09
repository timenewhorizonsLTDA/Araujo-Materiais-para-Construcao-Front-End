document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".code-inputs input");
  const btnEntrar = document.querySelector("button");
  const linkReenviar = document.querySelector(".remember-forgot a");
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert(
      "Erro: Nenhum usuário encontrado. Volte e faça o cadastro novamente."
    );
    window.location.href = "../Tela de Cadastro/cadastro.html";
    return;
  }

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });
  });

  btnEntrar.addEventListener("click", async () => {
    let codigo = "";
    inputs.forEach((input) => (codigo += input.value));

    if (codigo.length !== 6) {
      alert("Digite os 6 dígitos do código.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/validar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo: codigo }),
      });

      if (response.ok) {
        alert("✅ Validação concluída com sucesso! Agora realize o login.");
        // após validar — manda p/ login
        window.location.href = "../Tela de Login/login.html";
      } else {
        const erro = await response.text();
        alert("❌ Código inválido: " + erro);
      }
    } catch (e) {
      alert("Erro ao conectar ao servidor.");
      console.log(e);
    }
  });

  // REENVIAR código
  linkReenviar.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/auth/reenviar/${usuarioId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert("🔄 Código reenviado com sucesso!");
      } else {
        alert("Erro ao reenviar o código.");
      }
    } catch (e) {
      alert("Erro ao conectar ao servidor.");
    }
  });
});
