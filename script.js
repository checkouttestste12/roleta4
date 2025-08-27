// Estado do jogo aprimorado
let gameState = {
    usuario: null,
    saldo: 0,
    girosGratis: 0,
    girosUsados: 0,
    primeiroDeposito: false,
    roletaGirando: false,
    timeoutGiro: null,
    anguloAtual: 0,
    animacaoId: null,
    velocidadeAtual: 0,
    aceleracao: 0,
    desaceleracao: 0,
    tempoInicioGiro: 0,
    faseGiro: 'parado' // 'parado', 'acelerando', 'constante', 'desacelerando'
};

// Elementos DOM
const elements = {
    cadastroOverlay: document.getElementById('cadastro-overlay'),
    cadastroForm: document.getElementById('cadastro-form'),
    btnGirar: document.getElementById('btn-girar'),
    btnParar: document.getElementById('btn-parar'),
    roleta: document.getElementById('roleta'),
    saldoAtual: document.getElementById('saldo-atual'),
    girosCount: document.getElementById('giros-count'),
    girosInfo: document.getElementById('giros-info'),
    girosTitle: document.getElementById('giros-title'),
    girosSubtitle: document.getElementById('giros-subtitle'),
    roletaContainer: document.getElementById('roleta-gratis-container'),
    girosGratisInfo: document.getElementById('giros-gratis-info'),
    girosPremiosInfo: document.getElementById('giros-premios-info'),
    resultadoModal: document.getElementById('resultado-modal'),
    resultadoTitulo: document.getElementById('resultado-titulo'),
    resultadoDescricao: document.getElementById('resultado-descricao'),
    resultadoIcon: document.getElementById('resultado-icon'),
    premioValor: document.getElementById('premio-valor'),
    premioDisplay: document.getElementById('premio-display'),
    novoSaldo: document.getElementById('novo-saldo'),
    girosRestantesModal: document.getElementById('giros-restantes-modal'),
    girosRestantesCount: document.getElementById('giros-restantes-count'),
    btnContinuar: document.getElementById('btn-continuar'),
    toastContainer: document.getElementById('toast-container'),
    velocidadeIndicator: document.querySelector('.velocidade-bar'),
    roletaWrapper: document.querySelector('.roleta-premium-wrapper'),
    particlesBg: document.getElementById('particles-bg')
};

// Configurações da roleta aprimoradas com física realista
const roletaConfig = {
    setores: [
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 0 },
        { premio: 25, texto: 'R$ 25', cor: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', angulo: 45 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 90 },
        { premio: 50, texto: 'R$ 50', cor: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)', angulo: 135 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 180 },
        { premio: 75, texto: 'R$ 75', cor: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)', angulo: 225 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 270 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 315 }
    ],
    anguloSetor: 45, // 360 / 8 setores
    
    // Física aprimorada
    aceleracaoInicial: 0.8,
    aceleracaoMaxima: 2.5,
    velocidadeMinima: 3,
    velocidadeMaxima: 28,
    velocidadeConstante: 20,
    desaceleracaoBase: 0.96,
    desaceleracaoFinal: 0.92,
    
    // Tempos em milissegundos
    tempoAceleracao: 1500,
    tempoMinimoGiro: 4000,
    tempoMaximoGiro: 8000,
    tempoDesaceleracao: 3000,
    
    // Efeitos visuais
    intensidadeBrilho: 0.4,
    intensidadeSaturacao: 0.3,
    frequenciaTick: 150,
    amplitudeVibracao: 2
};

// Sistema de áudio aprimorado
const audioSystem = {
    context: null,
    sounds: {},
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Áudio não suportado:', e);
        }
    },
    
    createSounds() {
        // Criar sons sintéticos para demonstração
        this.sounds = {
            giro: this.createTone(220, 0.1, 'sawtooth'),
            tick: this.createTone(800, 0.05, 'square'),
            parada: this.createTone(150, 0.3, 'sine'),
            vitoria: this.createTone(440, 0.5, 'sine'),
            derrota: this.createTone(110, 0.3, 'triangle')
        };
    },
    
    createTone(frequency, duration, type = 'sine') {
        return {
            play: () => {
                if (!this.context) return;
                
                const oscillator = this.context.createOscillator();
                const gainNode = this.context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0, this.context.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
                
                oscillator.start(this.context.currentTime);
                oscillator.stop(this.context.currentTime + duration);
            }
        };
    },
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
};

