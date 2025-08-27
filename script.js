// ===== ROLETA ULTRA-REALISTA - VERSÃO CINEMATOGRÁFICA =====
// Sistema de física quântica e efeitos visuais de última geração

// Estados da máquina de estados da roleta
const ESTADOS_ROLETA = {
    IDLE: 'idle',
    SPINNING: 'spinning',
    STOPPING: 'stopping',
    STOPPED: 'stopped',
    OSCILLATING: 'oscillating' // Novo estado para micro-oscilações
};

// Estado do jogo com gerenciamento ultra-robusto
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
    
    // Física ultra-avançada
    fisica: {
        momentum: 0,
        inercia: 0.995,
        atritoRolamento: 0.998,
        atritoAr: 0.9995,
        atritoMagnetico: 0.997,
        variacao: 0.0001,
        oscilacaoAmplitude: 0,
        oscilacaoFrequencia: 0,
        oscilacaoTempo: 0
    },
    
    // Performance adaptativa
    performance: {
        fps: 60,
        qualidade: 'alta',
        adaptativo: true,
        ultimoFrame: 0,
        contadorFrames: 0
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

// Configurações da roleta com física ultra-realista
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
    
    // Física ultra-avançada com simulação real
    fisica: {
        // Fase de aceleração com variações naturais
        tempoAceleracao: 1800,
        aceleracaoInicial: 0.3,
        aceleracaoMaxima: 1.8,
        variacao: 0.15,
        
        // Fase de velocidade constante com imperfeições
        tempoVelocidadeConstante: 2200,
        velocidadeConstante: 22,
        imperfeicoes: {
            amplitude: 0.8,
            frequencia: 0.02,
            ruido: 0.1
        },
        
        // Fase de desaceleração ultra-realista
        tempoDesaceleracao: 4500,
        atrito: {
            rolamento: 0.998,
            ar: 0.9995,
            magnetico: 0.997,
            variacao: 0.0001
        },
        
        // Micro-oscilações na parada
        oscilacoes: {
            amplitude: 1.2,
            frequencia: 12,
            amortecimento: 0.92,
            duracao: 1800
        },
        
        // Configurações de precisão
        voltasMinimas: 5,
        voltasMaximas: 8,
        precisaoFinal: 0.05
    },
    
    // Efeitos visuais cinematográficos
    efeitos: {
        motionBlur: {
            minimo: 0,
            maximo: 4,
            samples: 12,
            threshold: 8
        },
        brilho: {
            minimo: 1,
            maximo: 1.4,
            pulsacao: 0.1
        },
        reflexos: {
            intensidade: 0.6,
            cor: 'rgba(255, 255, 255, 0.3)',
            angulo: 45
        },
        sombras: {
            blur: 15,
            offset: { x: 2, y: 4 },
            cor: 'rgba(0, 0, 0, 0.4)'
        },
        particulas: {
            quantidade: 50,
            fisica: true,
            gravidade: 0.2,
            vento: { x: 0.05, y: 0 },
            colisao: true
        },
        profundidade: {
            parallax: 0.1,
            escala: 0.02,
            perspectiva: 1000
        }
    },
    
    // Áudio espacial 3D
    audio: {
        espacial: true,
        reverberacao: {
            roomSize: 0.7,
            decay: 2.3,
            wetGain: 0.3
        },
        posicoes: {
            listener: { x: 0, y: 0, z: 1 },
            roleta: { x: 0, y: 0, z: 0 }
        },
        doppler: {
            factor: 0.1,
            speedOfSound: 343
        }
    }
};

// ===== SISTEMA DE FÍSICA QUÂNTICA =====

class FisicaQuantica {
    constructor() {
        this.reset();
        this.ruido = new SimplexNoise();
    }
    
    reset() {
        this.posicao = 0;
        this.velocidade = 0;
        this.aceleracao = 0;
        this.momentum = 0;
        this.tempo = 0;
        this.fase = 'idle';
        this.posicaoAlvo = null;
        this.parametrosCurva = null;
        this.oscilacao = {
            amplitude: 0,
            frequencia: 0,
            tempo: 0,
            offset: 0
        };
        this.imperfeicoes = {
            rolamento: 0,
            magnetismo: 0,
            ar: 0
        };
    }
    
    // Curvas de easing ultra-suaves
    static easing = {
        easeOutCubic: t => 1 - Math.pow(1 - t, 3),
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        easeOutQuart: t => 1 - Math.pow(1 - t, 4),
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
        easeOutCirc: t => Math.sqrt(1 - Math.pow(t - 1, 2)),
        easeInOutCirc: t => t < 0.5 
            ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
        easeOutElastic: t => {
            const c4 = (2 * Math.PI) / 3;
            return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        },
        easeInOutBack: t => {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
            return t < 0.5
                ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
                : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
        }
    };
    
    iniciarAceleracao() {
        this.fase = 'acelerando';
        this.tempo = 0;
        this.velocidade = 1; // Início muito suave
        this.aceleracao = roletaConfig.fisica.aceleracaoInicial;
        this.momentum = 0;
        
        // Inicializar imperfeições aleatórias
        this.imperfeicoes.rolamento = (Math.random() - 0.5) * 0.0002;
        this.imperfeicoes.magnetismo = (Math.random() - 0.5) * 0.0001;
        this.imperfeicoes.ar = (Math.random() - 0.5) * 0.00005;
    }
    
    iniciarVelocidadeConstante() {
        this.fase = 'constante';
        this.tempo = 0;
        this.velocidade = roletaConfig.fisica.velocidadeConstante;
        this.aceleracao = 0;
        this.momentum = this.velocidade;
    }
    
    iniciarDesaceleracao(posicaoAlvo) {
        this.fase = 'desacelerando';
        this.tempo = 0;
        this.posicaoAlvo = posicaoAlvo;
        
        // Calcular parâmetros da curva de desaceleração ultra-realista
        const distanciaRestante = posicaoAlvo - this.posicao;
        const tempoDesaceleracao = roletaConfig.fisica.tempoDesaceleracao;
        
        this.parametrosCurva = {
            posicaoInicial: this.posicao,
            velocidadeInicial: this.velocidade,
            distanciaTotal: distanciaRestante,
            tempoTotal: tempoDesaceleracao,
            momentumInicial: this.momentum
        };
    }
    
    iniciarOscilacao() {
        this.fase = 'oscilando';
        this.tempo = 0;
        this.oscilacao.amplitude = roletaConfig.fisica.oscilacoes.amplitude;
        this.oscilacao.frequencia = roletaConfig.fisica.oscilacoes.frequencia;
        this.oscilacao.offset = this.posicao;
        this.velocidade = 0;
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
            case 'oscilando':
                this.atualizarOscilacao(deltaTime);
                break;
        }
        
