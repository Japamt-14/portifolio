
// =========================================================
// PORTFÓLIO DE ENZO PEREIRA
// Arquivo: script.js
// Objetivo: controlar as interações e animações do site.
// =========================================================

// 1. Seleciona os elementos HTML que serão manipulados.
const documentoHtml = document.documentElement;
const botaoTema = document.getElementById("botao-tema");
const iconeTema = botaoTema.querySelector("i");

const botaoMenu = document.getElementById("botao-menu");
const listaNavegacao = document.getElementById("lista-navegacao");
const iconeMenu = botaoMenu.querySelector("i");

const textoDigitacao = document.getElementById("texto-digitacao");
const botaoTopo = document.getElementById("botao-topo");
const anoAtual = document.getElementById("ano-atual");

// Verifica se o visitante prefere menos animações no sistema.
const prefereMovimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// =========================================================
// 2. ALTERNÂNCIA ENTRE TEMA CLARO E ESCURO
// =========================================================

// Atualiza o ícone e o texto acessível do botão de tema.
function atualizarBotaoTema(tema) {
    const temaEscuroAtivo = tema === "escuro";

    iconeTema.className = temaEscuroAtivo
        ? "bi bi-sun"
        : "bi bi-moon-stars";

    botaoTema.setAttribute(
        "aria-label",
        temaEscuroAtivo
            ? "Ativar tema claro"
            : "Ativar tema escuro"
    );

    botaoTema.setAttribute(
        "title",
        temaEscuroAtivo
            ? "Mudar para tema claro"
            : "Mudar para tema escuro"
    );
}

// Aplica o tema escolhido à página.
function aplicarTema(tema) {
    documentoHtml.setAttribute("data-tema", tema);

    atualizarBotaoTema(tema);

    // Atualiza a cor da barra do navegador em dispositivos compatíveis.
    const corNavegador = tema === "escuro"
        ? "#151515"
        : "#f8f7f4";

    const metaTema = document.querySelector(
        'meta[name="theme-color"]'
    );

    if (metaTema) {
        metaTema.setAttribute("content", corNavegador);
    }
}

// Tenta recuperar a preferência salva anteriormente.
function carregarTema() {
    let temaSalvo = null;

    try {
        temaSalvo = localStorage.getItem("tema-preferido");
    } catch (erro) {
        // O site continua funcionando mesmo sem acesso ao armazenamento.
    }

    // Se não houver preferência salva, usa o tema do sistema.
    if (temaSalvo === "claro" || temaSalvo === "escuro") {
        aplicarTema(temaSalvo);
        return;
    }

    const sistemaPrefereTemaEscuro = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    aplicarTema(sistemaPrefereTemaEscuro ? "escuro" : "claro");
}

// Alterna o tema quando o botão é clicado.
function alternarTema() {
    const temaAtual = documentoHtml.getAttribute("data-tema");

    const novoTema = temaAtual === "escuro"
        ? "claro"
        : "escuro";

    aplicarTema(novoTema);

    // Salva a escolha para as próximas visitas.
    try {
        localStorage.setItem("tema-preferido", novoTema);
    } catch (erro) {
        // A troca de tema continua funcionando sem armazenamento.
    }
}

botaoTema.addEventListener("click", alternarTema);


// =========================================================
// 3. MENU HAMBÚRGUER PARA CELULARES
// =========================================================

// Abre ou fecha o menu de navegação.
function alternarMenu() {
    const menuEstaAberto = listaNavegacao.classList.toggle(
        "menu-aberto"
    );

    botaoMenu.setAttribute(
        "aria-expanded",
        String(menuEstaAberto)
    );

    botaoMenu.setAttribute(
        "aria-label",
        menuEstaAberto ? "Fechar menu" : "Abrir menu"
    );

    iconeMenu.className = menuEstaAberto
        ? "bi bi-x-lg"
        : "bi bi-list";
}

// Fecha o menu e atualiza o botão.
function fecharMenu() {
    listaNavegacao.classList.remove("menu-aberto");

    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");

    iconeMenu.className = "bi bi-list";
}

// O clique no botão controla a abertura do menu.
botaoMenu.addEventListener("click", alternarMenu);

// Fecha o menu quando uma seção é selecionada.
const linksNavegacao = document.querySelectorAll(
    ".link-navegacao"
);

linksNavegacao.forEach(function (link) {
    link.addEventListener("click", fecharMenu);
});

// Fecha o menu ao pressionar a tecla Escape.
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        fecharMenu();
    }
});

// Se a tela aumentar para o tamanho de computador,
// fecha o menu mobile para evitar que ele fique aberto.
window.addEventListener("resize", function () {
    if (window.innerWidth > 760) {
        fecharMenu();
    }
});


