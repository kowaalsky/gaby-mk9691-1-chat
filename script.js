const chat = document.getElementById('chat');
const btnPanel = document.getElementById('btn-panel');
let timeoutZoomDiv;
const invertedor = document.getElementById('inverterPosicao')
const warningDiv = document.getElementById('warning');

const zoomLetra = document.getElementById('zoomLetra');

//opcoes chat
const mudarTema = document.getElementById('mudarTema')

let modoCopiarAtivo = false;

let historicoEstados = [];
let endClickCount = 0;
let chatDeletado = false;
let avisoAberto = false;
let lampadaApagada = false;
let somAtivado = false;
let configsFechadas = true;
let mensagensNaoLidas = 0;
let chatAberto = false;

const liMenuOptions = document.getElementById('menu-lis');

const reinitButton = document.getElementById('repeatChat')

const lampadaDiv = document.getElementById('lampada');
const lampadaImagem = document.getElementById('lampadaPropria');
const fioLampada = document.getElementById('fioLampada');

let estadoAtual = 'inicio';
let chatBloqueado = false;

let versaoEstado = 0;
let ultimoClique = { estado: null, opcao: null, versao: null };

let usadoUmaVez = new Set();
let tempoInatividade = null;
let primeiraConversa = true;
let usuarioInteragiu = false;
let botEstaDigitando = false;
let contextoAtual = null;
let opcoesDinamicas = null;

let showCommands = false;

let contadorPerguntaMaisAlgo = 0;
let intervaloCronometroEncerramento = null;
let tempoRestanteCronometro = 0;

let closeChatBtn = document.getElementById('closeChat');

const pfp = document.getElementById('pfpSubeco')
const trash = document.getElementById('end');
const ativarSom = document.getElementById('ativarSom')
const themesDiv = document.getElementById('themes');
const black = document.getElementById('black');
const menu = document.querySelectorAll("menu")[0];

let velocidade_bot;

function escolherAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Carregar velocidade do localStorage se existir
if (localStorage.getItem('velocidade_bot') !== null) {
    velocidade_bot = parseInt(localStorage.getItem('velocidade_bot'));
} else {
    velocidade_bot = 2500; // valor padrão se não existir
}


const velocidadeResposta = document.getElementById('velocidadeResposta');

const interruptor = velocidadeResposta.querySelectorAll(".interruptor");

interruptor.forEach((i) => {
  i.addEventListener('click', () => {
    // Resetar cores
    interruptor.forEach(btn => btn.style.backgroundColor = '');
    
    velocidadeResposta.style.opacity = '0';
    velocidadeResposta.style.pointerEvents = 'none';

    i.style.backgroundColor = '#0d00ff';
    i.style.justifyContent = 'flex-end';

    if (i.classList.contains('imediato')) {
      velocidade_bot = 0;
    } else if (i.classList.contains('apos2seg')) {
      velocidade_bot = 2000;
    } else if (i.classList.contains('apos6seg')) {
      velocidade_bot = 6000;
    } else if (i.classList.contains('apos10seg')) {
      velocidade_bot = 10000;
    } else {
      velocidade_bot = 4500;
    }
    localStorage.setItem('velocidade_bot', velocidade_bot);
  });
});

// Após a declaração do interruptor.forEach(...), adicione:
window.addEventListener('DOMContentLoaded', () => {
    const savedVelocidade = localStorage.getItem('velocidade_bot');
    let botaoAtivar;

    if (savedVelocidade !== null) {
        velocidade_bot = parseInt(savedVelocidade);

        // Identificar qual botão corresponde ao valor salvo
        interruptor.forEach((btn) => {
            const classe = btn.classList;
            if (
                (classe.contains('imediato') && velocidade_bot === 0) ||
                (classe.contains('apos2seg') && velocidade_bot === 2000) ||
                (classe.contains('apos6seg') && velocidade_bot === 6000) ||
                (classe.contains('apos10seg') && velocidade_bot === 10000) ||
                (classe.contains('apos4seg') && velocidade_bot === 4500)
            ) {
                botaoAtivar = btn;
            }
        });
    } else {
        // Se não houver valor salvo, ativar padrão (4500ms)
        velocidade_bot = 4500;
        botaoAtivar = document.querySelector('.interruptor.apos4seg');
        localStorage.setItem('velocidade_bot', velocidade_bot);
    }

    // Aplicar visual de botão ativado
    if (botaoAtivar) {
        botaoAtivar.style.backgroundColor = '#0d00ff';
        botaoAtivar.style.justifyContent = 'flex-end';
    }
});

const velocidadeChatBtn = document.getElementById('btnVelocidadeChat');

velocidadeChatBtn.addEventListener('click', () => {
  velocidadeResposta.style.opacity = '1';
  velocidadeResposta.style.pointerEvents = 'all';
})

function pfpOn(){
    pfp.innerHTML = `<img src="img/subecoChat.webp" alt="Subeco">`
    pfp.style.backgroundColor = '#fff'
}

function pfpOff(){
    pfp.innerHTML = `<img src="img/subecoChat-off.webp" alt="Subeco">`
    pfp.style.backgroundColor = '#b3b3b3'
}

if (localStorage.getItem('somAtivado') === 'true') {
    somAtivado = true;
}

const tamanhoFonteDiv = document.getElementById('tamanhoFonte');

function abrirZoomDiv(){
  resetarInatividadeZoomDiv();
}