// Inicialização aprimorada
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 RoletaWin Aprimorada - Iniciando...');
    
    setTimeout(() => {
        carregarEstadoJogo();
        inicializarEventListeners();
        atualizarInterface();
        criarParticulas();
        inicializarEfeitosVisuais();
        audioSystem.init();
        
        // Garantir estado inicial correto dos botões
        if (elements.btnGirar && elements.btnParar) {
            elements.btnGirar.classList.remove('hidden');
            elements.btnParar.classList.add('hidden');
            console.log('✅ Estado inicial dos botões configurado');
        }
        
        console.log('🚀 Sistema inicializado com sucesso!');
    }, 100);
});

// Carregar estado do jogo do localStorage
function carregarEstadoJogo() {
    const estadoSalvo = localStorage.getItem('roletaUser');
    if (estadoSalvo) {
        const estadoParsed = JSON.parse(estadoSalvo);
        gameState = { ...gameState, ...estadoParsed };
        console.log('📂 Estado carregado:', gameState);
    }
}

// Salvar estado do jogo no localStorage
function salvarEstadoJogo() {
    const estadoParaSalvar = { ...gameState };
    // Remover propriedades temporárias
    delete estadoParaSalvar.roletaGirando;
    delete estadoParaSalvar.timeoutGiro;
    delete estadoParaSalvar.anguloAtual;
    delete estadoParaSalvar.animacaoId;
    delete estadoParaSalvar.velocidadeAtual;
    delete estadoParaSalvar.aceleracao;
    delete estadoParaSalvar.desaceleracao;
    delete estadoParaSalvar.tempoInicioGiro;
    delete estadoParaSalvar.faseGiro;
    
    localStorage.setItem('roletaUser', JSON.stringify(estadoParaSalvar));
}

// Inicializar event listeners aprimorados
function inicializarEventListeners() {
    if (!elements.btnGirar || !elements.btnParar) {
        console.error('❌ Elementos de botão não encontrados');
        return;
    }
    
    // Botões de controle da roleta com efeito ripple
    elements.btnGirar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnGirar);
        handleGirarClick();
    });
    
    elements.btnParar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnParar);
        handlePararClick();
    });
    
    // Garantir que o botão parar esteja inicialmente oculto
    elements.btnParar.classList.add('hidden');
    
    // Formulário de cadastro
    if (elements.cadastroForm) {
        elements.cadastroForm.addEventListener('submit', handleCadastro);
    }
    
    // Botão continuar do modal de resultado
    if (elements.btnContinuar) {
        elements.btnContinuar.addEventListener('click', fecharModalResultado);
    }
    
    // Fechar modal clicando no backdrop
    if (elements.cadastroOverlay) {
        elements.cadastroOverlay.addEventListener('click', function(e) {
            if (e.target === elements.cadastroOverlay) {
                fecharModalCadastro();
            }
        });
    }
    
    if (elements.resultadoModal) {
        elements.resultadoModal.addEventListener('click', function(e) {
            if (e.target === elements.resultadoModal) {
                fecharModalResultado();
            }
        });
    }
    
    // Botões das mesas pagas
    document.querySelectorAll('.mesa-card[data-valor]').forEach(mesa => {
        const btnJogar = mesa.querySelector('.btn-jogar');
        if (btnJogar) {
            btnJogar.addEventListener('click', (e) => {
                criarEfeitoRipple(e, btnJogar);
                const valor = parseInt(mesa.dataset.valor);
                jogarMesaPaga(valor);
            });
        }
    });
    
    // Eventos de teclado para acessibilidade
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameState.roletaGirando && gameState.usuario && gameState.girosGratis > 0) {
            e.preventDefault();
            handleGirarClick();
        } else if (e.code === 'Space' && gameState.roletaGirando) {
            e.preventDefault();
            handlePararClick();
        }
    });
}

