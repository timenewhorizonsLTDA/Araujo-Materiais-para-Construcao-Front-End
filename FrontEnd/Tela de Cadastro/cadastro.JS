// Mostrar / esconder senha
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const senhaInput = document.getElementById("senha");
    const type = senhaInput.type === "password" ? "text" : "password";
    senhaInput.type = type;
    this.textContent = type === "password" ? "👁️" : "🙈";
  });

document
  .getElementById("cadastroForm")
  .addEventListener("submit", async function (event) {
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

    if (!nome || !cpf || !email || !telefone || !senha) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dados = {
      nome: nome,
      cpf: cpf,
      email: email,
      contato: telefone,
      senha: senha,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `✅ Cadastro realizado com sucesso! Um código de validação foi enviado para o e-mail de ${result.email}.`
        );
        console.log("Usuário cadastrado:", result);

        localStorage.setItem("usuarioId", result.id);

        // ✅ Redireciona automaticamente após sucesso
        window.location.href = "../Tela de Confirmação/confirmacao.html";
      } else {
        const errorText = await response.text();
        alert(`❌ Erro ao cadastrar: ${errorText}`);
        console.error("Erro na resposta:", errorText);
      }
    } catch (error) {
      alert(
        "❌ Falha ao conectar ao servidor. Verifique se a API está em execução."
      );
      console.error("Erro de conexão:", error);
    }
  });