function inverterPosicao(){
  if(window.innerWidth < 795){
    alert('Desculpe, essa função não está disponível para versões de celular.');
    return; // impede inverter se menor que 795px
  }

  const pag = document.body;
  pag.style.gridTemplateAreas = `
    "hdchat config"
    "chat config"
    "btnpanel config"
    "footer config"
  `;
  let borderValue = '10px solid #000';
  pag.style.gridTemplateColumns = '1fr 300px';
  nav.style.borderRight = 'none';
  nav.style.borderLeft = borderValue;
  chat.style.borderRight = 'none';
  chat.style.borderLeft = borderValue;
  btnPanel.style.borderRight = 'none';
  btnPanel.style.borderLeft = borderValue;
  warningDiv.style.right = '0';
  warningDiv.style.left = '10px';
  whiteBlock.style.right = '';
  whiteBlock.style.left = '0';
  whiteBlock.style.marginRight = '0';
  whiteBlock.style.marginLeft = '10px';

  // Salva no localStorage ao inverter
  localStorage.setItem('inverter', 'true');
}

function reverterPosicao(){
  const pag = document.body;
  pag.style.gridTemplateAreas = '';
  pag.style.gridTemplateColumns = '';
  nav.style.borderRight = '';
  nav.style.borderLeft = '';
  chat.style.borderRight = '';
  chat.style.borderLeft = '';
  btnPanel.style.borderRight = '';
  btnPanel.style.borderLeft = '';
  warningDiv.style.right = '';
  warningDiv.style.left = '';
  whiteBlock.style.right = '';
  whiteBlock.style.left = '';
  whiteBlock.style.marginRight = '';
  whiteBlock.style.marginLeft = '';

  localStorage.setItem('inverter', 'false');
}

invertedor.addEventListener('click', () => {
  if (localStorage.getItem('inverter') === 'true') {
    reverterPosicao();
  } else {
    inverterPosicao();
  }
});

const mostrarEscreverComandos = document.getElementById('escrever');

document.getElementById('copiarMsg').addEventListener('click', () => {
    modoCopiarAtivo = true;
    alertar('Clique em qualquer mensagem para copiar.')
});


function esconderZoomDiv() {
  tamanhoFonteDiv.style.opacity = '0';
  tamanhoFonteDiv.style.pointerEvents = 'none';
}

function resetarInatividadeZoomDiv() {
  tamanhoFonteDiv.style.opacity = '1';
  tamanhoFonteDiv.style.pointerEvents = 'all';

  clearTimeout(timeoutZoomDiv);
  timeoutZoomDiv = setTimeout(esconderZoomDiv, 5000);
}

['mousemove', 'mousedown', 'touchstart'].forEach(evento => {
  tamanhoFonteDiv.addEventListener(evento, resetarInatividadeZoomDiv);
});


zoomLetra.addEventListener('click', abrirZoomDiv)

const whiteBlock = document.getElementById('blockingChat');

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Erro detectado:', message, source, lineno, colno, error);
    return false; // permite que o erro continue no console
};

chat.addEventListener('wheel', function(e) {
    const atTop = chat.scrollTop === 0;
    const atBottom = chat.scrollHeight - chat.scrollTop === chat.clientHeight;

    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
    }
}, { passive: false });

function abrirTemas(){
    const blackout = document.getElementById('blackout');
    blackout.style.opacity = '1';
    blackout.style.pointerEvents = 'all';
    themesDiv.style.pointerEvents = 'all';
    themesDiv.style.opacity = '1';
    themesDiv.style.top = '50%'
}



function fecharTemas(){
    const blackout = document.getElementById('blackout');
    blackout.style.opacity = '0';
    blackout.style.pointerEvents = 'none';
    themesDiv.style.pointerEvents = 'none';
    themesDiv.style.opacity = '0';
    themesDiv.style.top = '70%'
}

const nav = document.getElementById('navegator');
const navDivs = document.querySelectorAll('nav div');

function aplicarTema() {
    if (chat.classList.contains('cute')) {
        btnPanel.style.backgroundImage = 'linear-gradient(360deg, #ff0095, #ffd2e6)';
        nav.style.backgroundImage = 'linear-gradient(#ff81ca, #ffd2e6)';
        navDivs.forEach((d) => {
          d.style.borderTop = '1px solid #710020';
          d.style.color = '#710020';
        })
    }
    if (chat.classList.contains('light')) {
        btnPanel.style.backgroundImage = 'linear-gradient(360deg, #4e4e4e, #fff)';
        nav.style.backgroundImage = 'linear-gradient(#fff, #c3c3c3)';
        navDivs.forEach((d) => {
          d.style.borderTop = '1px solid #818181';
        })
    }
    if (chat.classList.contains('darks')) {
        btnPanel.style.backgroundImage = 'linear-gradient(360deg, #262626, #fff)';
        nav.style.backgroundImage = 'linear-gradient(#262626, #000)';
        navDivs.forEach((d) => {
          d.style.borderTop = '1px solid #fff';
          d.style.color = '#fff';
        })
    }
    if (chat.classList.contains('sea')) {
        btnPanel.style.backgroundImage = 'linear-gradient(360deg, #00050d, #456cb0)';
        nav.style.backgroundImage = 'linear-gradient(360deg, #00050d, #456cb0)';
        navDivs.forEach((d) => {
          d.style.borderTop = '1px solid #95bcff';
          d.style.color = '#cee0ff';
        })
    }
    if (chat.classList.contains('space')) {
        btnPanel.style.backgroundImage = 'linear-gradient(360deg,#000,#005d59)';
        nav.style.backgroundImage = 'linear-gradient(360deg,#270033, #005d59)';
        navDivs.forEach((d) => {
          d.style.borderTop = '1px solid #e7c9ff';
          d.style.color = '#fff';
        })
    }
}

const burger = document.getElementById('menuhd');



burger.addEventListener('click', (e) => {
  e.stopPropagation(); // evita que o clique no burger feche imediatamente
  nav.style.right = '0';
});

// fecha o nav ao clicar fora
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target) && !burger.contains(e.target)) {
    nav.style.right = '-230px'; // ou ajuste conforme seu CSS
  }
});


navDivs.forEach((div) => {
  div.addEventListener('click', () => {
    nav.style.right = '';
  })
})

