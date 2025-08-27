// ===== ROLETA PROFISSIONAL - VERSÃO APRIMORADA =====
// Sistema de física realista e animações fluidas

// Estados da máquina de estados da roleta
const ESTADOS_ROLETA = {
    IDLE: 'idle',
    SPINNING: 'spinning',
    STOPPING: 'stopping',
    STOPPED: 'stopped'
};

// Estado do jogo com gerenciamento robusto
let gameState = {
    usuario: null,
    saldo: 0,
    girosGratis: 0,
    girosUsados: 0,
    primeiroDeposito: false,
    
    // Estado da roleta
    estadoRoleta: ESTADOS_ROLETA.IDLE,
    anguloAtual: 0,
    velocidadeAtual: 0,
    aceleracaoAtual: 0,
    
    // Controles de animação
    animacaoId: null,
    tempoInicioGiro: 0,
    duracaoGiroTotal: 0,
    
    // Locks para prevenir ações simultâneas
    bloqueado: false,
    
    // Configurações de física
    fisica: {
        velocidadeMaxima: 20,
        aceleracaoInicial: 0.8,
        desaceleracaoFinal: 0.92,
        inercia: 0.98,
        atrito: 0.995
    }
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

// Configurações da roleta com física realista
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
    anguloSetor: 45,
    
    // Física aprimorada com curvas realistas
    fisica: {
        // Fase de aceleração
        tempoAceleracao: 2000,
        aceleracaoMaxima: 1.2,
        curvaAceleracao: 'easeOutCubic',
        
        // Fase de velocidade constante
        tempoVelocidadeConstante: 2500,
        velocidadeConstante: 18,
        
        // Fase de desaceleração
        tempoDesaceleracao: 3000,
        desaceleracaoInicial: 0.98,
        desaceleracaoFinal: 0.94,
        curvaDesaceleracao: 'easeInOutCubic',
        
        // Configurações de precisão
        voltasMinimas: 4,
        voltasMaximas: 7,
        precisaoFinal: 0.1
    },
    
    // Efeitos visuais
    efeitos: {
        blur: {
            minimo: 0,
            maximo: 2,
            threshold: 10
        },
        brilho: {
            minimo: 1,
            maximo: 1.3,
            threshold: 15
        },
        particulas: {
            quantidade: 30,
            velocidade: 2,
            tamanho: { min: 2, max: 6 }
        }
    }
};

// ===== SISTEMA DE FÍSICA AVANÇADO =====

