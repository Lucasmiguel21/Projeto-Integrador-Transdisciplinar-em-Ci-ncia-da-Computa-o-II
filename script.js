let carrinho = [];

// Função para adicionar produto ao carrinho
function adicionarCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva no localStorage
    atualizarCarrinho();
}

// Função para atualizar o carrinho na tela inicial
function atualizarCarrinho() {
    let listaCarrinho = document.getElementById('listaCarrinho');
    listaCarrinho.innerHTML = '';
    carrinho.forEach(item => {
        let li = document.createElement('li');
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        let btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => removerItemCarrinho(item);
        li.appendChild(btnRemover);
        listaCarrinho.appendChild(li);
    });
    calcularTotalCarrinho();
}

// Função para calcular o total do carrinho
function calcularTotalCarrinho() {
    const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho')) || [];
    let total = carrinhoSalvo.reduce((acc, item) => acc + item.preco, 0);
    let totalElemento = document.getElementById('totalCarrinho');
    if (totalElemento) {
        totalElemento.textContent = `Total: R$ ${total.toFixed(2)}`;
    }
}

// Função para remover item do carrinho
function removerItemCarrinho(item) {
    carrinho = carrinho.filter(i => i !== item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Atualiza no localStorage
    atualizarCarrinho();
}

// Função para finalizar a compra

function finalizarCompra() {
    const usuarioNome = sessionStorage.getItem('usuarioNome');
    
    if (!usuarioNome) {
        alert("Você precisa estar logado para finalizar a compra.");
        window.location.href = 'login.html';  // Redireciona para login
        return;
    }

    if (carrinho.length > 0) {
        window.location.href = 'finalizar-compra.html';
    } else {
        alert("O carrinho está vazio!");
    }
}
// Função para cadastrar o usuário
function cadastrarUsuario() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const email = document.getElementById('email').value;

    if (usuarios.some(usuario => usuario.email === email)) {
        alert('E-mail já cadastrado!');
        return;
    }

    const novoUsuario = {
        nome: document.getElementById('nome').value,
        email,
        senha: document.getElementById('senha').value,
        endereco: document.getElementById('endereco').value,
        cep: document.getElementById('cep').value,
        numero: document.getElementById('numero').value
    };

    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
}

// Função para validar o login
function validarLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioValido = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

    if (usuarioValido) {
        alert('Login bem-sucedido');
        sessionStorage.setItem('usuarioNome', usuarioValido.nome);
        window.location.href = 'index.html';
    } else {
        alert('E-mail ou senha incorretos.');
    }
}

// Verificação de login e cadastro
document.addEventListener('DOMContentLoaded', function() {
    const usuarioNome = sessionStorage.getItem('usuarioNome');
    if (usuarioNome) {
        const saudacao = document.getElementById('saudacao');
        if (saudacao) {
            saudacao.textContent = `Bem-vindo, ${usuarioNome}`;
        }
    }

    if (window.location.pathname.includes('finalizar-compra.html')) {
        mostrarProdutosComprados();
    }

    if (document.getElementById('formLogin')) {
        document.getElementById('formLogin').onsubmit = function(event) {
            event.preventDefault();
            validarLogin();
        };
    }

    if (document.getElementById('formCadastro')) {
        document.getElementById('formCadastro').onsubmit = function(event) {
            event.preventDefault();
            cadastrarUsuario();
        };
    }
});

// Função para carregar produtos na página de finalização
function mostrarProdutosComprados() {
    let listaProdutos = document.getElementById('listaProdutos');
    let carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinhoSalvo.length === 0) {
        listaProdutos.innerHTML = '<p>O carrinho está vazio.</p>';
        return;
    }

    carrinhoSalvo.forEach(item => {
        let li = document.createElement('li');
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        listaProdutos.appendChild(li);
    });
}

// Função para finalizar o pedido
function finalizarPedido() {
    let nome = document.getElementById('nome').value;
    let endereco = document.getElementById('endereco').value;
    let cidade = document.getElementById('cidade').value;
    let cep = document.getElementById('cep').value;
    let pagamento = document.querySelector('input[name="pagamento"]:checked').value;

    if (pagamento === 'cartao') {
        let numeroCartao = document.getElementById('numeroCartao').value;
        let nomeCartao = document.getElementById('nomeCartao').value;
        let validade = document.getElementById('validade').value;
        let cvv = document.getElementById('cvv').value;

        if (!numeroCartao || !nomeCartao || !validade || !cvv) {
            alert("Por favor, preencha todos os dados do cartão de crédito.");
            return;
        }
    }

    if (nome && endereco && cidade && cep && pagamento) {
        alert(`Pedido finalizado com sucesso!\nNome: ${nome}\nEndereço: ${endereco}\nCidade: ${cidade}\nCEP: ${cep}\nForma de Pagamento: ${pagamento}`);
    } else {
        alert("Por favor, preencha todos os campos antes de finalizar o pedido.");
    }
}