mudarTema.addEventListener('click', () => {
    abrirTemas();
})

function resetarUltimoClique() {
  versaoEstado++;
  ultimoClique = { estado: null, opcao: null, versao: null };
}

function horaAgora() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

function tutorialAbrir(){
  mostrarAviso('none', '#333', '#fff', 'Você seguirá à página de tutorial de uso do chat da Submatec. ^_^', 3000);
  setTimeout(() => {
      window.open('https://chat.submatec.com/tutorial', '_blank')
  }, 2000);
}

function turningOnHeaderOpts(){
    trash.classList.remove('disabled-bin');
    reinitButton.classList.remove('disabled');
}

function turningOffHeaderOpts(){
    trash.classList.add('disabled-bin');
    reinitButton.classList.add('disabled');
}

let artigoSaudacao = '';

function saudacao() {
  const h = new Date().getHours();
  if(h >= 6 && h < 12) return 'bom dia';
  if(h >= 12 && h < 18) return 'boa tarde';
  return 'boa noite';
}

  const hr = new Date().getHours();
    if(hr >= 6 && hr < 12){
        artigoSaudacao = 'um';
    }else if(hr >= 12 && hr < 18){
        artigoSaudacao = 'uma';
    }else{
        artigoSaudacao = 'uma';
    }

function offChat(){
    chat.style.pointerEvents = 'none';
    chat.style.userSelect = 'none'
}

function onChat(){
    chat.style.pointerEvents = 'all';
    chat.style.userSelect = 'text'
}

function criarMensagem(texto, tipo='received') {
  const dlg = document.createElement('div');
  dlg.className = 'dlg ' + tipo;
  const tri = document.createElement('div');
  tri.className = 'tri-chat';
  const box = document.createElement('div');
  box.className = 'box';
  const p = document.createElement('p');
if (typeof texto !== 'string') {
    texto = String(texto);
}
p.innerHTML = texto
  .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
  .replace(/\n/g, '<br>');

  const footer = document.createElement('span');
  footer.className = 'footer-chat';
  const hora = document.createElement('p');
  hora.className = 'hora-chat';
  hora.textContent = horaAgora();

  if (!chatAberto) {
    mensagensNaoLidas++;
}


  box.appendChild(p);
  footer.appendChild(hora);

const font = parseInt(localStorage.getItem('tamanhoFonte')) || 15;
box.style.fontSize = `${font}px`;
hora.style.fontSize = `${font - 2}px`;


  box.appendChild(footer);
  dlg.appendChild(tri);
  dlg.appendChild(box);
  chat.appendChild(dlg);
  chat.scrollTop = chat.scrollHeight;
if (tipo === 'received') {
    reproduzirSom('received');
} else if (tipo === 'sent') {
    reproduzirSom('sent');
}
  return dlg;
}

function criarMensagemWhats(texto, url) {
  const dlg = document.createElement('div');
  dlg.className = 'dlg received';
  const tri = document.createElement('div');
  tri.className = 'tri-chat-wpp';
  const box = document.createElement('div');
  box.className = 'box';
  box.style.backgroundImage = 'linear-gradient(45deg, #25D366, #008d34'; // Cor do WhatsApp

  const p = document.createElement('p');
p.innerHTML = `<br><a href="${url}" style="text-decoration: none; font-weight: bold;color: #fff;">${texto}</a>`;


  const footer = document.createElement('span');
  footer.className = 'footer-chat';
  const hora = document.createElement('p');
  hora.className = 'hora-chat';
  hora.style.color = '#fff'
  hora.textContent = horaAgora();

  if (!chatAberto) {
    mensagensNaoLidas++;
}

  box.appendChild(p);
  footer.appendChild(hora);
  box.appendChild(footer);
  dlg.appendChild(tri);
  dlg.appendChild(box);
  chat.appendChild(dlg);
  chat.scrollTop = chat.scrollHeight;
  reproduzirSom('received');
}

function reativarTodosBotoes() {
    const botoes = btnPanel.querySelectorAll('button');
    botoes.forEach(btn => {
        btn.disabled = false;
    });
}

function botDigitando() {
    botEstaDigitando = true;

    if (chatBloqueado) {
    const status = document.querySelector('.status-chat');
    if (status) status.textContent = 'Digitando...';
    return null; // impede de criar o digitando se bloqueado
}

  const status = document.querySelector('.status-chat');
  if (status) status.textContent = 'Digitando...';

  const dlg = document.createElement('div');
  dlg.className = 'dlg received';
  const tri = document.createElement('div');
  tri.className = 'tri-chat';
  const box = document.createElement('div');
  box.className = 'box';
  const p = document.createElement('p');
  p.className = 'typing';
  p.innerHTML = '<span class="dots"><span></span><span></span><span></span></span>';
  const footer = document.createElement('span');
  footer.className = 'footer-chat';
  const hora = document.createElement('p');
  hora.className = 'hora-chat';
  hora.textContent = horaAgora();
  box.appendChild(p);
  footer.appendChild(hora);
  box.appendChild(footer);
  dlg.appendChild(tri);
  dlg.appendChild(box);
  chat.appendChild(dlg);
  chat.scrollTop = chat.scrollHeight;
  return dlg;
}