// Criar efeito ripple nos botões
function criarEfeitoRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('btn-ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Handle click no botão girar
function handleGirarClick() {
    if (gameState.roletaGirando) return;
    
    if (!gameState.usuario) {
        mostrarModalCadastro();
    } else if (gameState.girosGratis > 0) {
        girarRoletaAprimorada();
    } else {
        mostrarToast('Você não tem mais giros grátis disponíveis!', 'warning');
    }
}

// Handle click no botão parar
function handlePararClick() {
    if (!gameState.roletaGirando || gameState.faseGiro === 'desacelerando') return;
    pararRoletaAprimorada();
}

// Handle cadastro
function handleCadastro(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    
    if (!nome || !email || !senha) {
        mostrarToast('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    // Simular cadastro
    gameState.usuario = {
        nome: nome,
        email: email
    };
    gameState.girosGratis = 3;
    gameState.girosUsados = 0;
    
    salvarEstadoJogo();
    fecharModalCadastro();
    atualizarInterface();
    
    mostrarToast(`Bem-vindo, ${nome}! Você recebeu 3 giros grátis!`, 'success');
}

// Mostrar modal de cadastro
function mostrarModalCadastro() {
    elements.cadastroOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de cadastro
function fecharModalCadastro() {
    elements.cadastroOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// FUNÇÃO PRINCIPAL APRIMORADA PARA GIRAR A ROLETA
function girarRoletaAprimorada() {
    if (gameState.girosGratis <= 0 || gameState.roletaGirando) {
        return;
    }
    
    console.log('🎯 Iniciando giro aprimorado da roleta');
    
    // Marcar como girando
    gameState.roletaGirando = true;
    gameState.faseGiro = 'acelerando';
    gameState.tempoInicioGiro = Date.now();
    gameState.velocidadeAtual = roletaConfig.velocidadeMinima;
    gameState.aceleracao = roletaConfig.aceleracaoInicial;
    
    // Atualizar interface dos botões
    trocarBotoes(true);
    
    // Adicionar classes para animação dinâmica
    adicionarClassesGiro();
    
    // Tocar som de giro
    audioSystem.playSound('giro');
    
    // Iniciar animação de giro contínuo aprimorada
    iniciarGiroContinuoAprimorado();
    
    mostrarToast('Clique em PARAR quando quiser parar a roleta!', 'info');
}

// Trocar botões com animação suave aprimorada
function trocarBotoes(girando) {
    if (!elements.btnGirar || !elements.btnParar) return;
    
    if (girando) {
        // Transição suave para o botão PARAR
        elements.btnGirar.style.transform = 'scale(0.8)';
        elements.btnGirar.style.opacity = '0';
        
        setTimeout(() => {
            elements.btnGirar.classList.add('hidden');
            elements.btnParar.classList.remove('hidden');
            elements.btnParar.style.transform = 'scale(0.8)';
            elements.btnParar.style.opacity = '0';
            
            requestAnimationFrame(() => {
                elements.btnParar.style.transform = 'scale(1)';
                elements.btnParar.style.opacity = '1';
            });
        }, 200);
    } else {
        // Transição suave para o botão GIRAR
        elements.btnParar.style.transform = 'scale(0.8)';
        elements.btnParar.style.opacity = '0';
        
        setTimeout(() => {
            elements.btnParar.classList.add('hidden');
            elements.btnGirar.classList.remove('hidden');
            elements.btnGirar.style.transform = 'scale(0.8)';
            elements.btnGirar.style.opacity = '0';
            
            requestAnimationFrame(() => {
                elements.btnGirar.style.transform = 'scale(1)';
                elements.btnGirar.style.opacity = '1';
            });
        }, 200);
    }
}

// Adicionar classes de giro com transições suaves
function adicionarClassesGiro() {
    if (elements.roletaContainer) {
        elements.roletaContainer.classList.add('girando');
    }
    if (elements.roletaWrapper) {
        elements.roletaWrapper.classList.add('girando');
    }
    if (elements.girosPremiosInfo) {
        elements.girosPremiosInfo.classList.add('hidden');
    }
    if (elements.roleta) {
        elements.roleta.classList.add('girando');
    }
}

// Remover classes de giro
function removerClassesGiro() {
    if (elements.roletaContainer) {
        elements.roletaContainer.classList.remove('girando');
    }
    if (elements.roletaWrapper) {
        elements.roletaWrapper.classList.remove('girando');
    }
    if (elements.girosPremiosInfo) {
        elements.girosPremiosInfo.classList.remove('hidden');
    }
    if (elements.roleta) {
        elements.roleta.classList.remove('girando');
        elements.roleta.classList.add('parando');
    }
}

// GIRO CONTÍNUO APRIMORADO COM FÍSICA ULTRA-REALISTA
function iniciarGiroContinuoAprimorado() {
    let ultimoTick = 0;
    let ultimoTempoTick = 0;
    
    function animarGiro() {
        if (!gameState.roletaGirando) return;
        
        const tempoAtual = Date.now();
        const tempoDecorrido = tempoAtual - gameState.tempoInicioGiro;
        const deltaTime = tempoAtual - (ultimoTempoTick || tempoAtual);
        ultimoTempoTick = tempoAtual;
        
        // FASE DE ACELERAÇÃO
        if (gameState.faseGiro === 'acelerando') {
            if (tempoDecorrido < roletaConfig.tempoAceleracao) {
                // Aceleração progressiva com curva suave
                const progresso = tempoDecorrido / roletaConfig.tempoAceleracao;
                const curvaAceleracao = easeOutQuart(progresso);
                
                gameState.aceleracao = roletaConfig.aceleracaoInicial + 
                    (roletaConfig.aceleracaoMaxima - roletaConfig.aceleracaoInicial) * curvaAceleracao;
                
                gameState.velocidadeAtual += gameState.aceleracao * (deltaTime / 16.67); // Normalizar para 60fps
                gameState.velocidadeAtual = Math.min(gameState.velocidadeAtual, roletaConfig.velocidadeConstante);
            } else {
                gameState.faseGiro = 'constante';
                gameState.velocidadeAtual = roletaConfig.velocidadeConstante;
                console.log('🏃 Fase: Velocidade constante');
            }
        }
        
        // FASE DE VELOCIDADE CONSTANTE
        else if (gameState.faseGiro === 'constante') {
            // Pequenas variações naturais na velocidade
            const variacao = (Math.random() - 0.5) * 0.5;
            gameState.velocidadeAtual += variacao;
            gameState.velocidadeAtual = Math.max(
                roletaConfig.velocidadeConstante - 2, 
                Math.min(gameState.velocidadeAtual, roletaConfig.velocidadeConstante + 2)
            );
        }
        
        // Atualizar ângulo com suavização
        gameState.anguloAtual += gameState.velocidadeAtual * (deltaTime / 16.67);
        gameState.anguloAtual %= 360;
        
        // Aplicar rotação com transformação suave
        if (elements.roleta) {
            elements.roleta.style.transform = `rotate(${gameState.anguloAtual}deg)`;
        }
        
        // Atualizar indicador de velocidade
        atualizarIndicadorVelocidade();
        
        // Efeito sonoro de tick baseado na velocidade
        const intervaloTick = Math.max(50, roletaConfig.frequenciaTick - (gameState.velocidadeAtual * 4));
        if (tempoAtual - ultimoTick > intervaloTick) {
            audioSystem.playSound('tick');
            ultimoTick = tempoAtual;
        }
        
        // Efeito visual de brilho baseado na velocidade
        aplicarEfeitosVisuais();
        
        gameState.animacaoId = requestAnimationFrame(animarGiro);
    }
    
    animarGiro();
}

// Atualizar indicador de velocidade
function atualizarIndicadorVelocidade() {
    if (elements.velocidadeIndicator) {
        const porcentagem = (gameState.velocidadeAtual / roletaConfig.velocidadeMaxima) * 100;
        elements.velocidadeIndicator.style.width = `${Math.min(100, porcentagem)}%`;
    }
}

// Aplicar efeitos visuais baseados na velocidade
function aplicarEfeitosVisuais() {
    if (!elements.roleta) return;
    
    const intensidadeBrilho = Math.min(1, gameState.velocidadeAtual / roletaConfig.velocidadeMaxima);
    const brilho = 1 + (intensidadeBrilho * roletaConfig.intensidadeBrilho);
    const saturacao = 1 + (intensidadeBrilho * roletaConfig.intensidadeSaturacao);
    
    elements.roleta.style.filter = `brightness(${brilho}) saturate(${saturacao})`;
    
    // Efeito de vibração sutil durante alta velocidade
    if (gameState.velocidadeAtual > roletaConfig.velocidadeConstante * 0.8) {
        const vibracao = (Math.random() - 0.5) * roletaConfig.amplitudeVibracao;
        elements.roleta.style.transform += ` translateX(${vibracao}px)`;
    }
}

// PARAR ROLETA APRIMORADA
function pararRoletaAprimorada() {
    if (!gameState.roletaGirando || gameState.faseGiro === 'desacelerando') return;
    
    console.log('🛑 Iniciando parada aprimorada da roleta');
    
    gameState.faseGiro = 'desacelerando';
    
    // Determinar prêmio baseado no número de giros (lógica de negócio)
    let premioGarantido = null;
    if (gameState.girosUsados === 1) { // Segunda rodada
        premioGarantido = 75; // Garantir R$ 75,00 na segunda rodada
    }
    
    // Calcular posição final com física realista
    const { anguloFinal, premioGanho } = calcularPosicaoFinalAprimorada(premioGarantido);
    
    // Aplicar desaceleração realista até a posição final
    aplicarDesaceleracaoAprimorada(anguloFinal, premioGanho);
}

// CALCULAR POSIÇÃO FINAL APRIMORADA
function calcularPosicaoFinalAprimorada(premioGarantido = null) {
    let setorEscolhido;
    
    if (premioGarantido !== null) {
        // Encontrar setor com o prêmio garantido
        setorEscolhido = roletaConfig.setores.findIndex(setor => setor.premio === premioGarantido);
        if (setorEscolhido === -1) {
            setorEscolhido = Math.floor(Math.random() * roletaConfig.setores.length);
        }
    } else {
        // Para outras rodadas, usar probabilidade realista
        const setoresVazios = [0, 2, 4, 6, 7]; // Índices dos setores vazios
        const setoresPremio = [1, 3, 5]; // Índices dos setores com prêmio
        
        // 70% chance de cair em setor vazio, 30% chance de prêmio
        if (Math.random() < 0.7) {
            setorEscolhido = setoresVazios[Math.floor(Math.random() * setoresVazios.length)];
        } else {
            setorEscolhido = setoresPremio[Math.floor(Math.random() * setoresPremio.length)];
        }
    }
    
    // Calcular ângulo final com precisão aprimorada
    const anguloSetor = setorEscolhido * roletaConfig.anguloSetor;
    const anguloAleatorioNoSetor = Math.random() * roletaConfig.anguloSetor;
    const voltasAdicionais = Math.floor(Math.random() * 3 + 4) * 360; // 4-6 voltas adicionais
    
    // Ajustar para que o ponteiro aponte para o centro do setor
    const ajustePonteiro = roletaConfig.anguloSetor / 2;
    
    // Compensar a rotação atual para garantir precisão
    let anguloFinal = gameState.anguloAtual + voltasAdicionais + anguloSetor + anguloAleatorioNoSetor - ajustePonteiro;
    
    // Garantir que o ângulo final seja positivo
    while (anguloFinal < gameState.anguloAtual + 360) {
        anguloFinal += 360;
    }
    
    const premioGanho = roletaConfig.setores[setorEscolhido].premio;
    
    console.log(`🎯 Setor escolhido: ${setorEscolhido}, Prêmio: R$ ${premioGanho}, Ângulo final: ${anguloFinal.toFixed(2)}°`);
    
    return { anguloFinal, premioGanho };
}

// APLICAR DESACELERAÇÃO APRIMORADA COM CURVA REALISTA
function aplicarDesaceleracaoAprimorada(anguloFinal, premioGanho) {
    const anguloInicial = gameState.anguloAtual;
    const distanciaTotal = anguloFinal - anguloInicial;
    const velocidadeInicial = gameState.velocidadeAtual;
    const tempoInicio = Date.now();
    
    console.log(`🎯 Desaceleração: ${distanciaTotal.toFixed(2)}° em ${roletaConfig.tempoDesaceleracao}ms`);
    
    // Cancelar animação anterior
    if (gameState.animacaoId) {
        cancelAnimationFrame(gameState.animacaoId);
        gameState.animacaoId = null;
    }
    
    // Remover classes de giro e adicionar classe de parada
    removerClassesGiro();
    
    let ultimoTick = 0;
    
    function animarDesaceleracao() {
        const tempoAtual = Date.now();
        const tempoDecorrido = tempoAtual - tempoInicio;
        const progresso = Math.min(1, tempoDecorrido / roletaConfig.tempoDesaceleracao);
        
        // Curva de desaceleração realista (ease-out-cubic)
        const curvaDesaceleracao = easeOutCubic(progresso);
        
        // Calcular posição atual com base na curva
        const anguloAtual = anguloInicial + (distanciaTotal * curvaDesaceleracao);
        gameState.anguloAtual = anguloAtual;
        
        // Calcular velocidade atual baseada na derivada da curva
        const velocidadeAtual = velocidadeInicial * (1 - curvaDesaceleracao) * 0.8;
        gameState.velocidadeAtual = Math.max(0, velocidadeAtual);
        
        // Aplicar rotação
        if (elements.roleta) {
            elements.roleta.style.transform = `rotate(${anguloAtual}deg)`;
        }
        
        // Atualizar indicador de velocidade
        atualizarIndicadorVelocidade();
        
        // Efeito sonoro de tick com frequência decrescente
        const intervaloTick = Math.max(100, roletaConfig.frequenciaTick + (progresso * 200));
        if (tempoAtual - ultimoTick > intervaloTick && progresso < 0.95) {
            audioSystem.playSound('tick');
            ultimoTick = tempoAtual;
        }
        
        // Efeito visual de desaceleração
        aplicarEfeitosVisuais();
        
        // Efeito de \"clique\" nos setores durante a fase final
        if (progresso > 0.85 && Math.random() < 0.15) {
            if (elements.roleta) {
                elements.roleta.style.transform += ' scale(1.01)';
                setTimeout(() => {
                    if (elements.roleta) {
                        elements.roleta.style.transform = `rotate(${anguloAtual}deg)`;
                    }
                }, 50);
            }
        }
        
        if (progresso < 1) {
            gameState.animacaoId = requestAnimationFrame(animarDesaceleracao);
        } else {
            // Finalizar giro com posição exata
            gameState.anguloAtual = anguloFinal;
            if (elements.roleta) {
                elements.roleta.style.transform = `rotate(${anguloFinal}deg)`;
            }
            finalizarGiroAprimorado(premioGanho);
        }
    }
    
    animarDesaceleracao();
}

// Funções de easing para animações suaves
function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function easeOutCirc(t) {
    return Math.sqrt(1 - Math.pow(t - 1, 2));
}

// FINALIZAR GIRO APRIMORADO
function finalizarGiroAprimorado(premioGanho) {
    console.log('🏁 Finalizando giro aprimorado com prêmio:', premioGanho);
    
    // Marcar como não girando
    gameState.roletaGirando = false;
    gameState.faseGiro = 'parado';
    
    // Limpar animações
    if (gameState.animacaoId) {
        cancelAnimationFrame(gameState.animacaoId);
        gameState.animacaoId = null;
    }
    
    // Restaurar interface dos botões
    trocarBotoes(false);
    
    // Remover classe de parada
    if (elements.roleta) {
        elements.roleta.classList.remove('parando');
    }
    
    // Restaurar filtros visuais
    if (elements.roleta) {
        elements.roleta.style.filter = 'none';
    }
    
    // Resetar indicador de velocidade
    if (elements.velocidadeIndicator) {
        elements.velocidadeIndicator.style.width = '0%';
    }
    
    // Tocar som de parada
    audioSystem.playSound('parada');
    
    // Atualizar estado do jogo
    gameState.girosGratis--;
    gameState.girosUsados++;
    gameState.saldo += premioGanho;
    gameState.velocidadeAtual = 0;
    
    // Salvar estado
    salvarEstadoJogo();
    
    // Atualizar interface
    atualizarInterface();
    
    // Mostrar resultado com delay para efeito dramático
    setTimeout(() => {
        if (premioGanho > 0) {
            criarConfetes();
            audioSystem.playSound('vitoria');
            // Efeito de pulsação no setor vencedor
            destacarSetorVencedor();
        } else {
            audioSystem.playSound('derrota');
        }
        
        mostrarModalResultado(premioGanho);
    }, 800);
}

// Destacar setor vencedor com animação
function destacarSetorVencedor() {
    const anguloAtual = gameState.anguloAtual % 360;
    const setorIndex = Math.floor(((360 - anguloAtual + 22.5) % 360) / 45);
    const setores = document.querySelectorAll('.setor');
    
    if (setores[setorIndex]) {
        setores[setorIndex].style.animation = 'setorVencedor 1s ease-in-out 3';
    }
    
    // Adicionar animação CSS se não existir
    if (!document.querySelector('#setor-vencedor-animation')) {
        const style = document.createElement('style');
        style.id = 'setor-vencedor-animation';
        style.textContent = `
            @keyframes setorVencedor {
                0%, 100% { transform: scale(1) rotate(var(--rotation)); }
                50% { transform: scale(1.1) rotate(var(--rotation)); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mostrar modal de resultado aprimorado
function mostrarModalResultado(premioGanho) {
    // Configurar conteúdo do modal
    if (premioGanho > 0) {
        elements.resultadoTitulo.textContent = '🎉 Parabéns!';
        elements.resultadoDescricao.textContent = 'Você ganhou um prêmio incrível!';
        elements.resultadoIcon.innerHTML = '<i class=\"fas fa-trophy\"></i>';
        elements.resultadoIcon.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
    } else {
        elements.resultadoTitulo.textContent = '😔 Que pena!';
        elements.resultadoDescricao.textContent = 'Não foi desta vez, mas continue tentando!';
        elements.resultadoIcon.innerHTML = '<i class=\"fas fa-heart-broken\"></i>';
        elements.resultadoIcon.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)';
    }
    
    // Atualizar valores com animação
    elements.premioValor.textContent = `R$ ${premioGanho.toFixed(2).replace('.', ',')}`;
    elements.novoSaldo.textContent = gameState.saldo.toFixed(2).replace('.', ',');
    elements.girosRestantesCount.textContent = gameState.girosGratis;
    
    if (gameState.girosGratis > 0) {
        elements.girosRestantesModal.style.display = 'flex';
    } else {
        elements.girosRestantesModal.style.display = 'none';
    }
    
    // Mostrar modal
    elements.resultadoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de resultado
function fecharModalResultado() {
    elements.resultadoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Atualizar interface aprimorada
function atualizarInterface() {
    // Atualizar saldo com animação
    if (elements.saldoAtual) {
        elements.saldoAtual.textContent = gameState.saldo.toFixed(2).replace('.', ',');
    }
    
    if (gameState.usuario && gameState.girosGratis > 0) {
        // Usuário logado com giros grátis
        if (elements.girosCount) elements.girosCount.textContent = gameState.girosGratis;
        if (elements.girosInfo) elements.girosInfo.style.display = 'block';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'block';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'block';
        if (elements.btnGirar) elements.btnGirar.style.display = 'block';
        
        // Manter título e subtítulo originais
        if (elements.girosTitle) elements.girosTitle.textContent = '3 Giros Grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Cadastre-se e ganhe até R$ 75,00!';
        
    } else if (gameState.usuario && gameState.girosGratis === 0) {
        // Usuário logado sem giros grátis
        if (elements.girosInfo) elements.girosInfo.style.display = 'none';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'none';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'none';
        if (elements.btnGirar) elements.btnGirar.style.display = 'none';
        if (elements.btnParar) elements.btnParar.style.display = 'none';
        
        // Alterar para estado \"sem giros grátis\"
        if (elements.girosTitle) elements.girosTitle.textContent = 'Sem mais giros grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Experimente nossas mesas com apostas abaixo!';
        
    } else {
        // Usuário não logado
        if (elements.girosInfo) elements.girosInfo.style.display = 'none';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'block';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'block';
        if (elements.btnGirar) elements.btnGirar.style.display = 'block';
        if (elements.btnParar) elements.btnParar.style.display = 'none';
        
        // Manter título e subtítulo originais
        if (elements.girosTitle) elements.girosTitle.textContent = '3 Giros Grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Cadastre-se e ganhe até R$ 75,00!';
    }
}

// Jogar mesa paga
function jogarMesaPaga(valor) {
    if (gameState.saldo < valor) {
        mostrarToast('Saldo insuficiente! Faça um depósito.', 'warning');
        return;
    }
    
    mostrarToast(`Mesa R$ ${valor},00 em desenvolvimento!`, 'info');
}

// Mostrar toast notification aprimorado
function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    
    // Aplicar estilo baseado no tipo
    switch (tipo) {
        case 'success':
            toast.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
            toast.style.color = '#0a0e27';
            break;
        case 'error':
            toast.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)';
            toast.style.color = '#ffffff';
            break;
        case 'warning':
            toast.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
            toast.style.color = '#0a0e27';
            break;
        default:
            toast.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)';
            toast.style.color = '#ffffff';
    }
    
    elements.toastContainer.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400);
    }, 4000);
}

// Criar efeito de confetes aprimorado
function criarConfetes() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;
    
    // Limpar confetes existentes
    container.innerHTML = '';
    
    const cores = ['#ffd700', '#ff6b6b', '#4ecdc4', '#8a2be2', '#00ff88', '#ff9f43', '#ff6b9d'];
    const formas = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 100; i++) {
        const confete = document.createElement('div');
        const forma = formas[Math.floor(Math.random() * formas.length)];
        const cor = cores[Math.floor(Math.random() * cores.length)];
        const tamanho = Math.random() * 10 + 6;
        
        Object.assign(confete.style, {
            position: 'absolute',
            width: `${tamanho}px`,
            height: `${tamanho}px`,
            backgroundColor: cor,
            left: Math.random() * 100 + '%',
            top: '-20px',
            zIndex: '9999',
            pointerEvents: 'none'
        });
        
        // Aplicar forma
        if (forma === 'circle') {
            confete.style.borderRadius = '50%';
        } else if (forma === 'triangle') {
            confete.style.width = '0';
            confete.style.height = '0';
            confete.style.backgroundColor = 'transparent';
            confete.style.borderLeft = `${tamanho/2}px solid transparent`;
            confete.style.borderRight = `${tamanho/2}px solid transparent`;
            confete.style.borderBottom = `${tamanho}px solid ${cor}`;
        }
        
        // Animação personalizada aprimorada
        const duracao = 3 + Math.random() * 4;
        const rotacao = Math.random() * 1080 + 360;
        const deslocamentoX = (Math.random() - 0.5) * 300;
        
        confete.style.animation = `confettiFallAprimorado ${duracao}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        confete.style.setProperty('--rotacao', `${rotacao}deg`);
        confete.style.setProperty('--deslocamento-x', `${deslocamentoX}px`);
        
        container.appendChild(confete);
    }
    
    // Adicionar animação CSS aprimorada se não existir
    if (!document.querySelector('#confetti-animation-aprimorada')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation-aprimorada';
        style.textContent = `
            @keyframes confettiFallAprimorado {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                    opacity: 1;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(100vh) translateX(var(--deslocamento-x)) rotate(var(--rotacao)) scale(0.3);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Criar partículas de fundo aprimoradas
function criarParticulas() {
    if (!elements.particlesBg) return;
    
    for (let i = 0; i < 50; i++) {
        const particula = document.createElement('div');
        const tamanho = Math.random() * 8 + 3;
        const cores = ['rgba(255, 215, 0, 0.4)', 'rgba(138, 43, 226, 0.3)', 'rgba(255, 105, 180, 0.3)', 'rgba(76, 205, 196, 0.3)'];
        const cor = cores[Math.floor(Math.random() * cores.length)];
        
        Object.assign(particula.style, {
            position: 'absolute',
            width: `${tamanho}px`,
            height: `${tamanho}px`,
            backgroundColor: cor,
            borderRadius: '50%',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            pointerEvents: 'none',
            filter: 'blur(1px)'
        });
        
        const duracao = 20 + Math.random() * 30;
        const delay = Math.random() * 15;
        particula.style.animation = `particleFloatAprimorado ${duracao}s linear infinite`;
        particula.style.animationDelay = `${delay}s`;
        
        elements.particlesBg.appendChild(particula);
    }
    
    // Adicionar animação CSS aprimorada se não existir
    if (!document.querySelector('#particle-animation-aprimorada')) {
        const style = document.createElement('style');
        style.id = 'particle-animation-aprimorada';
        style.textContent = `
            @keyframes particleFloatAprimorado {
                0% {
                    transform: translateY(0px) translateX(0px) rotate(0deg) scale(0);
                    opacity: 0;
                }
                5% {
                    opacity: 1;
                    transform: translateY(-20px) translateX(10px) rotate(45deg) scale(1);
                }
                95% {
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(-100vh) translateX(150px) rotate(360deg) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar efeitos visuais aprimorados
function inicializarEfeitosVisuais() {
    // Efeito de hover nos setores da roleta
    const setores = document.querySelectorAll('.setor');
    setores.forEach((setor, index) => {
        setor.addEventListener('mouseenter', () => {
            if (!gameState.roletaGirando) {
                setor.style.transform += ' scale(1.05)';
                setor.style.zIndex = '10';
                setor.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
            }
        });
        
        setor.addEventListener('mouseleave', () => {
            if (!gameState.roletaGirando) {
                setor.style.transform = setor.style.transform.replace(' scale(1.05)', '');
                setor.style.zIndex = 'auto';
                setor.style.boxShadow = 'none';
            }
        });
    });
    
    // Efeito de pulsação no centro da roleta
    const centro = document.querySelector('.center-pulse');
    if (centro) {
        setInterval(() => {
            if (!gameState.roletaGirando) {
                centro.style.animation = 'none';
                setTimeout(() => {
                    centro.style.animation = 'centerPulse 2s ease-in-out infinite';
                }, 10);
            }
        }, 4000);
    }
}

// Função para resetar o jogo (para testes)
function resetarJogo() {
    gameState = {
        usuario: null,
        saldo: 0,
        girosGratis: 0,
        girosUsados: 0,
        primeiroDeposito: false,
        roletaGirando: false,
        timeoutGiro: null,
        anguloAtual: 0,
        animacaoId: null,
        velocidadeAtual: 0,
        aceleracao: 0,
        desaceleracao: 0,
        tempoInicioGiro: 0,
        faseGiro: 'parado'
    };
    localStorage.removeItem('roletaUser');
    atualizarInterface();
    location.reload();
}

// Expor funções para console (desenvolvimento)
window.resetarJogo = resetarJogo;
window.gameState = gameState;
window.roletaConfig = roletaConfig;

console.log('🎰 RoletaWin Aprimorada carregada com sucesso!');