class FisicaRoleta {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.posicao = 0;
        this.velocidade = 0;
        this.aceleracao = 0;
        this.tempo = 0;
        this.fase = 'idle';
        this.posicaoAlvo = null;
        this.parametrosCurva = null;
    }
    
    // Curvas de easing profissionais
    static easing = {
        easeOutCubic: t => 1 - Math.pow(1 - t, 3),
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        easeOutQuart: t => 1 - Math.pow(1 - t, 4),
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
        easeOutCirc: t => Math.sqrt(1 - Math.pow(t - 1, 2)),
        easeInOutCirc: t => t < 0.5 
            ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2
    };
    
    iniciarAceleracao() {
        this.fase = 'acelerando';
        this.tempo = 0;
        this.velocidade = 2; // Velocidade inicial suave
        this.aceleracao = roletaConfig.fisica.aceleracaoMaxima;
    }
    
    iniciarVelocidadeConstante() {
        this.fase = 'constante';
        this.tempo = 0;
        this.velocidade = roletaConfig.fisica.velocidadeConstante;
        this.aceleracao = 0;
    }
    
    iniciarDesaceleracao(posicaoAlvo) {
        this.fase = 'desacelerando';
        this.tempo = 0;
        this.posicaoAlvo = posicaoAlvo;
        
        // Calcular parâmetros da curva de desaceleração
        const distanciaRestante = posicaoAlvo - this.posicao;
        const tempoDesaceleracao = roletaConfig.fisica.tempoDesaceleracao;
        
        this.parametrosCurva = {
            posicaoInicial: this.posicao,
            velocidadeInicial: this.velocidade,
            distanciaTotal: distanciaRestante,
            tempoTotal: tempoDesaceleracao
        };
    }
    
    atualizar(deltaTime) {
        this.tempo += deltaTime;
        
        switch (this.fase) {
            case 'acelerando':
                this.atualizarAceleracao(deltaTime);
                break;
            case 'constante':
                this.atualizarVelocidadeConstante(deltaTime);
                break;
            case 'desacelerando':
                this.atualizarDesaceleracao(deltaTime);
                break;
        }
        
        // Atualizar posição com suavização
        this.posicao += this.velocidade * (deltaTime / 16.67); // Normalizar para 60fps
        
        return {
            posicao: this.posicao,
            velocidade: this.velocidade,
            fase: this.fase,
            completo: this.fase === 'parado'
        };
    }
    
    atualizarAceleracao(deltaTime) {
        const progresso = Math.min(1, this.tempo / roletaConfig.fisica.tempoAceleracao);
        const curva = FisicaRoleta.easing.easeOutCubic(progresso);
        
        this.velocidade = 2 + (roletaConfig.fisica.velocidadeConstante - 2) * curva;
        
        if (progresso >= 1) {
            this.iniciarVelocidadeConstante();
        }
    }
    
    atualizarVelocidadeConstante(deltaTime) {
        // Pequenas variações para simular imperfeições realistas
        const variacao = (Math.sin(this.tempo * 0.01) * 0.2);
        this.velocidade = roletaConfig.fisica.velocidadeConstante + variacao;
        
        if (this.tempo >= roletaConfig.fisica.tempoVelocidadeConstante) {
            // Aguardar comando de parada ou continuar girando
            if (gameState.estadoRoleta === ESTADOS_ROLETA.STOPPING) {
                // Comando de parada já foi dado
                return;
            }
        }
    }
    
    atualizarDesaceleracao(deltaTime) {
        const progresso = Math.min(1, this.tempo / this.parametrosCurva.tempoTotal);
        const curva = FisicaRoleta.easing.easeInOutCubic(progresso);
        
        // Interpolação suave para a posição final
        const posicaoAtual = this.parametrosCurva.posicaoInicial + 
            (this.parametrosCurva.distanciaTotal * curva);
        
        // Calcular velocidade baseada na derivada da curva
        const velocidadeNormalizada = 1 - curva;
        this.velocidade = this.parametrosCurva.velocidadeInicial * velocidadeNormalizada * 0.7;
        
        // Atualizar posição diretamente para garantir precisão
        this.posicao = posicaoAtual;
        
        if (progresso >= 1) {
            this.fase = 'parado';
            this.velocidade = 0;
            this.posicao = this.posicaoAlvo;
        }
    }
    
    parar() {
        if (this.fase === 'desacelerando' || this.fase === 'parado') {
            return false; // Já está parando ou parado
        }
        return true; // Pode parar
    }
}

// ===== SISTEMA DE ÁUDIO PROFISSIONAL =====

class AudioSystem {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.sounds = {};
        this.volume = 0.3;
        this.muted = false;
        this.init();
    }
    
    async init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.volume;
            
            await this.carregarSounds();
            console.log('🔊 Sistema de áudio inicializado');
        } catch (e) {
            console.log('❌ Áudio não suportado:', e);
        }
    }
    
    async carregarSounds() {
        // Criar sons sintéticos mais profissionais
        this.sounds = {
            giroInicio: this.criarSomComplexo([220, 330, 440], 0.3, 'sawtooth'),
            tick: this.criarSomComplexo([800, 1200], 0.05, 'square'),
            parada: this.criarSomComplexo([150, 100, 75], 0.8, 'sine'),
            vitoria: this.criarMelodia([440, 554, 659, 880], 0.15),
            derrota: this.criarSomComplexo([110, 82], 0.5, 'triangle')
        };
    }
    
    criarSomComplexo(frequencias, duracao, tipo = 'sine') {
        return {
            play: () => {
                if (!this.context || this.muted) return;
                
                const agora = this.context.currentTime;
                
                frequencias.forEach((freq, index) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    const filter = this.context.createBiquadFilter();
                    
                    oscillator.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(this.masterGain);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = tipo;
                    
                    filter.type = 'lowpass';
                    filter.frequency.value = freq * 2;
                    
                    const volume = 0.1 / frequencias.length;
                    gainNode.gain.setValueAtTime(0, agora);
                    gainNode.gain.linearRampToValueAtTime(volume, agora + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, agora + duracao);
                    
                    oscillator.start(agora + index * 0.01);
                    oscillator.stop(agora + duracao);
                });
            }
        };
    }
    
    criarMelodia(notas, duracaoNota) {
        return {
            play: () => {
                if (!this.context || this.muted) return;
                
                const agora = this.context.currentTime;
                
                notas.forEach((freq, index) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.masterGain);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    const inicio = agora + index * duracaoNota;
                    const fim = inicio + duracaoNota;
                    
                    gainNode.gain.setValueAtTime(0, inicio);
                    gainNode.gain.linearRampToValueAtTime(0.05, inicio + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, fim);
                    
                    oscillator.start(inicio);
                    oscillator.stop(fim);
                });
            }
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.volume;
        }
    }
    
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.volume;
        }
        return this.muted;
    }
}