const fluxo = {
  inicio: {
    respostas: [
      "Eu soube que você fez conosco um serviço para Mary Kay, relacionado a um bilhete informativo, estou correto?",
      "Eu estarei com seus arquivos em até 1 ano, ou seja, 14/08/2026 ^_^",
      "Pois bem... como você quer baixá-lo?\n1 - Em PNG mesmo\n2 - Quero em PDF"
    ],
    opcoes: {
      1: "png",
      2: "pdf",
    }
  },
  png: {
    respostas: [
        "Ok. PNG é um tipo de arquivo onde o fundo é transparente, ok?",
        "Você vai querer a frente e o verso separados ou em uma pastinha zip pra ser melhor na organização? (Funciona melhor num PC)\n\n1 - Os dois separados\n2 - Pasta compactada (ZIP)\n3 - Vou querer em PDF",
    ],
    opcoes: {
      1: "pngsep",
      2: "zip",
      3: "pdf"
    }
  },
  pngsep: {
    respostas: [
      "Ok... seus arquivos serão disponibilizados aqui mesmo, se liga só",
      "A cada link que você apertar, você já baixa automaticamente o seu arquivo, certo? Legal, né? Rs",
    {
      tipo: 'whats',
      texto: 'Frente do seu bilhete',
      url: 'https://drive.google.com/uc?export=download&id=1-Ifqo5LnwIhZUxfVPY5cozIWj04IVM_E'
    },{
      tipo: 'whats',
      texto: 'Verso do seu bilhete',
      url: 'https://drive.google.com/uc?export=download&id=1aNDxCWNkruQ4wIVbmIh5oMe2Mr88-5qp'
    },
    "Você vai querer ele junto (zipado) (1) ou em pdf (2)? Ou deseja encerrar (3)?",
    ],
    opcoes: {
      1: "zip",
      2: "pdf",
      3: "encerrar"
    }
  },
  zip: {
    respostas: [
      "Ok... seu arquivo ZIP será disponibilizado aqui mesmo, se liga só",
      "No link que você apertar, você já baixa automaticamente o seu arquivo, certinho?",
    {
      tipo: 'whats',
      texto: 'Aqui está seu ZIP',
      url: 'https://drive.google.com/uc?export=download&id=1i3zbOl8DEgKO3utA6jDuQQZF29LUmtZZ'
    },
    "Você vai querer ele separado (1) ou em pdf (2)? Ou deseja encerrar (3)?",
    ],
    opcoes: {
      1: "pngsep",
      2: "pdf",
      3: "encerrar"
    }
  },
  pdf: {
    respostas: [
      "Ok... seu arquivo PDF será disponibilizado aqui mesmo, se liga só",
      "No link que você apertar, você já baixa automaticamente o seu PDF, ok? Agora tem um detalhe",
      "O PDF vai te mostrar em um arquivo único as duas imagens juntas!",
    {
      tipo: 'whats',
      texto: 'Aqui está o seu PDF',
      url: 'https://drive.google.com/uc?export=download&id=1EFO1BbNiOz10Hd9MEH1hXxtsws5mR7iu'
    },
    "Você vai querer ele em png (1)? Ou deseja encerrar (2)?",
    ],
    opcoes: {
      1: "png",
      2: "encerrar"
    }
  },
  encerrar: {
    respostas: [
        "Ok, Gabyloide, foi um prazer...",
        "Nos vemos em breve."
    ]
  }
};


function responderVarias(mensagens, delay = velocidade_bot) {
  let i = 0;

  function responderUma() {
if (chatBloqueado) {
    const status = document.querySelector('.status-chat');
    if (status) status.textContent = 'Digitando...';
    return; // impede envio de qualquer mensagem pendente
}


    if (i < mensagens.length) {
      const typing = botDigitando();

      setTimeout(() => {
        typing.remove();

        botEstaDigitando = false;

        const msg = mensagens[i++];

        if (typeof msg === 'string') {
          criarMensagem(msg);
        } else if (typeof msg === 'object' && msg.tipo === 'whats') {
          criarMensagemWhats(msg.texto, msg.url);
        } else if (msg.tipo === 'input-dia') {
        criarMensagemInputNumero(msg.pergunta, msg.contexto);
        } else {
        console.warn('Tipo de mensagem desconhecido:', msg);
        responderUma();
        }

        const status = document.querySelector('.status-chat');
        if (status) status.textContent = 'Online';

        responderUma();
      }, delay);
    }
  }

  responderUma();
}

function criarMensagemInputNumero(pergunta = "Escolha um dia:", contexto = null) {
    contextoAtual = contexto;
    const dlg = document.createElement('div');
    dlg.className = 'dlg received';

    const tri = document.createElement('div');
    tri.className = 'tri-chat';

    const box = document.createElement('div');
    box.className = 'box';

    const p = document.createElement('p');
    p.innerHTML = pergunta;

    // Criação do input e botões
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.marginTop = '5px';

    const btnMenos = document.createElement('button');
    btnMenos.textContent = '➖';
    btnMenos.style.marginRight = '5px';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = 1;
    input.min = 1;
    input.style.width = '60px';
    input.style.textAlign = 'center';
    input.readOnly = true; // para impedir digitação manual, opcional

    const btnMais = document.createElement('button');
    btnMais.textContent = '➕';
    btnMais.style.marginLeft = '5px';

    const btnEnviar = document.createElement('button');
    btnEnviar.textContent = 'Enviar';
    btnEnviar.className = 'botao-num';
    btnEnviar.style.marginLeft = '10px';

    // Incremento e decremento
    btnMenos.addEventListener('click', () => {
        let val = parseInt(input.value);
        if (val > parseInt(input.min)) {
            val--;
            input.value = val;
        }
    });

    btnMais.addEventListener('click', () => {
        let val = parseInt(input.value);
        val++;
        input.value = val;
    });

    btnEnviar.addEventListener('click', () => {
        const valorSelecionado = parseInt(input.value);
        criarMensagem(`Dia escolhido: ${valorSelecionado}`, 'sent');
        dlg.remove();
        responderComBaseNoDia(valorSelecionado);
    });

    container.appendChild(btnMenos);
    container.appendChild(input);
    container.appendChild(btnMais);
    container.appendChild(btnEnviar);

    box.appendChild(p);
    box.appendChild(container);
    dlg.appendChild(tri);
    dlg.appendChild(box);
    chat.appendChild(dlg);
    chat.scrollTop = chat.scrollHeight;
}

