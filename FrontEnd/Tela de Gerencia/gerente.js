const cardFuncionarios = document.querySelectorAll(".card-gerente")[0];
const modal = document.getElementById("modal-funcionarios");
const closeModal = document.querySelector(".closeModal");



// abrir modal ao clicar no card Funcionários
cardFuncionarios.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
});

// fechar modal ao clicar no X
closeModal.addEventListener("click", function () {
    modal.style.display = "none";
});

// fechar modal ao clicar fora dele
window.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
    cadastroForm.addEventListener("submit", async function (event){
        event.preventDefault();

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
                        },
                        body: JSON.stringify(dados),
                    });
        
                    if (response.ok) {
                        alert("Funcionário cadastrado com sucesso!");
                        cadastroForm.reset();
                    } else {
                        alert("Erro ao cadastrar funcionário."+ response.statusText);
                    }
                } catch (error) {
                    console.error("Erro:", error);
                    alert("Erro ao cadastrar funcionário."+ error.message);
                }
            });
        }