// ===== SISTEMA DE EFEITOS VISUAIS =====

class EfeitosVisuais {
    constructor() {
        this.particulas = [];
        this.ultimoTempo = 0;
    }
    
    aplicarEfeitosVelocidade(velocidade) {
        if (!elements.roleta) return;
        
        const velocidadeNormalizada = Math.min(1, velocidade / roletaConfig.fisica.velocidadeConstante);
        
        // Blur motion realista
        const blur = roletaConfig.efeitos.blur.minimo + 
            (roletaConfig.efeitos.blur.maximo - roletaConfig.efeitos.blur.minimo) * velocidadeNormalizada;
        
        // Brilho dinâmico
        const brilho = roletaConfig.efeitos.brilho.minimo + 
            (roletaConfig.efeitos.brilho.maximo - roletaConfig.efeitos.brilho.minimo) * velocidadeNormalizada;
        
        // Aplicar efeitos com transição suave
        elements.roleta.style.filter = `blur(${blur}px) brightness(${brilho})`;
        
        // Efeito de escala sutil
        const escala = 1 + (velocidadeNormalizada * 0.02);
        elements.roleta.style.transform += ` scale(${escala})`;
    }
    
    criarParticulasGiro() {
        if (!elements.particlesBg) return;
        
        const agora = Date.now();
        if (agora - this.ultimoTempo < 100) return; // Throttle
        this.ultimoTempo = agora;
        
        for (let i = 0; i < 3; i++) {
            const particula = document.createElement('div');
            const tamanho = Math.random() * 4 + 2;
            const cores = [
                'rgba(255, 215, 0, 0.6)',
                'rgba(255, 107, 107, 0.5)',
                'rgba(76, 205, 196, 0.5)',
                'rgba(138, 43, 226, 0.4)'
            ];
            
            particula.style.cssText = `
                position: absolute;
                width: ${tamanho}px;
                height: ${tamanho}px;
                background: ${cores[Math.floor(Math.random() * cores.length)]};
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleGiro 2s ease-out forwards;
            `;
            
            elements.particlesBg.appendChild(particula);
            
            // Remover após animação
            setTimeout(() => {
                if (particula.parentNode) {
                    particula.parentNode.removeChild(particula);
                }
            }, 2000);
        }
    }
    
    destacarSetorVencedor(setorIndex) {
        const setores = document.querySelectorAll('.setor');
        if (setores[setorIndex]) {
            setores[setorIndex].style.animation = 'setorVencedor 1s ease-in-out 3';
            setores[setorIndex].style.zIndex = '100';
            
            setTimeout(() => {
                setores[setorIndex].style.animation = '';
                setores[setorIndex].style.zIndex = '';
            }, 3000);
        }
    }
    