function responderComBaseNoDia(dia) {
    let resposta;

    let opcoes = {};

    if (contextoAtual === 'invasao') {
        if (dia <= 7) {
            resposta = ["Seu site foi invadido na primeira semana. Isso está coberto pela nossa garantia de instalação.", "Selecione para prosseguir:\n1 - Solicitar análise / revisão gratuita\n2 - Não quero seguir com o reembolso"];
            opcoes = {
                1: "solicitaranalise",
                2: "inicio",
            };
        } else {
            resposta = `Seu site foi invadido após ${dia} dias após sua compra. Isso significa que passou o prazo dos 7 primeiros dias. :/\nO prazo de ${dia} dias ultrapassou o limite de prazo para verificação gratuita.`, 'Tecle 1 para voltar ao Início.';
            opcoes = {
                1: "inicio"
            };
        }
    } else if (contextoAtual === 'reembolso') {
        if (dia <= 7) {
            resposta = "O pedido de reembolso está dentro do prazo de 7 dias, podemos prosseguir.";
            opcoes = {
                1: "Prosseguir com reembolso",
                2: "Conversar com financeiro",
                3: "Voltar ao início"
            };
        } else {
            resposta = `O prazo de reembolso é de 7 dias. Já se passaram ${dia} dias, precisaremos avaliar caso a caso.`;
            opcoes = {
                1: "Solicitar exceção",
                2: "Conversar com financeiro",
                3: "Voltar ao início"
            };
        }
    } else {
        resposta = `${dia} dias...`;
        opcoes = {
            1: "Voltar ao início"
        };
    }

    const typing = botDigitando();
    setTimeout(() => {
        typing.remove();
        criarMensagem(resposta);
        renderizarTecladoOpcoes(opcoes);
    }, 1500);
}

function renderizarTecladoOpcoes(opcoes) {
        opcoesDinamicas = opcoes;
    btnPanel.innerHTML = '';
    Object.entries(opcoes).forEach(([numero, texto]) => {
        const btn = document.createElement('button');
        btn.className = 'botao-num';
        btn.dataset.valor = numero;
        btn.textContent = `${numero}`;
        btnPanel.appendChild(btn);
    });
}

function renderizarTecladoNumerico(qtd = 10) {
  btnPanel.innerHTML = '';
  const etapa = fluxo[estadoAtual];

  for (let i = 1; i <= qtd; i++) {
    const btn = document.createElement('button');
    btn.className = 'botao-num';
    btn.dataset.valor = i;


const destino = etapa?.opcoes?.[i];

btn.textContent = (destino === 'inicio' && estadoAtual !== 'inicio' && i !== 4) ? 'Voltar' : (destino === 'inicio' && i === 4 ? '4' : i);


    if (usadoUmaVez.has(estadoAtual + '-' + i)) btn.disabled = true;
    btnPanel.appendChild(btn);
  }

  if (usuarioInteragiu) iniciarContagemInatividade();
}


function iniciarContagemInatividade() {
    clearTimeout(tempoInatividade);
    tempoInatividade = setTimeout(() => {
        const typing = botDigitando();
        setTimeout(() => {
            typing.remove();
            botEstaDigitando = false;

            const status = document.querySelector('.status-chat');
            const hora = horaAgora();
            status.textContent = `Visto por último hoje às ${hora}`;

            contadorPerguntaMaisAlgo++;

            if (contadorPerguntaMaisAlgo === 2) {
                enviarMensagemCronometroEncerramento();
            } else {
                criarMensagem("Precisa de mais algo?");
                renderizarBotoesSimNao();
                if (!chatAberto) {
                    mensagensNaoLidas++;
                }

            }
        }, 1000);
    }, 60000);
}

function enviarMensagemCronometroEncerramento() {
    tempoRestanteCronometro = 30; // 30 segundos

    const dlg = document.createElement('div');
    dlg.className = 'dlg received';
    dlg.id = 'msgCronometroEncerramento'; // para facilitar remoção

    const tri = document.createElement('div');
    tri.className = 'tri-chat';

    const box = document.createElement('div');
    box.className = 'box';

    const p = document.createElement('p');
    p.innerHTML = `Como você não me respondeu mais durante 2 minutos, vou encerrar nossa conversação em <span id="cronometroEncerramento">00:30</span>.`

    const footer = document.createElement('span');
    footer.className = 'footer-chat';
    const hora = document.createElement('p');
    hora.className = 'hora-chat';
    hora.textContent = horaAgora();

    box.appendChild(p);
    footer.appendChild(hora);
    box.appendChild(footer);
    dlg.appendChild(tri);
    dlg.appendChild(box);
    chat.appendChild(dlg);
    chat.scrollTop = chat.scrollHeight;

    // Renderiza botão "Voltar" abaixo
    btnPanel.innerHTML = '';
    const btnVoltar = document.createElement('button');
    btnVoltar.className = 'botao-num';
    btnVoltar.textContent = 'Voltar';
    btnVoltar.dataset.extra = 'voltarEncerramento';
    btnPanel.appendChild(btnVoltar);

    // Cronômetro no chat
    const cronometroSpan = document.getElementById('cronometroEncerramento');

    intervaloCronometroEncerramento = setInterval(() => {
        tempoRestanteCronometro--;
        const min = Math.floor(tempoRestanteCronometro / 60).toString().padStart(2, '0');
        const sec = (tempoRestanteCronometro % 60).toString().padStart(2, '0');
        cronometroSpan.textContent = `${min}:${sec}`;

        if (tempoRestanteCronometro <= 0) {
            clearInterval(intervaloCronometroEncerramento);
            deletarConversa();
        }
    }, 1000);
}