        // Aplicar imperfeições físicas
        this.aplicarImperfeicoes(deltaTime);
        
        // Atualizar posição com momentum
        this.posicao += this.velocidade * (deltaTime / 16.67);
        
        return {
            posicao: this.posicao,
            velocidade: this.velocidade,
            momentum: this.momentum,
            fase: this.fase,
            oscilacao: this.oscilacao,
            completo: this.fase === 'parado'
        };
    }
    
    atualizarAceleracao(deltaTime) {
        const progresso = Math.min(1, this.tempo / roletaConfig.fisica.tempoAceleracao);
        
        // Curva de aceleração com variações naturais
        const curvaBase = FisicaQuantica.easing.easeOutCubic(progresso);
        const variacao = Math.sin(this.tempo * 0.01) * roletaConfig.fisica.variacao;
        const curva = curvaBase + variacao;
        
        // Calcular velocidade com momentum
        const velocidadeAlvo = 1 + (roletaConfig.fisica.velocidadeConstante - 1) * curva;
        this.velocidade = this.velocidade * 0.95 + velocidadeAlvo * 0.05; // Suavização
        
        // Atualizar momentum
        this.momentum = this.velocidade * 0.8 + this.momentum * 0.2;
        
        if (progresso >= 1) {
            this.iniciarVelocidadeConstante();
        }
    }
    
    atualizarVelocidadeConstante(deltaTime) {
        // Imperfeições mecânicas realistas
        const ruido = this.ruido.noise2D(this.tempo * 0.001, 0) * roletaConfig.fisica.imperfeicoes.ruido;
        const oscilacao = Math.sin(this.tempo * roletaConfig.fisica.imperfeicoes.frequencia) * 
                         roletaConfig.fisica.imperfeicoes.amplitude;
        
        // Aplicar variações naturais
        this.velocidade = roletaConfig.fisica.velocidadeConstante + oscilacao + ruido;
        this.momentum = this.velocidade;
        
        // Verificar se deve continuar ou aguardar comando de parada
        if (this.tempo >= roletaConfig.fisica.tempoVelocidadeConstante) {
            if (gameState.estadoRoleta === ESTADOS_ROLETA.STOPPING) {
                return; // Comando de parada já foi dado
            }
        }
    }
    
    atualizarDesaceleracao(deltaTime) {
        const progresso = Math.min(1, this.tempo / this.parametrosCurva.tempoTotal);
        
        // Curva de desaceleração ultra-realista com múltiplas camadas
        const curvaBase = FisicaQuantica.easing.easeInOutCirc(progresso);
        const curvaFinal = FisicaQuantica.easing.easeOutElastic(Math.max(0, progresso - 0.8) * 5);
        const curva = progresso < 0.8 ? curvaBase : curvaBase * 0.8 + curvaFinal * 0.2;
        
        // Interpolação ultra-suave para a posição final
        const posicaoAtual = this.parametrosCurva.posicaoInicial + 
            (this.parametrosCurva.distanciaTotal * curva);
        
        // Calcular velocidade com momentum realista
        const velocidadeNormalizada = Math.max(0, 1 - curva);
        this.velocidade = this.parametrosCurva.velocidadeInicial * velocidadeNormalizada * 0.6;
        
        // Aplicar atrito progressivo
        const atritoTotal = roletaConfig.fisica.atrito.rolamento * 
                           roletaConfig.fisica.atrito.ar * 
                           roletaConfig.fisica.atrito.magnetico;
        this.velocidade *= atritoTotal;
        
        // Atualizar posição diretamente para garantir precisão absoluta
        this.posicao = posicaoAtual;
        
        if (progresso >= 1) {
            this.posicao = this.posicaoAlvo;
            this.iniciarOscilacao();
        }
    }
    
    atualizarOscilacao(deltaTime) {
        const progresso = Math.min(1, this.tempo / roletaConfig.fisica.oscilacoes.duracao);
        const amortecimento = Math.pow(roletaConfig.fisica.oscilacoes.amortecimento, progresso * 10);
        
        // Oscilação amortecida realista
        const oscilacao = Math.sin(this.tempo * roletaConfig.fisica.oscilacoes.frequencia * 0.01) * 
                         this.oscilacao.amplitude * amortecimento;
        
        this.posicao = this.oscilacao.offset + oscilacao;
        this.velocidade = oscilacao * 0.1; // Velocidade residual da oscilação
        
        if (progresso >= 1 || Math.abs(oscilacao) < 0.01) {
            this.fase = 'parado';
            this.velocidade = 0;
            this.posicao = this.oscilacao.offset;
        }
    }
    
    aplicarImperfeicoes(deltaTime) {
        // Aplicar imperfeições físicas sutis
        this.velocidade += this.imperfeicoes.rolamento * (deltaTime / 16.67);
        this.velocidade += this.imperfeicoes.magnetismo * Math.sin(this.tempo * 0.1);
        this.velocidade += this.imperfeicoes.ar * (this.velocidade * this.velocidade * 0.00001);
        
        // Garantir que a velocidade não seja negativa
        this.velocidade = Math.max(0, this.velocidade);
    }
    
    parar() {
        if (this.fase === 'desacelerando' || this.fase === 'oscilando' || this.fase === 'parado') {
            return false; // Já está parando ou parado
        }
        return true; // Pode parar
    }
}

// ===== SISTEMA DE ÁUDIO ESPACIAL 3D =====