    criarConfetes() {
        const container = document.querySelector('.confetti-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const cores = ['#ffd700', '#ff6b6b', '#4ecdc4', '#8a2be2', '#00ff88', '#ff9f43'];
        
        for (let i = 0; i < 50; i++) {
            const confete = document.createElement('div');
            const tamanho = Math.random() * 8 + 4;
            const cor = cores[Math.floor(Math.random() * cores.length)];
            const forma = Math.random() > 0.5 ? '50%' : '0%';
            
            confete.style.cssText = `
                position: absolute;
                width: ${tamanho}px;
                height: ${tamanho}px;
                background: ${cor};
                border-radius: ${forma};
                left: ${Math.random() * 100}%;
                top: -10px;
                animation: confeteFall ${2 + Math.random() * 3}s ease-out forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            container.appendChild(confete);
        }
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 6000);
    }
    
    limparEfeitos() {
        if (elements.roleta) {
            elements.roleta.style.filter = '';
            elements.roleta.style.transform = elements.roleta.style.transform.replace(/scale\([^)]*\)/g, '');
        }
    }
}

// ===== INSTÂNCIAS DOS SISTEMAS =====
const fisica = new FisicaRoleta();
const audioSystem = new AudioSystem();
const efeitos = new EfeitosVisuais();

// ===== FUNÇÕES PRINCIPAIS APRIMORADAS =====

// Inicialização aprimorada
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 RoletaWin Profissional - Iniciando...');
    
    setTimeout(() => {
        carregarEstadoJogo();
        inicializarEventListeners();
        atualizarInterface();
        criarParticulas();
        inicializarEfeitosVisuais();
        adicionarAnimacoesCSS();
        
        // Garantir estado inicial correto
        if (elements.btnGirar && elements.btnParar) {
            elements.btnGirar.classList.remove('hidden');
            elements.btnParar.classList.add('hidden');
        }
        
        console.log('🚀 Sistema profissional inicializado!');
    }, 100);
});

// Carregar estado do jogo
function carregarEstadoJogo() {
    const estadoSalvo = localStorage.getItem('roletaUser');
    if (estadoSalvo) {
        const estadoParsed = JSON.parse(estadoSalvo);
        gameState = { ...gameState, ...estadoParsed };
        gameState.estadoRoleta = ESTADOS_ROLETA.IDLE; // Sempre iniciar parado
        console.log('📂 Estado carregado:', gameState);
    }
}

// Salvar estado do jogo
function salvarEstadoJogo() {
    const estadoParaSalvar = { ...gameState };
    // Remover propriedades temporárias
    delete estadoParaSalvar.estadoRoleta;
    delete estadoParaSalvar.anguloAtual;
    delete estadoParaSalvar.velocidadeAtual;
    delete estadoParaSalvar.aceleracaoAtual;
    delete estadoParaSalvar.animacaoId;
    delete estadoParaSalvar.tempoInicioGiro;
    delete estadoParaSalvar.duracaoGiroTotal;
    delete estadoParaSalvar.bloqueado;
    delete estadoParaSalvar.fisica;
    
    localStorage.setItem('roletaUser', JSON.stringify(estadoParaSalvar));
}

// Inicializar event listeners
function inicializarEventListeners() {
    if (!elements.btnGirar || !elements.btnParar) {
        console.error('❌ Elementos de botão não encontrados');
        return;
    }
    
    elements.btnGirar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnGirar);
        handleGirarClick();
    });
    
    elements.btnParar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnParar);
        handlePararClick();
    });
    
    elements.btnParar.classList.add('hidden');
    
    // Outros event listeners...
    if (elements.cadastroForm) {
        elements.cadastroForm.addEventListener('submit', handleCadastro);
    }
    
    if (elements.btnContinuar) {
        elements.btnContinuar.addEventListener('click', fecharModalResultado);
    }
    
    // Eventos de teclado
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameState.bloqueado) {
            e.preventDefault();
            if (gameState.estadoRoleta === ESTADOS_ROLETA.IDLE) {
                handleGirarClick();
            } else if (gameState.estadoRoleta === ESTADOS_ROLETA.SPINNING) {
                handlePararClick();
            }
        }
    });
}

// Handle click no botão girar
function handleGirarClick() {
    if (gameState.bloqueado || gameState.estadoRoleta !== ESTADOS_ROLETA.IDLE) {
        return;
    }
    
    if (!gameState.usuario) {
        mostrarModalCadastro();
    } else if (gameState.girosGratis > 0) {
        iniciarGiroProfissional();
    } else {
        mostrarToast('Você não tem mais giros grátis disponíveis!', 'warning');
    }
}

// Handle click no botão parar
function handlePararClick() {
    if (gameState.bloqueado || gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING) {
        return;
    }
    
    pararGiroProfissional();
}

// ===== FUNÇÃO PRINCIPAL: INICIAR GIRO PROFISSIONAL =====
function iniciarGiroProfissional() {
    if (gameState.girosGratis <= 0 || gameState.bloqueado) {
        return;
    }
    
    console.log('🎯 Iniciando giro profissional');
    
    // Bloquear ações e definir estado
    gameState.bloqueado = true;
    gameState.estadoRoleta = ESTADOS_ROLETA.SPINNING;
    gameState.tempoInicioGiro = Date.now();
    
    // Resetar física
    fisica.reset();
    fisica.posicao = gameState.anguloAtual;
    fisica.iniciarAceleracao();
    
    // Atualizar interface
    trocarBotoes(true);
    adicionarClassesGiro();
    
    // Efeitos
    audioSystem.play('giroInicio');
    
    // Iniciar loop de animação
    iniciarLoopAnimacao();
    
    mostrarToast('Clique em PARAR quando quiser parar a roleta!', 'info');
}

// ===== LOOP DE ANIMAÇÃO PROFISSIONAL =====
function iniciarLoopAnimacao() {
    let ultimoTempo = Date.now();
    
    function loop() {
        if (gameState.estadoRoleta === ESTADOS_ROLETA.STOPPED) {
            return; // Parar loop
        }
        
        const agora = Date.now();
        const deltaTime = agora - ultimoTempo;
        ultimoTempo = agora;
        
        // Atualizar física
        const estadoFisica = fisica.atualizar(deltaTime);
        
        // Atualizar estado do jogo
        gameState.anguloAtual = estadoFisica.posicao;
        gameState.velocidadeAtual = estadoFisica.velocidade;
        
        // Aplicar rotação
        if (elements.roleta) {
            elements.roleta.style.transform = `rotate(${gameState.anguloAtual}deg)`;
        }
        
        // Efeitos visuais baseados na velocidade
        efeitos.aplicarEfeitosVelocidade(gameState.velocidadeAtual);
        
        // Atualizar indicador de velocidade
        atualizarIndicadorVelocidade();
        
        // Criar partículas durante o giro
        if (gameState.velocidadeAtual > 5) {
            efeitos.criarParticulasGiro();
        }
        
        // Sons de tick baseados na velocidade
        const shouldTick = Math.random() < (gameState.velocidadeAtual / 100);
        if (shouldTick && gameState.velocidadeAtual > 8) {
            audioSystem.play('tick');
        }
        
        // Verificar se terminou
        if (estadoFisica.completo) {
            finalizarGiroProfissional();
            return;
        }
        
        // Continuar loop
        gameState.animacaoId = requestAnimationFrame(loop);
    }
    
    loop();
}

// ===== PARAR GIRO PROFISSIONAL =====
function pararGiroProfissional() {
    if (gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING) {
        return;
    }
    
    console.log('🛑 Parando giro profissional');
    
    gameState.estadoRoleta = ESTADOS_ROLETA.STOPPING;
    
    // Determinar prêmio e posição final
    const { anguloFinal, premioGanho } = calcularResultadoFinal();
    
    // Iniciar desaceleração para a posição final
    fisica.iniciarDesaceleracao(anguloFinal);
    
    // Armazenar resultado para finalização
    gameState.premioAtual = premioGanho;
    gameState.anguloFinal = anguloFinal;
    
    // Atualizar interface
    trocarBotoes(false);
    removerClassesGiro();
}

// Calcular resultado final com lógica de negócio
function calcularResultadoFinal() {
    let setorEscolhido;
    
    // Lógica de negócio: garantir R$ 75 na segunda rodada
    if (gameState.girosUsados === 1) {
        setorEscolhido = roletaConfig.setores.findIndex(setor => setor.premio === 75);
        if (setorEscolhido === -1) setorEscolhido = 5; // Fallback para setor R$ 75
    } else {
        // Probabilidade realista para outras rodadas
        const setoresVazios = [0, 2, 4, 6, 7];
        const setoresPremio = [1, 3, 5];
        
        if (Math.random() < 0.7) {
            setorEscolhido = setoresVazios[Math.floor(Math.random() * setoresVazios.length)];
        } else {
            setorEscolhido = setoresPremio[Math.floor(Math.random() * setoresPremio.length)];
        }
    }
    
    // Calcular ângulo final preciso
    const anguloSetor = setorEscolhido * roletaConfig.anguloSetor;
    const anguloAleatorioNoSetor = Math.random() * roletaConfig.anguloSetor;
    const voltasAdicionais = (roletaConfig.fisica.voltasMinimas + 
        Math.random() * (roletaConfig.fisica.voltasMaximas - roletaConfig.fisica.voltasMinimas)) * 360;
    
    const ajustePonteiro = roletaConfig.anguloSetor / 2;
    let anguloFinal = gameState.anguloAtual + voltasAdicionais + anguloSetor + anguloAleatorioNoSetor - ajustePonteiro;
    
    // Garantir que seja um giro completo
    while (anguloFinal < gameState.anguloAtual + 360) {
        anguloFinal += 360;
    }
    
    const premioGanho = roletaConfig.setores[setorEscolhido].premio;
    
    console.log(`🎯 Resultado: Setor ${setorEscolhido}, Prêmio R$ ${premioGanho}, Ângulo ${anguloFinal.toFixed(2)}°`);
    
    return { anguloFinal, premioGanho };
}

// ===== FINALIZAR GIRO PROFISSIONAL =====
function finalizarGiroProfissional() {
    console.log('🏁 Finalizando giro profissional');
    
    // Atualizar estado
    gameState.estadoRoleta = ESTADOS_ROLETA.STOPPED;
    gameState.bloqueado = false;
    
    // Limpar animações
    if (gameState.animacaoId) {
        cancelAnimationFrame(gameState.animacaoId);
        gameState.animacaoId = null;
    }
    
    // Limpar efeitos visuais
    efeitos.limparEfeitos();
    
    // Garantir posição final exata
    gameState.anguloAtual = gameState.anguloFinal;
    if (elements.roleta) {
        elements.roleta.style.transform = `rotate(${gameState.anguloFinal}deg)`;
    }
    
    // Resetar indicador de velocidade
    if (elements.velocidadeIndicator) {
        elements.velocidadeIndicator.style.width = '0%';
    }
    
    // Som de parada
    audioSystem.play('parada');
    
    // Atualizar estado do jogo
    const premioGanho = gameState.premioAtual;
    gameState.girosGratis--;
    gameState.girosUsados++;
    gameState.saldo += premioGanho;
    gameState.velocidadeAtual = 0;
    
    // Salvar estado
    salvarEstadoJogo();
    atualizarInterface();
    
    // Resetar estado da roleta
    gameState.estadoRoleta = ESTADOS_ROLETA.IDLE;
    
    // Mostrar resultado com delay dramático
    setTimeout(() => {
        if (premioGanho > 0) {
            efeitos.criarConfetes();
            audioSystem.play('vitoria');
            
            // Destacar setor vencedor
            const setorIndex = Math.floor(((360 - (gameState.anguloFinal % 360) + 22.5) % 360) / 45);
            efeitos.destacarSetorVencedor(setorIndex);
        } else {
            audioSystem.play('derrota');
        }
        
        mostrarModalResultado(premioGanho);
    }, 1000);
}

// ===== FUNÇÕES DE INTERFACE =====

// Trocar botões com animação suave
function trocarBotoes(girando) {
    if (!elements.btnGirar || !elements.btnParar) return;
    
    if (girando) {
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

// Adicionar classes de giro
function adicionarClassesGiro() {
    if (elements.roletaContainer) elements.roletaContainer.classList.add('girando');
    if (elements.roletaWrapper) elements.roletaWrapper.classList.add('girando');
    if (elements.girosPremiosInfo) elements.girosPremiosInfo.classList.add('hidden');
    if (elements.roleta) elements.roleta.classList.add('girando');
}

// Remover classes de giro
function removerClassesGiro() {
    if (elements.roletaContainer) elements.roletaContainer.classList.remove('girando');
    if (elements.roletaWrapper) elements.roletaWrapper.classList.remove('girando');
    if (elements.girosPremiosInfo) elements.girosPremiosInfo.classList.remove('hidden');
    if (elements.roleta) {
        elements.roleta.classList.remove('girando');
        elements.roleta.classList.add('parando');
        
        setTimeout(() => {
            elements.roleta.classList.remove('parando');
        }, 1000);
    }
}

// Atualizar indicador de velocidade
function atualizarIndicadorVelocidade() {
    if (elements.velocidadeIndicator) {
        const porcentagem = (gameState.velocidadeAtual / roletaConfig.fisica.velocidadeConstante) * 100;
        elements.velocidadeIndicator.style.width = `${Math.min(100, porcentagem)}%`;
    }
}

// ===== FUNÇÕES AUXILIARES =====

// Criar efeito ripple
function criarEfeitoRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    ripple.classList.add('btn-ripple');
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Adicionar animações CSS necessárias
function adicionarAnimacoesCSS() {
    if (document.querySelector('#animacoes-profissionais')) return;
    
    const style = document.createElement('style');
    style.id = 'animacoes-profissionais';
    style.textContent = `
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        
        @keyframes particleGiro {
            0% { transform: translateY(0) scale(0); opacity: 1; }
            50% { transform: translateY(-50px) scale(1); opacity: 0.8; }
            100% { transform: translateY(-100px) scale(0); opacity: 0; }
        }
        
        @keyframes confeteFall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes setorVencedor {
            0%, 100% { transform: scale(1) rotate(var(--rotation)); }
            50% { 
                transform: scale(1.1) rotate(var(--rotation)); 
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
                filter: brightness(1.3);
            }
        }
        
        .roleta.girando {
            transition: none !important;
        }
        
        .roleta.parando {
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
    `;
    
    document.head.appendChild(style);
}

// ===== FUNÇÕES EXISTENTES MANTIDAS =====

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
    
    gameState.usuario = { nome, email };
    gameState.girosGratis = 3;
    gameState.girosUsados = 0;
    
    salvarEstadoJogo();
    fecharModalCadastro();
    atualizarInterface();
    
    mostrarToast(`Bem-vindo, ${nome}! Você recebeu 3 giros grátis!`, 'success');
}

// Mostrar/fechar modais
function mostrarModalCadastro() {
    elements.cadastroOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModalCadastro() {
    elements.cadastroOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function mostrarModalResultado(premioGanho) {
    if (premioGanho > 0) {
        elements.resultadoTitulo.textContent = '🎉 Parabéns!';
        elements.resultadoDescricao.textContent = 'Você ganhou um prêmio incrível!';
        elements.resultadoIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        elements.resultadoIcon.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
    } else {
        elements.resultadoTitulo.textContent = '😔 Que pena!';
        elements.resultadoDescricao.textContent = 'Não foi desta vez, mas continue tentando!';
        elements.resultadoIcon.innerHTML = '<i class="fas fa-heart-broken"></i>';
        elements.resultadoIcon.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)';
    }
    
    elements.premioValor.textContent = `R$ ${premioGanho.toFixed(2).replace('.', ',')}`;
    elements.novoSaldo.textContent = gameState.saldo.toFixed(2).replace('.', ',');
    elements.girosRestantesCount.textContent = gameState.girosGratis;
    
    elements.girosRestantesModal.style.display = gameState.girosGratis > 0 ? 'flex' : 'none';
    elements.resultadoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModalResultado() {
    elements.resultadoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Atualizar interface
function atualizarInterface() {
    if (elements.saldoAtual) {
        elements.saldoAtual.textContent = gameState.saldo.toFixed(2).replace('.', ',');
    }
    
    if (gameState.usuario && gameState.girosGratis > 0) {
        if (elements.girosCount) elements.girosCount.textContent = gameState.girosGratis;
        if (elements.girosInfo) elements.girosInfo.style.display = 'block';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'block';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'block';
        if (elements.btnGirar) elements.btnGirar.style.display = 'block';
        
        if (elements.girosTitle) elements.girosTitle.textContent = '3 Giros Grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Cadastre-se e ganhe até R$ 75,00!';
        
    } else if (gameState.usuario && gameState.girosGratis === 0) {
        if (elements.girosInfo) elements.girosInfo.style.display = 'none';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'none';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'none';
        if (elements.btnGirar) elements.btnGirar.style.display = 'none';
        if (elements.btnParar) elements.btnParar.style.display = 'none';
        
        if (elements.girosTitle) elements.girosTitle.textContent = 'Sem mais giros grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Experimente nossas mesas com apostas abaixo!';
        
    } else {
        if (elements.girosInfo) elements.girosInfo.style.display = 'none';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'block';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'block';
        if (elements.btnGirar) elements.btnGirar.style.display = 'block';
        if (elements.btnParar) elements.btnParar.style.display = 'none';
        
        if (elements.girosTitle) elements.girosTitle.textContent = '3 Giros Grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Cadastre-se e ganhe até R$ 75,00!';
    }
}

// Toast notifications
function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    
    const estilos = {
        success: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
        error: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
        warning: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
        info: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)'
    };
    
    toast.style.background = estilos[tipo] || estilos.info;
    toast.style.color = tipo === 'success' || tipo === 'warning' ? '#0a0e27' : '#ffffff';
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Criar partículas de fundo
function criarParticulas() {
    if (!elements.particlesBg) return;
    
    for (let i = 0; i < 30; i++) {
        const particula = document.createElement('div');
        const tamanho = Math.random() * 6 + 2;
        const cores = [
            'rgba(255, 215, 0, 0.3)',
            'rgba(138, 43, 226, 0.2)',
            'rgba(255, 105, 180, 0.2)',
            'rgba(76, 205, 196, 0.2)'
        ];
        
        particula.style.cssText = `
            position: absolute;
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            filter: blur(1px);
            animation: particleFloat ${20 + Math.random() * 30}s linear infinite;
            animation-delay: ${Math.random() * 15}s;
        `;
        
        elements.particlesBg.appendChild(particula);
    }
    
    // Adicionar animação de partículas se não existir
    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes particleFloat {
                0% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(0); opacity: 0; }
                5% { opacity: 1; transform: translateY(-20px) translateX(10px) rotate(45deg) scale(1); }
                95% { opacity: 0.8; }
                100% { transform: translateY(-100vh) translateX(150px) rotate(360deg) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar efeitos visuais
function inicializarEfeitosVisuais() {
    const setores = document.querySelectorAll('.setor');
    setores.forEach((setor) => {
        setor.addEventListener('mouseenter', () => {
            if (gameState.estadoRoleta === ESTADOS_ROLETA.IDLE) {
                setor.style.transform += ' scale(1.05)';
                setor.style.zIndex = '10';
                setor.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
            }
        });
        
        setor.addEventListener('mouseleave', () => {
            if (gameState.estadoRoleta === ESTADOS_ROLETA.IDLE) {
                setor.style.transform = setor.style.transform.replace(' scale(1.05)', '');
                setor.style.zIndex = 'auto';
                setor.style.boxShadow = 'none';
            }
        });
    });
}

// Função para resetar o jogo
function resetarJogo() {
    gameState = {
        usuario: null,
        saldo: 0,
        girosGratis: 0,
        girosUsados: 0,
        primeiroDeposito: false,
        estadoRoleta: ESTADOS_ROLETA.IDLE,
        anguloAtual: 0,
        velocidadeAtual: 0,
        aceleracaoAtual: 0,
        animacaoId: null,
        tempoInicioGiro: 0,
        duracaoGiroTotal: 0,
        bloqueado: false,
        fisica: {
            velocidadeMaxima: 20,
            aceleracaoInicial: 0.8,
            desaceleracaoFinal: 0.92,
            inercia: 0.98,
            atrito: 0.995
        }
    };
    
    fisica.reset();
    localStorage.removeItem('roletaUser');
    atualizarInterface();
    location.reload();
}

// Expor para console
window.resetarJogo = resetarJogo;
window.gameState = gameState;
window.roletaConfig = roletaConfig;
window.fisica = fisica;
window.audioSystem = audioSystem;
window.efeitos = efeitos;

console.log('🎰 RoletaWin Profissional carregada com sucesso!');