function mudarIconeSom() {
    if(!somAtivado){
        ativarSom.style.backgroundColor = '#00ff00cc';
        ativarSom.style.color = '#020';
        ativarSom.innerHTML = '<i class="bi bi-volume-up"></i><p>Ativar som do chat</p>';
    }else{
        ativarSom.style.backgroundColor = '#470b0bcc';
        ativarSom.style.color = '#fff';
        ativarSom.innerHTML = '<i class="bi bi-volume-mute"></i><p>Desativar som do chat</p>';
    }
}

document.addEventListener('DOMContentLoaded', mudarIconeSom)

ativarSom.addEventListener('click', () => {
    somAtivado = !somAtivado;
    localStorage.setItem('somAtivado', somAtivado);

    mudarIconeSom();
});

function reproduzirSom(tipo) {
    if (!somAtivado) return;
    const audio = new Audio(`audio/${tipo}.mp3`);
    audio.play();
}

function mostrarBotaoReiniciar() {
    chatBloqueado = false;

    btnPanel.innerHTML = ''; // limpa botões

    const btn = document.createElement('button');
    btn.className = 'botao-num disabled';
    btn.innerHTML = '<i class="bi bi-repeat"></i> Reiniciar';
    btn.style.marginTop = '10px';

    setTimeout(() => {
        btn.classList.remove('disabled');
    }, 1500);

    btn.addEventListener('click', () => {
        reinitButton.style.animation = 'none';
        setTimeout(() => {
            chat.innerHTML = '';
            btnPanel.innerHTML = '';
            usadoUmaVez.clear();
            estadoAtual = 'inicio';
            primeiraConversa = false;
            usuarioInteragiu = false;
            fecharAlerta();
            resetarUltimoClique();
            onChat();
            configsFechadas = true;
            pfpOn();
            iniciarChat();
        }, 500);
    });

    btnPanel.appendChild(btn);
}

const animacao = 'growing .5s ease-in-out infinite alternate'

function deletarConversa(){
    chatDeletado = true;
    turningOffHeaderOpts();

    chatBloqueado = true;

    // if(chatDeletado){}
    const status = document.querySelector('.status-chat');
    if (status) status.textContent = 'Digitando...';

    const reinitContent = reinitButton.querySelectorAll('span')[0];

    setTimeout(() => {
        reinitButton.classList.remove('disabled');
        reinitContent.style.animation = animacao;
    }, 1500);

    btnPanel.innerHTML = ''; // remove botões
    alertarDel('Chat encerrado!')
    offChat();
    mostrarBotaoReiniciar();

if (status) {
    const hora = horaAgora();
    status.textContent = `Visto por último hoje às ${hora}`;
    botEstaDigitando = false;
    pfpOff();
}
}

trash.addEventListener('click', deletarConversa);

function renderizarBotoesSimNao() {
  btnPanel.innerHTML = '';
  const sim = document.createElement('button');
  sim.textContent = 'Sim';
  sim.className = 'botao-num';
  sim.dataset.extra = 'sim';
  const nao = document.createElement('button');
  nao.textContent = 'Não';
  nao.className = 'botao-num';
  nao.dataset.extra = 'nao';
  btnPanel.appendChild(sim);
  btnPanel.appendChild(nao);
}