class AudioEspacial3D {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.convolver = null;
        this.listener = null;
        this.sounds = {};
        this.volume = 0.4;
        this.muted = false;
        this.init();
    }
    
    async init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.listener = this.context.listener;
            
            // Configurar listener 3D
            if (this.listener.positionX) {
                this.listener.positionX.value = roletaConfig.audio.posicoes.listener.x;
                this.listener.positionY.value = roletaConfig.audio.posicoes.listener.y;
                this.listener.positionZ.value = roletaConfig.audio.posicoes.listener.z;
            }
            
            // Criar reverberação
            await this.criarReverberacao();
            
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = this.volume;
            
            await this.carregarSounds();
            console.log('🔊 Sistema de áudio espacial 3D inicializado');
        } catch (e) {
            console.log('❌ Áudio espacial não suportado:', e);
        }
    }
    
    async criarReverberacao() {
        this.convolver = this.context.createConvolver();
        
        // Criar impulse response sintético para reverberação
        const length = this.context.sampleRate * roletaConfig.audio.reverberacao.decay;
        const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const n = length - i;
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2);
            }
        }
        
        this.convolver.buffer = impulse;
    }
    
    async carregarSounds() {
        // Criar sons espaciais ultra-realistas
        this.sounds = {
            giroInicio: this.criarSomEspacial([180, 220, 280, 350], 0.4, 'sawtooth'),
            tick: this.criarSomEspacial([900, 1100, 1300], 0.03, 'square'),
            tickVariacao: this.criarSomEspacial([850, 950, 1050], 0.025, 'square'),
            parada: this.criarSomEspacial([120, 90, 60, 40], 1.2, 'sine'),
            oscilacao: this.criarSomEspacial([200, 150], 0.1, 'triangle'),
            vitoria: this.criarMelodiaEspacial([440, 554, 659, 880, 1108], 0.2),
            derrota: this.criarSomEspacial([110, 82, 65], 0.8, 'triangle'),
            atrito: this.criarRuidoAtrito(),
            vento: this.criarRuidoVento()
        };
    }
    
    criarSomEspacial(frequencias, duracao, tipo = 'sine') {
        return {
            play: (velocidade = 1, posicao = { x: 0, y: 0, z: 0 }) => {
                if (!this.context || this.muted) return;
                
                const agora = this.context.currentTime;
                const panner = this.context.createPanner();
                
                // Configurar áudio espacial
                panner.panningModel = 'HRTF';
                panner.distanceModel = 'inverse';
                panner.refDistance = 1;
                panner.maxDistance = 10000;
                panner.rolloffFactor = 1;
                panner.coneInnerAngle = 360;
                panner.coneOuterAngle = 0;
                panner.coneOuterGain = 0;
                
                // Posicionar som
                if (panner.positionX) {
                    panner.positionX.value = posicao.x;
                    panner.positionY.value = posicao.y;
                    panner.positionZ.value = posicao.z;
                }
                
                frequencias.forEach((freq, index) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    const filter = this.context.createBiquadFilter();
                    
                    oscillator.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(panner);
                    panner.connect(this.masterGain);
                    
                    // Aplicar efeito Doppler
                    const dopplerShift = 1 + (velocidade * roletaConfig.audio.doppler.factor);
                    oscillator.frequency.value = freq * dopplerShift;
                    oscillator.type = tipo;
                    
                    filter.type = 'lowpass';
                    filter.frequency.value = freq * 2.5;
                    filter.Q.value = 0.7;
                    
                    const volume = 0.15 / frequencias.length;
                    gainNode.gain.setValueAtTime(0, agora);
                    gainNode.gain.linearRampToValueAtTime(volume, agora + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, agora + duracao);
                    
                    oscillator.start(agora + index * 0.005);
                    oscillator.stop(agora + duracao);
                });
            }
        };
    }
    
    criarMelodiaEspacial(notas, duracaoNota) {
        return {
            play: () => {
                if (!this.context || this.muted) return;
                
                const agora = this.context.currentTime;
                const panner = this.context.createPanner();
                
                // Configurar espacialização
                panner.panningModel = 'HRTF';
                if (panner.positionX) {
                    panner.positionX.value = 0;
                    panner.positionY.value = 0;
                    panner.positionZ.value = 0;
                }
                
                notas.forEach((freq, index) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    const filter = this.context.createBiquadFilter();
                    
                    oscillator.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(panner);
                    panner.connect(this.convolver);
                    this.convolver.connect(this.masterGain);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    filter.type = 'lowpass';
                    filter.frequency.value = freq * 3;
                    
                    const inicio = agora + index * duracaoNota;
                    const fim = inicio + duracaoNota * 1.5;
                    
                    gainNode.gain.setValueAtTime(0, inicio);
                    gainNode.gain.linearRampToValueAtTime(0.08, inicio + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, fim);
                    
                    oscillator.start(inicio);
                    oscillator.stop(fim);
                });
            }
        };
    }
    
    criarRuidoAtrito() {
        return {
            play: (intensidade = 1) => {
                if (!this.context || this.muted) return;
                
                const bufferSize = this.context.sampleRate * 0.1;
                const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
                const data = buffer.getChannelData(0);
                
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * intensidade * 0.1;
                }
                
                const source = this.context.createBufferSource();
                const gainNode = this.context.createGain();
                const filter = this.context.createBiquadFilter();
                
                source.buffer = buffer;
                source.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                filter.type = 'bandpass';
                filter.frequency.value = 200 + intensidade * 100;
                filter.Q.value = 2;
                
                gainNode.gain.value = intensidade * 0.05;
                
                source.start();
            }
        };
    }
    
    criarRuidoVento() {
        return {
            play: (velocidade = 1) => {
                if (!this.context || this.muted || velocidade < 10) return;
                
                const bufferSize = this.context.sampleRate * 0.2;
                const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
                const data = buffer.getChannelData(0);
                
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * (velocidade / 30) * 0.02;
                }
                
                const source = this.context.createBufferSource();
                const gainNode = this.context.createGain();
                const filter = this.context.createBiquadFilter();
                
                source.buffer = buffer;
                source.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                filter.type = 'highpass';
                filter.frequency.value = 1000;
                
                gainNode.gain.value = Math.min(0.03, velocidade / 1000);
                
                source.start();
            }
        };
    }
    
    play(soundName, velocidade = 1, posicao = null) {
        if (this.sounds[soundName]) {
            const pos = posicao || roletaConfig.audio.posicoes.roleta;
            this.sounds[soundName].play(velocidade, pos);
        }
    }
    
    playTick(velocidade) {
        // Alternar entre diferentes tipos de tick para variação
        const tickType = Math.random() > 0.7 ? 'tickVariacao' : 'tick';
        this.play(tickType, velocidade);
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

// ===== SISTEMA DE EFEITOS VISUAIS CINEMATOGRÁFICOS =====

class EfeitosCinematograficos {
    constructor() {
        this.particulas = [];
        this.ultimoTempo = 0;
        this.canvas = null;
        this.ctx = null;
        this.inicializarCanvas();
    }
    
    inicializarCanvas() {
        // Criar canvas para efeitos avançados
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'efeitos-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        
        if (elements.roletaContainer) {
            elements.roletaContainer.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.redimensionarCanvas();
        }
        
        // Redimensionar canvas quando necessário
        window.addEventListener('resize', () => this.redimensionarCanvas());
    }
    
    redimensionarCanvas() {
        if (!this.canvas || !elements.roletaContainer) return;
        
        const rect = elements.roletaContainer.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    aplicarEfeitosVelocidade(velocidade, fase) {
        if (!elements.roleta) return;
        
        const velocidadeNormalizada = Math.min(1, velocidade / roletaConfig.fisica.velocidadeConstante);
        
        // Motion blur direcional ultra-realista
        const blur = roletaConfig.efeitos.motionBlur.minimo + 
            (roletaConfig.efeitos.motionBlur.maximo - roletaConfig.efeitos.motionBlur.minimo) * velocidadeNormalizada;
        
        // Brilho dinâmico com pulsação
        const brilhoBase = roletaConfig.efeitos.brilho.minimo + 
            (roletaConfig.efeitos.brilho.maximo - roletaConfig.efeitos.brilho.minimo) * velocidadeNormalizada;
        const pulsacao = Math.sin(Date.now() * 0.01) * roletaConfig.efeitos.brilho.pulsacao;
        const brilho = brilhoBase + pulsacao;
        
        // Aplicar efeitos com transição ultra-suave
        elements.roleta.style.filter = `blur(${blur}px) brightness(${brilho}) saturate(${1 + velocidadeNormalizada * 0.2})`;
        
        // Efeito de profundidade com parallax
        const escala = 1 + (velocidadeNormalizada * roletaConfig.efeitos.profundidade.escala);
        const perspectiva = roletaConfig.efeitos.profundidade.perspectiva;
        
        elements.roleta.style.transform += ` scale(${escala}) perspective(${perspectiva}px)`;
        
        // Sombras dinâmicas
        this.aplicarSombrasDinamicas(velocidadeNormalizada);
        
        // Reflexos em movimento
        this.aplicarReflexosDinamicos(velocidade, fase);
    }
    
    aplicarSombrasDinamicas(intensidade) {
        if (!elements.roleta) return;
        
        const offset = roletaConfig.efeitos.sombras.offset;
        const blur = roletaConfig.efeitos.sombras.blur * (1 + intensidade);
        const cor = roletaConfig.efeitos.sombras.cor;
        
        elements.roleta.style.boxShadow = `${offset.x}px ${offset.y}px ${blur}px ${cor}`;
    }
    
    aplicarReflexosDinamicos(velocidade, fase) {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Criar reflexos baseados na velocidade
        const intensidade = Math.min(1, velocidade / 15);
        if (intensidade < 0.1) return;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const raio = Math.min(centerX, centerY) * 0.8;
        
        // Gradiente radial para reflexo
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, raio);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${intensidade * 0.3})`);
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${intensidade * 0.1})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, raio, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Reflexo em movimento
        const angulo = (Date.now() * velocidade * 0.01) % (Math.PI * 2);
        const reflexoX = centerX + Math.cos(angulo) * raio * 0.6;
        const reflexoY = centerY + Math.sin(angulo) * raio * 0.6;
        
        const reflexoGradient = this.ctx.createRadialGradient(reflexoX, reflexoY, 0, reflexoX, reflexoY, 30);
        reflexoGradient.addColorStop(0, `rgba(255, 255, 255, ${intensidade * 0.6})`);
        reflexoGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = reflexoGradient;
        this.ctx.beginPath();
        this.ctx.arc(reflexoX, reflexoY, 30, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    criarParticulasAvancadas() {
        if (!elements.particlesBg) return;
        
        const agora = Date.now();
        if (agora - this.ultimoTempo < 50) return; // Throttle otimizado
        this.ultimoTempo = agora;
        
        const quantidade = gameState.performance.qualidade === 'alta' ? 5 : 2;
        
        for (let i = 0; i < quantidade; i++) {
            const particula = this.criarParticulaFisica();
            elements.particlesBg.appendChild(particula.elemento);
            this.particulas.push(particula);
        }
        
        // Limpar partículas antigas
        this.limparParticulasAntigas();
    }
    
    criarParticulaFisica() {
        const elemento = document.createElement('div');
        const tamanho = Math.random() * 6 + 2;
        const cores = [
            'rgba(255, 215, 0, 0.8)',
            'rgba(255, 107, 107, 0.7)',
            'rgba(76, 205, 196, 0.7)',
            'rgba(138, 43, 226, 0.6)',
            'rgba(255, 255, 255, 0.9)'
        ];
        
        const particula = {
            elemento: elemento,
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            vida: 3000,
            criadaEm: Date.now(),
            tamanho: tamanho,
            cor: cores[Math.floor(Math.random() * cores.length)]
        };
        
        elemento.style.cssText = `
            position: absolute;
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: ${particula.cor};
            border-radius: 50%;
            pointer-events: none;
            left: ${particula.x}%;
            top: ${particula.y}%;
            box-shadow: 0 0 ${tamanho * 2}px ${particula.cor};
            animation: particulaGlow 2s ease-in-out infinite alternate;
        `;
        
        return particula;
    }
    
    atualizarParticulasFisica() {
        this.particulas.forEach(particula => {
            const idade = Date.now() - particula.criadaEm;
            const progresso = idade / particula.vida;
            
            if (progresso >= 1) return;
            
            // Aplicar física
            particula.vy += roletaConfig.efeitos.particulas.gravidade;
            particula.vx += roletaConfig.efeitos.particulas.vento.x;
            particula.vy += roletaConfig.efeitos.particulas.vento.y;
            
            particula.x += particula.vx;
            particula.y += particula.vy;
            
            // Colisão com bordas
            if (roletaConfig.efeitos.particulas.colisao) {
                if (particula.x <= 0 || particula.x >= 100) particula.vx *= -0.8;
                if (particula.y <= 0 || particula.y >= 100) particula.vy *= -0.8;
                
                particula.x = Math.max(0, Math.min(100, particula.x));
                particula.y = Math.max(0, Math.min(100, particula.y));
            }
            
            // Atualizar posição visual
            particula.elemento.style.left = `${particula.x}%`;
            particula.elemento.style.top = `${particula.y}%`;
            
            // Fade out
            const opacity = 1 - progresso;
            particula.elemento.style.opacity = opacity;
        });
    }
    
    limparParticulasAntigas() {
        const agora = Date.now();
        this.particulas = this.particulas.filter(particula => {
            const idade = agora - particula.criadaEm;
            if (idade >= particula.vida) {
                if (particula.elemento.parentNode) {
                    particula.elemento.parentNode.removeChild(particula.elemento);
                }
                return false;
            }
            return true;
        });
    }
    
    destacarSetorVencedor(setorIndex) {
        const setores = document.querySelectorAll('.setor');
        if (setores[setorIndex]) {
            // Efeito de destaque ultra-dramático
            setores[setorIndex].style.animation = 'setorVencedorUltra 2s ease-in-out 4';
            setores[setorIndex].style.zIndex = '100';
            setores[setorIndex].style.transform += ' scale(1.15)';
            
            // Criar aura dourada
            const aura = document.createElement('div');
            aura.style.cssText = `
                position: absolute;
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                border: 3px solid rgba(255, 215, 0, 0.8);
                border-radius: inherit;
                box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
                animation: auraVencedora 1s ease-in-out infinite alternate;
                pointer-events: none;
            `;
            
            setores[setorIndex].appendChild(aura);
            
            setTimeout(() => {
                setores[setorIndex].style.animation = '';
                setores[setorIndex].style.zIndex = '';
                setores[setorIndex].style.transform = setores[setorIndex].style.transform.replace(' scale(1.15)', '');
                if (aura.parentNode) {
                    aura.parentNode.removeChild(aura);
                }
            }, 8000);
        }
    }
    
    criarConfetesAvancados() {
        const container = document.querySelector('.confetti-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const cores = ['#ffd700', '#ff6b6b', '#4ecdc4', '#8a2be2', '#00ff88', '#ff9f43', '#ff1493'];
        const formas = ['circle', 'square', 'triangle', 'star'];
        
        for (let i = 0; i < 80; i++) {
            const confete = document.createElement('div');
            const tamanho = Math.random() * 12 + 4;
            const cor = cores[Math.floor(Math.random() * cores.length)];
            const forma = formas[Math.floor(Math.random() * formas.length)];
            
            let borderRadius = '0%';
            let clipPath = 'none';
            
            switch (forma) {
                case 'circle':
                    borderRadius = '50%';
                    break;
                case 'triangle':
                    clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                    break;
                case 'star':
                    clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
                    break;
            }
            
            confete.style.cssText = `
                position: absolute;
                width: ${tamanho}px;
                height: ${tamanho}px;
                background: ${cor};
                border-radius: ${borderRadius};
                clip-path: ${clipPath};
                left: ${Math.random() * 100}%;
                top: -20px;
                box-shadow: 0 0 ${tamanho}px ${cor};
                animation: confeteFallAvancado ${3 + Math.random() * 4}s ease-out forwards;
                animation-delay: ${Math.random() * 3}s;
            `;
            
            container.appendChild(confete);
        }
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 8000);
    }
    
    limparEfeitos() {
        if (elements.roleta) {
            elements.roleta.style.filter = '';
            elements.roleta.style.transform = elements.roleta.style.transform.replace(/scale\([^)]*\)/g, '');
            elements.roleta.style.boxShadow = '';
        }
        
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Limpar todas as partículas
        this.particulas.forEach(particula => {
            if (particula.elemento.parentNode) {
                particula.elemento.parentNode.removeChild(particula.elemento);
            }
        });
        this.particulas = [];
    }
}

// ===== SISTEMA DE PERFORMANCE ADAPTATIVA =====

class PerformanceAdaptativa {
    constructor() {
        this.fps = 60;
        this.ultimoFrame = 0;
        this.contadorFrames = 0;
        this.tempoInicio = Date.now();
        this.qualidade = 'alta';
        this.adaptativo = true;
        this.historico = [];
    }
    
    atualizar() {
        const agora = Date.now();
        this.contadorFrames++;
        
        // Calcular FPS a cada segundo
        if (agora - this.tempoInicio >= 1000) {
            this.fps = this.contadorFrames;
            this.historico.push(this.fps);
            
            // Manter apenas os últimos 10 segundos
            if (this.historico.length > 10) {
                this.historico.shift();
            }
            
            // Adaptar qualidade se necessário
            if (this.adaptativo) {
                this.adaptarQualidade();
            }
            
            this.contadorFrames = 0;
            this.tempoInicio = agora;
        }
        
        this.ultimoFrame = agora;
        return this.fps;
    }
    
    adaptarQualidade() {
        const fpsMedia = this.historico.reduce((a, b) => a + b, 0) / this.historico.length;
        
        if (fpsMedia < 30 && this.qualidade === 'alta') {
            this.qualidade = 'media';
            this.aplicarQualidadeMedia();
            console.log('📉 Qualidade reduzida para média (FPS:', fpsMedia.toFixed(1), ')');
        } else if (fpsMedia < 20 && this.qualidade === 'media') {
            this.qualidade = 'baixa';
            this.aplicarQualidadeBaixa();
            console.log('📉 Qualidade reduzida para baixa (FPS:', fpsMedia.toFixed(1), ')');
        } else if (fpsMedia > 50 && this.qualidade === 'media') {
            this.qualidade = 'alta';
            this.aplicarQualidadeAlta();
            console.log('📈 Qualidade aumentada para alta (FPS:', fpsMedia.toFixed(1), ')');
        } else if (fpsMedia > 40 && this.qualidade === 'baixa') {
            this.qualidade = 'media';
            this.aplicarQualidadeMedia();
            console.log('📈 Qualidade aumentada para média (FPS:', fpsMedia.toFixed(1), ')');
        }
    }
    
    aplicarQualidadeAlta() {
        roletaConfig.efeitos.particulas.quantidade = 50;
        roletaConfig.efeitos.motionBlur.samples = 12;
        gameState.performance.qualidade = 'alta';
    }
    
    aplicarQualidadeMedia() {
        roletaConfig.efeitos.particulas.quantidade = 25;
        roletaConfig.efeitos.motionBlur.samples = 8;
        gameState.performance.qualidade = 'media';
    }
    
    aplicarQualidadeBaixa() {
        roletaConfig.efeitos.particulas.quantidade = 10;
        roletaConfig.efeitos.motionBlur.samples = 4;
        gameState.performance.qualidade = 'baixa';
    }
    
    getFPS() {
        return this.fps;
    }
    
    getQualidade() {
        return this.qualidade;
    }
}

// ===== CLASSE SIMPLEX NOISE PARA IMPERFEIÇÕES NATURAIS =====

class SimplexNoise {
    constructor() {
        this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
        this.p = [];
        for(let i=0; i<256; i++) {
            this.p[i] = Math.floor(Math.random()*256);
        }
        for(let i=0; i<512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }
    
    perm = [];
    
    dot(g, x, y) {
        return g[0]*x + g[1]*y;
    }
    
    noise2D(xin, yin) {
        let n0, n1, n2;
        const F2 = 0.5*(Math.sqrt(3.0)-1.0);
        const s = (xin+yin)*F2;
        const i = Math.floor(xin+s);
        const j = Math.floor(yin+s);
        const G2 = (3.0-Math.sqrt(3.0))/6.0;
        const t = (i+j)*G2;
        const X0 = i-t;
        const Y0 = j-t;
        const x0 = xin-X0;
        const y0 = yin-Y0;
        let i1, j1;
        if(x0>y0) {i1=1; j1=0;}
        else {i1=0; j1=1;}
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        const ii = i & 255;
        const jj = j & 255;
        const gi0 = this.perm[ii+this.perm[jj]] % 12;
        const gi1 = this.perm[ii+i1+this.perm[jj+j1]] % 12;
        const gi2 = this.perm[ii+1+this.perm[jj+1]] % 12;
        let t0 = 0.5 - x0*x0-y0*y0;
        if(t0<0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
        }
        let t1 = 0.5 - x1*x1-y1*y1;
        if(t1<0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }
        let t2 = 0.5 - x2*x2-y2*y2;
        if(t2<0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }
        return 70.0 * (n0 + n1 + n2);
    }
}

// ===== INSTÂNCIAS DOS SISTEMAS ULTRA-AVANÇADOS =====
const fisica = new FisicaQuantica();
const audioSystem = new AudioEspacial3D();
const efeitos = new EfeitosCinematograficos();
const performance = new PerformanceAdaptativa();

// ===== FUNÇÕES PRINCIPAIS ULTRA-APRIMORADAS =====

// Inicialização ultra-avançada
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 RoletaWin Ultra-Realista - Iniciando...');
    
    setTimeout(() => {
        carregarEstadoJogo();
        inicializarEventListeners();
        atualizarInterface();
        criarParticulas();
        inicializarEfeitosVisuais();
        adicionarAnimacoesCSS();
        inicializarSistemaHaptico();
        
        // Garantir estado inicial correto
        if (elements.btnGirar && elements.btnParar) {
            elements.btnGirar.classList.remove('hidden');
            elements.btnParar.classList.add('hidden');
        }
        
        console.log('🚀 Sistema ultra-realista inicializado!');
    }, 100);
});

// Sistema háptico para dispositivos móveis
function inicializarSistemaHaptico() {
    // Detectar se o dispositivo suporta vibração
    if ('vibrate' in navigator) {
        console.log('📱 Sistema háptico disponível');
        gameState.haptico = true;
    }
}

function vibrar(padrao) {
    if (gameState.haptico && 'vibrate' in navigator) {
        navigator.vibrate(padrao);
    }
}

// Carregar estado do jogo
function carregarEstadoJogo() {
    const estadoSalvo = localStorage.getItem('roletaUser');
    if (estadoSalvo) {
        const estadoParsed = JSON.parse(estadoSalvo);
        gameState = { ...gameState, ...estadoParsed };
        gameState.estadoRoleta = ESTADOS_ROLETA.IDLE;
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
    delete estadoParaSalvar.performance;
    delete estadoParaSalvar.haptico;
    
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
        vibrar([10]); // Vibração sutil
        handleGirarClick();
    });
    
    elements.btnParar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnParar);
        vibrar([20]); // Vibração mais forte
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
    
    // Eventos de teclado com feedback háptico
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameState.bloqueado) {
            e.preventDefault();
            vibrar([5]);
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
        iniciarGiroUltraRealista();
    } else {
        mostrarToast('Você não tem mais giros grátis disponíveis!', 'warning');
    }
}

// Handle click no botão parar
function handlePararClick() {
    if (gameState.bloqueado || gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING) {
        return;
    }
    
    pararGiroUltraRealista();
}

// ===== FUNÇÃO PRINCIPAL: INICIAR GIRO ULTRA-REALISTA =====
function iniciarGiroUltraRealista() {
    if (gameState.girosGratis <= 0 || gameState.bloqueado) {
        return;
    }
    
    console.log('🎯 Iniciando giro ultra-realista');
    
    // Bloquear ações e definir estado
    gameState.bloqueado = true;
    gameState.estadoRoleta = ESTADOS_ROLETA.SPINNING;
    gameState.tempoInicioGiro = Date.now();
    
    // Resetar física quântica
    fisica.reset();
    fisica.posicao = gameState.anguloAtual;
    fisica.iniciarAceleracao();
    
    // Atualizar interface com antecipação
    trocarBotoesComAntecipacao(true);
    adicionarClassesGiro();
    
    // Efeitos e áudio espacial
    audioSystem.play('giroInicio', 1);
    vibrar([50, 50, 100]); // Padrão de vibração para início
    
    // Iniciar loop de animação ultra-avançado
    iniciarLoopAnimacaoUltraAvancado();
    
    mostrarToast('Clique em PARAR quando quiser parar a roleta!', 'info');
}

// ===== LOOP DE ANIMAÇÃO ULTRA-AVANÇADO =====
function iniciarLoopAnimacaoUltraAvancado() {
    let ultimoTempo = Date.now();
    let ultimoTick = 0;
    let contadorTicks = 0;
    
    function loop() {
        if (gameState.estadoRoleta === ESTADOS_ROLETA.STOPPED) {
            return; // Parar loop
        }
        
        const agora = Date.now();
        const deltaTime = agora - ultimoTempo;
        ultimoTempo = agora;
        
        // Atualizar sistema de performance
        const fps = performance.atualizar();
        
        // Atualizar física quântica
        const estadoFisica = fisica.atualizar(deltaTime);
        
        // Atualizar estado do jogo
        gameState.anguloAtual = estadoFisica.posicao;
        gameState.velocidadeAtual = estadoFisica.velocidade;
        gameState.fisica.momentum = estadoFisica.momentum;
        
        // Aplicar rotação ultra-suave
        if (elements.roleta) {
            elements.roleta.style.transform = `rotate(${gameState.anguloAtual}deg)`;
        }
        
        // Efeitos visuais cinematográficos baseados na velocidade
        efeitos.aplicarEfeitosVelocidade(gameState.velocidadeAtual, estadoFisica.fase);
        
        // Atualizar indicador de velocidade
        atualizarIndicadorVelocidade();
        
        // Criar partículas avançadas durante o giro
        if (gameState.velocidadeAtual > 3) {
            efeitos.criarParticulasAvancadas();
        }
        
        // Atualizar física das partículas
        efeitos.atualizarParticulasFisica();
        
        // Sistema de áudio espacial avançado
        const intervaloTick = Math.max(30, 200 - (gameState.velocidadeAtual * 8));
        if (agora - ultimoTick > intervaloTick && gameState.velocidadeAtual > 5) {
            audioSystem.playTick(gameState.velocidadeAtual);
            
            // Vibração sutil para ticks
            if (contadorTicks % 4 === 0) {
                vibrar([2]);
            }
            
            ultimoTick = agora;
            contadorTicks++;
        }
        
        // Som de vento em alta velocidade
        if (gameState.velocidadeAtual > 15 && Math.random() < 0.1) {
            audioSystem.play('vento', gameState.velocidadeAtual);
        }
        
        // Som de atrito durante desaceleração
        if (estadoFisica.fase === 'desacelerando' && Math.random() < 0.2) {
            audioSystem.play('atrito', gameState.velocidadeAtual / 20);
        }
        
        // Verificar se terminou
        if (estadoFisica.completo) {
            finalizarGiroUltraRealista();
            return;
        }
        
        // Continuar loop
        gameState.animacaoId = requestAnimationFrame(loop);
    }
    
    loop();
}

// ===== PARAR GIRO ULTRA-REALISTA =====
function pararGiroUltraRealista() {
    if (gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING) {
        return;
    }
    
    console.log('🛑 Parando giro ultra-realista');
    
    gameState.estadoRoleta = ESTADOS_ROLETA.STOPPING;
    
    // Determinar prêmio e posição final
    const { anguloFinal, premioGanho } = calcularResultadoFinal();
    
    // Iniciar desaceleração ultra-realista para a posição final
    fisica.iniciarDesaceleracao(anguloFinal);
    
    // Armazenar resultado para finalização
    gameState.premioAtual = premioGanho;
    gameState.anguloFinal = anguloFinal;
    
    // Atualizar interface
    trocarBotoesComAntecipacao(false);
    removerClassesGiro();
    
    // Vibração para confirmação de parada
    vibrar([30, 30, 60]);
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
    
    // Calcular ângulo final ultra-preciso
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

// ===== FINALIZAR GIRO ULTRA-REALISTA =====
function finalizarGiroUltraRealista() {
    console.log('🏁 Finalizando giro ultra-realista');
    
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
    
    // Garantir posição final ultra-exata
    gameState.anguloAtual = gameState.anguloFinal;
    if (elements.roleta) {
        elements.roleta.style.transform = `rotate(${gameState.anguloFinal}deg)`;
    }
    
    // Resetar indicador de velocidade
    if (elements.velocidadeIndicator) {
        elements.velocidadeIndicator.style.width = '0%';
    }
    
    // Som de parada espacial
    audioSystem.play('parada', 0);
    
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
    
    // Mostrar resultado com delay ultra-dramático
    setTimeout(() => {
        if (premioGanho > 0) {
            efeitos.criarConfetesAvancados();
            audioSystem.play('vitoria');
            
            // Vibração de vitória
            vibrar([100, 50, 100, 50, 200]);
            
            // Destacar setor vencedor
            const setorIndex = Math.floor(((360 - (gameState.anguloFinal % 360) + 22.5) % 360) / 45);
            efeitos.destacarSetorVencedor(setorIndex);
        } else {
            audioSystem.play('derrota');
            vibrar([200]); // Vibração de derrota
        }
        
        mostrarModalResultado(premioGanho);
    }, 1200);
}

// ===== FUNÇÕES DE INTERFACE ULTRA-APRIMORADAS =====

// Trocar botões com antecipação e follow-through
function trocarBotoesComAntecipacao(girando) {
    if (!elements.btnGirar || !elements.btnParar) return;
    
    if (girando) {
        // Antecipação
        elements.btnGirar.style.transform = 'scale(1.1)';
        setTimeout(() => {
            elements.btnGirar.style.transform = 'scale(0.8)';
            elements.btnGirar.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            elements.btnGirar.classList.add('hidden');
            elements.btnParar.classList.remove('hidden');
            elements.btnParar.style.transform = 'scale(0.8)';
            elements.btnParar.style.opacity = '0';
            
            // Follow-through
            requestAnimationFrame(() => {
                elements.btnParar.style.transform = 'scale(1.1)';
                elements.btnParar.style.opacity = '1';
                setTimeout(() => {
                    elements.btnParar.style.transform = 'scale(1)';
                }, 150);
            });
        }, 250);
    } else {
        // Antecipação
        elements.btnParar.style.transform = 'scale(1.1)';
        setTimeout(() => {
            elements.btnParar.style.transform = 'scale(0.8)';
            elements.btnParar.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            elements.btnParar.classList.add('hidden');
            elements.btnGirar.classList.remove('hidden');
            elements.btnGirar.style.transform = 'scale(0.8)';
            elements.btnGirar.style.opacity = '0';
            
            // Follow-through
            requestAnimationFrame(() => {
                elements.btnGirar.style.transform = 'scale(1.1)';
                elements.btnGirar.style.opacity = '1';
                setTimeout(() => {
                    elements.btnGirar.style.transform = 'scale(1)';
                }, 150);
            });
        }, 250);
    }
}

// Adicionar classes de giro com micro-animações
function adicionarClassesGiro() {
    if (elements.roletaContainer) {
        elements.roletaContainer.classList.add('girando');
        elements.roletaContainer.style.transform = 'scale(1.02)';
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

// Remover classes de giro com transições suaves
function removerClassesGiro() {
    if (elements.roletaContainer) {
        elements.roletaContainer.classList.remove('girando');
        elements.roletaContainer.style.transform = 'scale(1)';
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
        
        setTimeout(() => {
            elements.roleta.classList.remove('parando');
        }, 1500);
    }
}

// Atualizar indicador de velocidade com efeitos
function atualizarIndicadorVelocidade() {
    if (elements.velocidadeIndicator) {
        const porcentagem = (gameState.velocidadeAtual / roletaConfig.fisica.velocidadeConstante) * 100;
        const largura = Math.min(100, porcentagem);
        
        elements.velocidadeIndicator.style.width = `${largura}%`;
        
        // Cor baseada na velocidade
        const hue = Math.min(120, largura * 1.2); // Verde para vermelho
        elements.velocidadeIndicator.style.background = `hsl(${hue}, 70%, 50%)`;
        
        // Efeito de pulsação em alta velocidade
        if (largura > 80) {
            elements.velocidadeIndicator.style.boxShadow = `0 0 ${largura/10}px hsl(${hue}, 70%, 50%)`;
        } else {
            elements.velocidadeIndicator.style.boxShadow = 'none';
        }
    }
}

// ===== FUNÇÕES AUXILIARES ULTRA-APRIMORADAS =====

// Criar efeito ripple ultra-avançado
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
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%);
        transform: scale(0);
        animation: rippleUltra 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        pointer-events: none;
        z-index: 1000;
    `;
    
    ripple.classList.add('btn-ripple');
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

// Adicionar animações CSS ultra-avançadas
function adicionarAnimacoesCSS() {
    if (document.querySelector('#animacoes-ultra-realistas')) return;
    
    const style = document.createElement('style');
    style.id = 'animacoes-ultra-realistas';
    style.textContent = `
        @keyframes rippleUltra {
            0% { transform: scale(0); opacity: 1; }
            50% { transform: scale(2); opacity: 0.5; }
            100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes particulaGlow {
            0% { filter: brightness(1) blur(0px); }
            100% { filter: brightness(1.5) blur(1px); }
        }
        
        @keyframes confeteFallAvancado {
            0% { 
                transform: translateY(-20px) rotate(0deg) scale(0); 
                opacity: 1; 
            }
            10% { 
                transform: translateY(0px) rotate(36deg) scale(1); 
                opacity: 1; 
            }
            100% { 
                transform: translateY(100vh) rotate(720deg) scale(0.5); 
                opacity: 0; 
            }
        }
        
        @keyframes setorVencedorUltra {
            0%, 100% { 
                transform: scale(1) rotate(var(--rotation)); 
                filter: brightness(1) saturate(1);
            }
            25% { 
                transform: scale(1.15) rotate(var(--rotation)); 
                filter: brightness(1.4) saturate(1.3);
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.9);
            }
            50% { 
                transform: scale(1.1) rotate(var(--rotation)); 
                filter: brightness(1.6) saturate(1.5);
                box-shadow: 0 0 60px rgba(255, 215, 0, 1);
            }
            75% { 
                transform: scale(1.15) rotate(var(--rotation)); 
                filter: brightness(1.4) saturate(1.3);
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.9);
            }
        }
        
        @keyframes auraVencedora {
            0% { 
                opacity: 0.6; 
                transform: scale(1); 
            }
            100% { 
                opacity: 1; 
                transform: scale(1.05); 
            }
        }
        
        .roleta.girando {
            transition: none !important;
            will-change: transform;
        }
        
        .roleta.parando {
            transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .roletaContainer.girando {
            transition: transform 0.3s ease-out;
        }
        
        /* Otimizações de performance */
        .roleta, .setor, .btn-girar, .btn-parar {
            will-change: transform;
            backface-visibility: hidden;
            transform-style: preserve-3d;
        }
        
        /* Suporte a motion reduzido */
        @media (prefers-reduced-motion: reduce) {
            .roleta, .particula, .confete, .btn-ripple {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Melhorias para dispositivos móveis */
        @media (max-width: 768px) {
            .roleta {
                transform-origin: center center;
            }
            
            .btn-ripple {
                animation-duration: 0.4s;
            }
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
    
    vibrar([50, 50, 100]); // Vibração de boas-vindas
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
    
    const quantidade = performance.getQualidade() === 'alta' ? 40 : 20;
    
    for (let i = 0; i < quantidade; i++) {
        const particula = document.createElement('div');
        const tamanho = Math.random() * 8 + 2;
        const cores = [
            'rgba(255, 215, 0, 0.4)',
            'rgba(138, 43, 226, 0.3)',
            'rgba(255, 105, 180, 0.3)',
            'rgba(76, 205, 196, 0.3)',
            'rgba(255, 255, 255, 0.2)'
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
            animation: particleFloat ${25 + Math.random() * 35}s linear infinite;
            animation-delay: ${Math.random() * 20}s;
            box-shadow: 0 0 ${tamanho * 2}px ${cores[Math.floor(Math.random() * cores.length)]};
        `;
        
        elements.particlesBg.appendChild(particula);
    }
    
    // Adicionar animação de partículas se não existir
    if (!document.querySelector('#particle-animation-ultra')) {
        const style = document.createElement('style');
        style.id = 'particle-animation-ultra';
        style.textContent = `
            @keyframes particleFloat {
                0% { 
                    transform: translateY(0px) translateX(0px) rotate(0deg) scale(0); 
                    opacity: 0; 
                }
                5% { 
                    opacity: 1; 
                    transform: translateY(-30px) translateX(15px) rotate(45deg) scale(1); 
                }
                50% {
                    transform: translateY(-50vh) translateX(75px) rotate(180deg) scale(1.2);
                }
                95% { 
                    opacity: 0.8; 
                }
                100% { 
                    transform: translateY(-100vh) translateX(200px) rotate(360deg) scale(0); 
                    opacity: 0; 
                }
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
                setor.style.transform += ' scale(1.08)';
                setor.style.zIndex = '10';
                setor.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.6)';
                setor.style.filter = 'brightness(1.2) saturate(1.1)';
                
                // Vibração sutil no hover (apenas mobile)
                if ('vibrate' in navigator) {
                    vibrar([1]);
                }
            }
        });
        
        setor.addEventListener('mouseleave', () => {
            if (gameState.estadoRoleta === ESTADOS_ROLETA.IDLE) {
                setor.style.transform = setor.style.transform.replace(' scale(1.08)', '');
                setor.style.zIndex = 'auto';
                setor.style.boxShadow = 'none';
                setor.style.filter = 'none';
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
            momentum: 0,
            inercia: 0.995,
            atritoRolamento: 0.998,
            atritoAr: 0.9995,
            atritoMagnetico: 0.997,
            variacao: 0.0001,
            oscilacaoAmplitude: 0,
            oscilacaoFrequencia: 0,
            oscilacaoTempo: 0
        },
        performance: {
            fps: 60,
            qualidade: 'alta',
            adaptativo: true,
            ultimoFrame: 0,
            contadorFrames: 0
        }
    };
    
    fisica.reset();
    efeitos.limparEfeitos();
    localStorage.removeItem('roletaUser');
    atualizarInterface();
    location.reload();
}

// Expor para console (debugging)
window.resetarJogo = resetarJogo;
window.gameState = gameState;
window.roletaConfig = roletaConfig;
window.fisica = fisica;
window.audioSystem = audioSystem;
window.efeitos = efeitos;
window.performance = performance;

console.log('🎰 RoletaWin Ultra-Realista carregada com sucesso!');
console.log('📊 Performance:', performance.getQualidade());
console.log('🔊 Áudio espacial:', audioSystem.context ? 'Ativo' : 'Inativo');
console.log('📱 Sistema háptico:', gameState.haptico ? 'Disponível' : 'Indisponível');