// =========================================================
// 4. EFEITO MÁQUINA DE ESCREVER
// =========================================================

// Estas são as frases exibidas na apresentação principal.
const frasesDigitacao = [
    "Desenvolvimento Web",
    "Front-end",
    "Lógica de Programação",
    "Desenvolvimento Full Stack"
];

let indiceFrase = 0;
let indiceCaractere = 0;
let apagandoTexto = false;

// Controla a escrita e a remoção das letras.
function executarDigitacao() {
    if (!textoDigitacao) {
        return;
    }

    const fraseAtual = frasesDigitacao[indiceFrase];

    if (apagandoTexto) {
        indiceCaractere--;
    } else {
        indiceCaractere++;
    }

    textoDigitacao.textContent = fraseAtual.substring(
        0,
        indiceCaractere
    );

    // Quando a frase termina de ser escrita, aguarda para apagá-la.
    if (!apagandoTexto && indiceCaractere === fraseAtual.length) {
        apagandoTexto = true;

        window.setTimeout(executarDigitacao, 1500);
        return;
    }

    // Quando a frase é apagada, passa para a próxima.
    if (apagandoTexto && indiceCaractere === 0) {
        apagandoTexto = false;

        indiceFrase = (indiceFrase + 1) % frasesDigitacao.length;

        window.setTimeout(executarDigitacao, 350);
        return;
    }

    // Escrever é um pouco mais lento do que apagar.
    const velocidadeDigitacao = apagandoTexto ? 35 : 75;

    window.setTimeout(executarDigitacao, velocidadeDigitacao);
}

// Inicia o efeito somente se o visitante permitir animações.
function iniciarDigitacao() {
    if (prefereMovimentoReduzido) {
        textoDigitacao.textContent = frasesDigitacao[0];
        return;
    }

    executarDigitacao();
}


// =========================================================
// 5. ANIMAÇÕES DE ENTRADA DURANTE A ROLAGEM
// =========================================================

// Seleciona todos os elementos que devem aparecer gradualmente.
const elementosAnimados = document.querySelectorAll(
    ".animar-entrada"
);

// Mostra os elementos quando entram na área visível da tela.
function iniciarAnimacoesRolagem() {
    // Alternativa para navegadores sem suporte ao observador.
    if (!("IntersectionObserver" in window)) {
        elementosAnimados.forEach(function (elemento) {
            elemento.classList.add("visivel");
        });

        return;
    }

    // Em dispositivos com movimento reduzido, não anima.
    if (prefereMovimentoReduzido) {
        elementosAnimados.forEach(function (elemento) {
            elemento.classList.add("visivel");
        });

        return;
    }

    const observadorAnimacoes = new IntersectionObserver(
        function (entradas, observador) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visivel");

                    // Deixa de observar depois que o elemento aparece.
                    observador.unobserve(entrada.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    elementosAnimados.forEach(function (elemento) {
        observadorAnimacoes.observe(elemento);
    });
}


// =========================================================
// 6. BOTÃO VOLTAR AO TOPO
// =========================================================

// Controla a visibilidade do botão durante a rolagem.
function atualizarBotaoTopo() {
    const rolagemAtual = window.scrollY;

    if (rolagemAtual > 450) {
        botaoTopo.classList.add("visivel");
        botaoTopo.setAttribute("aria-hidden", "false");
        botaoTopo.removeAttribute("tabindex");
    } else {
        botaoTopo.classList.remove("visivel");
        botaoTopo.setAttribute("aria-hidden", "true");
        botaoTopo.setAttribute("tabindex", "-1");
    }
}

// Volta ao início da página com rolagem suave.
function voltarAoTopo() {
    window.scrollTo({
        top: 0,
        behavior: prefereMovimentoReduzido ? "auto" : "smooth"
    });
}

// Atualiza o botão enquanto a página é rolada.
window.addEventListener("scroll", atualizarBotaoTopo, {
    passive: true
});

// Executa a rolagem quando o botão é clicado.
botaoTopo.addEventListener("click", voltarAoTopo);


// =========================================================
// 7. ANO AUTOMÁTICO NO RODAPÉ
// =========================================================

// Evita que o ano fique desatualizado nos próximos anos.
function atualizarAno() {
    anoAtual.textContent = new Date().getFullYear();
}


// =========================================================
// 8. INICIALIZAÇÃO DO PORTFÓLIO
// =========================================================

// Executa as funções iniciais quando o documento está pronto.
function iniciarPortfolio() {
    carregarTema();
    iniciarDigitacao();
    iniciarAnimacoesRolagem();
    atualizarAno();
    atualizarBotaoTopo();

    // Garante que o menu comece fechado.
    fecharMenu();
}

// O atributo defer garante que o HTML já foi interpretado
// antes da execução deste arquivo.
iniciarPortfolio();