function encerrarConversa() {
chatBloqueado = true;

// const status = document.querySelector('.status-chat');
// if (status) status.textContent = 'Digitando...';

  btnPanel.innerHTML = '';
  criarMensagem(`Obrigado pela conversa!\nEspero que eu tenha sido útil.\nVou te ajudar caso precise de mim futuramente. Tenha ${artigoSaudacao} ${saudacao().toLowerCase()}.`);
  const feedback = document.createElement('div');
  feedback.innerHTML = `
    <div id="div-feedback" style="text-align: center; margin-top: 5px;">
      <p>Fui útil?</p>
      <i class="bi bi-hand-thumbs-up" style="font-size: 24px; cursor: pointer; margin-right: 10px;"></i>
      <i class="bi bi-hand-thumbs-down" style="font-size: 24px; cursor: pointer;"></i>
    </div>`;
  chat.appendChild(feedback);
  feedback.scrollIntoView({ behavior: 'smooth' });

  feedback.querySelector('.bi-hand-thumbs-up').onclick = () => {
    const el = feedback.querySelector('.bi-hand-thumbs-up');
    el.classList.replace('bi-hand-thumbs-up', 'bi-hand-thumbs-up-fill');
    el.style.color = 'green';
    setTimeout(() => {
      feedback.innerHTML = '<p class="final-message">Obrigado! ^_^</p>';
    }, 2000);
  };

  feedback.querySelector('.bi-hand-thumbs-down').onclick = () => {
    const el = feedback.querySelector('.bi-hand-thumbs-down');
    el.classList.replace('bi-hand-thumbs-down', 'bi-hand-thumbs-down-fill');
    el.style.color = 'red';
    setTimeout(() => {
      feedback.innerHTML = `
        <div class="final-message">
        <p>Ups :( que pena. No que poderíamos melhorar?</p>
            <form action="https://formsubmit.co/contato@submatec.com" method="POST" target="_blank">
              <input type="text" name="feedback" required placeholder="Digite seu feedback" style="padding:5px; width:80%; border-radius:5px; border:1px solid #ccc;"><br>
              <button type="submit" class="botao-num" style="margin-top:5px">Enviar</button>
            </form>
        </div>`;

      const form = feedback.querySelector('form');
      form.onsubmit = (e) => {
        e.preventDefault();
        const msg = form.querySelector('input').value;
        feedback.innerHTML = `<p class="final-message">Obrigado. O feedback "<b>${msg}</b>" foi enviado à nossa equipe e vou tentar melhorar em breve.</p>`;
        feedback.scrollIntoView({ behavior: 'smooth' });
      };
      feedback.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  };

    const reiniciar = document.createElement('button');

  reiniciar.className = 'botao-num disabled';
  reiniciar.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Reiniciar conversa';
  reiniciar.style.marginTop = '10px';
  reiniciar.onclick = () => {
    chat.innerHTML = '';
    usadoUmaVez.clear();
    estadoAtual = 'inicio';
    primeiraConversa = false;
    usuarioInteragiu = false;
    iniciarChat();
    whiteBlock.style.display = 'none';

  };
  btnPanel.appendChild(reiniciar);
}

btnPanel.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const num = e.target.dataset.valor;
    const extra = e.target.dataset.extra;
    clearTimeout(tempoInatividade);

            if (extra === 'voltarEncerramento') {
            // Parar cronômetro e limpar notificação
            clearInterval(intervaloCronometroEncerramento);
            tempoRestanteCronometro = 0;

            // Remover mensagem do cronômetro
            const msgCronometro = document.getElementById('msgCronometroEncerramento');
        if (msgCronometro) {
            const p = msgCronometro.querySelector('.box p');
            p.innerHTML = `<i class="bi bi-ban"></i> <em>Esta mensagem foi apagada</em>`;
            const hora = msgCronometro.querySelector('.hora-chat');
            if (hora) hora.textContent = horaAgora();
}


            // Resetar contador
            contadorPerguntaMaisAlgo = 0;

            // Retornar ao início
            estadoAtual = 'inicio';
            btnPanel.innerHTML = '';
            responderVarias(fluxo[estadoAtual].respostas);
            const qtdOp = Object.keys(fluxo[estadoAtual].opcoes || {}).length;
            renderizarTecladoNumerico(qtdOp);

            return; // não executa mais nada neste clique
        }

    if (num) {
if (
  ultimoClique.estado === estadoAtual &&
  ultimoClique.opcao === num &&
  ultimoClique.versao === versaoEstado
) {
  console.log('Clique repetido ignorado.');
  return;
}


      usuarioInteragiu = true;
      criarMensagem(e.target.textContent, 'sent');
      reproduzirSom('sent');

      ultimoClique = { estado: estadoAtual, opcao: num, versao: versaoEstado };

      const etapa = fluxo[estadoAtual];
let proximo = null;
if (opcoesDinamicas) {
    proximo = opcoesDinamicas[num]; // usa as opções dinâmicas se existirem
    opcoesDinamicas = null; // limpa após uso
} else {
    proximo = etapa?.opcoes?.[num]; // fluxo normal
}


if (proximo === "voltar") {
  if (historicoEstados.length > 0) {
    estadoAtual = historicoEstados.pop(); // volta ao estado anterior
  } else {
    estadoAtual = 'inicio';
    
    resetarUltimoClique();

    reativarTodosBotoes();
  }

  setTimeout(() => {
    responderVarias(fluxo[estadoAtual].respostas);
    const qtdOp = Object.keys(fluxo[estadoAtual].opcoes || {}).length;
    renderizarTecladoNumerico(qtdOp);
  }, 1500);
}
else if (proximo) {
  historicoEstados.push(estadoAtual);
  estadoAtual = proximo;

      resetarUltimoClique();

  setTimeout(() => {
    responderVarias(fluxo[proximo].respostas);
    const qtdOp = Object.keys(fluxo[proximo].opcoes || {}).length;
    renderizarTecladoNumerico(qtdOp);
  }, 1500);

  
    resetarUltimoClique();
}
else {
  criarMensagem("Desculpe, essa opção não está disponível.");
}
    } else if (extra === 'sim') {
      criarMensagem("Sim", 'sent');
      const typing = botDigitando();
      setTimeout(() => {
        typing.remove();
        botEstaDigitando = false;

        criarMensagem("Tudo bem ^_^! Estou no aguardo!");
        const status = document.querySelector('.status-chat');
        if (status) status.textContent = 'Online';
        const qtdOp = Object.keys(fluxo[estadoAtual].opcoes || {}).length;
        renderizarTecladoNumerico(qtdOp);
      }, 1000);
    } else if (extra === 'nao') {
      criarMensagem("Não", 'sent');
      const typing = botDigitando();
      setTimeout(() => {
        typing.remove();
        botEstaDigitando = false;

        encerrarConversa();
      }, 1000);
    }
  }
});

function iniciarChat() {
    turningOffHeaderOpts();

    contadorPerguntaMaisAlgo = 0;
clearInterval(intervaloCronometroEncerramento);

  btnPanel.innerHTML = '';
  const typing1 = botDigitando();
  setTimeout(() => {
    typing1.remove();
const mensagensPrimeira = [
    `Olá, ${saudacao()}, Gabyloide, vamos falar do seu serviço? Que tal? XD`,
];

const mensagensRetorno = [
    "Olá mais uma vez, Gabyloide!",
];

const msgInicial = primeiraConversa
    ? escolherAleatorio(mensagensPrimeira)
    : escolherAleatorio(mensagensRetorno);

criarMensagem(msgInicial);


    const typing2 = botDigitando();
    setTimeout(() => {
      typing2.remove();
      responderVarias(fluxo[estadoAtual].respostas);
      const qtd = Object.keys(fluxo[estadoAtual].opcoes || {}).length;
      renderizarTecladoNumerico(qtd);
    }, 1000);
  }, 1000);

  setTimeout(() => {
    turningOnHeaderOpts();
  }, 4600);

  if(showCommands){
    return;
  }
}

function mostrarAlerta(msg){
    warningDiv.textContent = msg;
    warningDiv.style.top = '0';
    warningDiv.style.opacity = '1';
}

function alertar(msg){
  warningDiv.textContent = msg;
  warningDiv.style.top = '120px';
  warningDiv.style.opacity = '1';
  setTimeout(() => {
    fecharAlerta();
  }, 2800);
}

function alertarDel(msg){
  whiteBlock.style.display = 'block';
  warningDiv.textContent = msg;
  warningDiv.style.top = '120px';
  warningDiv.style.opacity = '1';
  if(iniciarChat()){
    fecharAlerta();
  }
}

  function fecharAlerta(){
    whiteBlock.style.display = 'none';
    warningDiv.style.top = '0';
    setTimeout(() => {
      warningDiv.textContent = ''
    }, 1000);
  }

  console.log(warningDiv)

reinitButton.addEventListener('click', () => {
    reinitButton.style.animation = 'none';
    onChat();

    if (botEstaDigitando) {
        alertar('Ainda estou digitando... espere até que eu termine de digitar.');     
        return;
    }

  const mensagens = chat.querySelectorAll('.dlg');

  mensagens.forEach(msg => {
    if (msg.classList.contains('received')) {
      const p = msg.querySelector('.box p');
      const hora = msg.querySelector('.hora-chat');
      const status = document.querySelector('.status-chat');
      const hr = horaAgora();
      if (status) status.textContent = `Visto por último hoje às ${hr}`;

      if (p) p.innerHTML = `<i class="bi bi-ban"></i> <em>Esta mensagem foi apagada</em>`;
      pfpOff();
      if (hora) hora.textContent = horaAgora();
    } else if (msg.classList.contains('sent')) {
      msg.remove();
    }
  });

  setTimeout(() => {
    chat.innerHTML = '';
    btnPanel.innerHTML = '';
    usadoUmaVez.clear();
    estadoAtual = 'inicio';
    primeiraConversa = false;
    usuarioInteragiu = false;
    pfpOn();
    fecharAlerta();
    iniciarChat();
  }, 2000);

  setTimeout(() => {
    turningOnHeaderOpts();
  }, 4600);
});

iniciarChat();

const radiosTema = document.querySelectorAll('input[name="tema"]');

// Carregar tema salvo (opcional)
if (localStorage.getItem('temaSelecionado')) {
    const tema = localStorage.getItem('temaSelecionado');
    chat.className = tema;
    document.getElementById(tema).checked = true;
    aplicarTema();
}

radiosTema.forEach(radio => {
    radio.addEventListener('click', () => { // trocado para 'click'
        const temaAtual = localStorage.getItem('temaSelecionado');

        if (radio.id === temaAtual) {
            // mesma opção, apenas fecha
            fecharTemas();
        } else {
            // opção diferente
            chat.className = radio.id;
            aplicarTema();
            const audio = new Audio('audio/concluido.mp3');
            audio.play();
            fecharTemas();
            localStorage.setItem('temaSelecionado', radio.id);
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const fontInput = document.getElementById('fontNumber');
    const btnBigger = document.getElementById('bigger');
    const btnLower = document.getElementById('lower');

    const minFont = 10;
    const maxFont = 21;
    const diff = 2;

    function aplicarFontes(fontSize) {
        document.querySelectorAll('.box').forEach(el => {
            el.style.fontSize = `${fontSize}px`;
        });
        document.querySelectorAll('.hora-chat').forEach(el => {
            el.style.fontSize = `${fontSize - diff}px`;
        });
    }

    // Carregar do localStorage ou usar padrão 15
    let currentFont = parseInt(localStorage.getItem('tamanhoFonte')) || 15;
    if (currentFont < minFont) currentFont = minFont;
    if (currentFont > maxFont) currentFont = maxFont;
    fontInput.value = currentFont;

    // Aplicar imediatamente ao carregar
    aplicarFontes(currentFont);

    // Atualizar fontes e localStorage
    function atualizarFonte(val) {
        if (val < minFont) val = minFont;
        if (val > maxFont) val = maxFont;
        fontInput.value = val;
        aplicarFontes(val);
        localStorage.setItem('tamanhoFonte', val);
    }

    // Ao digitar manualmente
    fontInput.addEventListener('input', () => {
        let val = parseInt(fontInput.value);
        if (isNaN(val)) return;
        atualizarFonte(val);
    });

    // Botão aumentar
    btnBigger.addEventListener('click', () => {
        let val = parseInt(fontInput.value);
        if (val < maxFont) {
            atualizarFonte(val + 1);
        }
    });

    // Botão diminuir
    btnLower.addEventListener('click', () => {
        let val = parseInt(fontInput.value);
        if (val > minFont) {
            atualizarFonte(val - 1);
        }
    });

    console.log('Aplicando fonte ao carregar:', currentFont);
aplicarFontes(currentFont);
});
/**tela cheia */
// Ativa modo copiar
document.getElementById('copiarMsg').addEventListener('click', () => {
    modoCopiarAtivo = true;

    document.querySelectorAll('.dlg.received').forEach(dlg => {
        dlg.classList.add('modo-copiar');
    });

    alertar('Clique em alguma mensagem minha para copiá-la!')
});

// Evento global de clique
document.addEventListener('click', function(e) {
    if (!modoCopiarAtivo) return;

    const dlg = e.target.closest('.dlg.received');

    if (dlg) {
        // Copiar texto
        const textoParaCopiar = dlg.querySelector('.box p').innerText;
        navigator.clipboard.writeText(textoParaCopiar).then(() => {
            // Muda visual ao copiar
            dlg.classList.add('copiado');
            const horaElem = dlg.querySelector('.hora-chat');
            const horaAntiga = horaElem.textContent;
            horaElem.textContent = 'Copiado!';
            horaElem.style.color = '#fff';
            horaElem.classList.add('Copiado');

            setTimeout(() => {
                dlg.classList.remove('copiado');
                horaElem.textContent = horaAntiga;
                horaElem.style.color = '';
                horaElem.classList.remove('copiado');

                // Remove cursor de clique após copiar
                document.querySelectorAll('.dlg.received').forEach(d => {
                    d.classList.remove('modo-copiar');
                });

            }, 4000);
        }).catch(err => {
            alertar('Erro ao copiar: ' + err);
        });

        modoCopiarAtivo = false; // Desativa modo copiar após copiar
    } else {
        // Clicou fora de uma mensagem
        alertar('Clique em alguma mensagem minha para copiá-la!!');
    }
});