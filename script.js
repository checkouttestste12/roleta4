// ===== ROLETA PROFISSIONAL COM GIRO CONTÍNUO =====

// Estados da máquina de estados da roleta
const ESTADOS_ROLETA = {
    IDLE: 'idle',
    SPINNING: 'spinning',
    STOPPING: 'stopping',
    STOPPED: 'stopped'
};

// Estado do jogo com gerenciamento robusto
let gameState = {
    // Estado da roleta
    estadoRoleta: ESTADOS_ROLETA.IDLE,
    anguloAtual: 0,
    velocidadeAtual: 0,
    tempoGiro: 0,
    
    // Controles de animação
    animacaoId: null,
    
    // Locks para prevenir ações simultâneas
    bloqueado: false,
    podeParar: false
};

// Elementos DOM
const elements = {
    btnGirar: document.getElementById('btn-girar'),
    btnParar: document.getElementById('btn-parar'),
    roleta: document.getElementById('roleta'),
    statusText: document.getElementById('status-text'),
    velocidadeBar: document.getElementById('velocidade-bar'),
    resultado: document.getElementById('resultado'),
    toastContainer: document.getElementById('toast-container'),
    particlesBg: document.getElementById('particles-bg'),
    roletaContainer: document.getElementById('roleta-gratis-container'),
    girosPremiosInfo: document.getElementById('giros-premios-info')
};

// Configurações da roleta
const roletaConfig = {
    setores: [
        { premio: 0, texto: 'Vazio', angulo: 0 },
        { premio: 25, texto: 'R$ 25', angulo: 45 },
        { premio: 0, texto: 'Vazio', angulo: 90 },
        { premio: 50, texto: 'R$ 50', angulo: 135 },
        { premio: 0, texto: 'Vazio', angulo: 180 },
        { premio: 75, texto: 'R$ 75', angulo: 225 },
        { premio: 0, texto: 'Vazio', angulo: 270 },
        { premio: 100, texto: 'R$ 100', angulo: 315 }
    ]
};

// ===== SISTEMA DE FÍSICA PARA GIRO CONTÍNUO =====

class FisicaContinua {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.angulo = 0;
        this.velocidade = 0;
        this.tempo = 0;
        this.fase = 'idle';
        this.parandoForcado = false;
        this.tempoAceleracao = 2500; // 2.5 segundos para acelerar
        this.tempoDesaceleracao = 4000; // 4 segundos para desacelerar
        this.velocidadeAlvo = 14 + Math.random() * 8; // 14-22 rpm
        this.anguloAlvo = 0;
    }

    iniciarGiro() {
        this.reset();
        this.fase = 'acelerando';
        return null; // Não há setor alvo pré-definido
    }

    pararGiro() {
        if (this.fase === 'acelerando' || this.fase === 'constante') {
            this.parandoForcado = true;
            this.fase = 'desacelerando';
            this.tempo = 0; // Resetar tempo para desaceleração
            
            // Calcular setor alvo baseado na posição atual
            const anguloAtual = this.angulo % 360;
            const setorAtual = Math.floor(anguloAtual / 45);
            const proximoSetor = (setorAtual + 1 + Math.floor(Math.random() * 4)) % 8; // 1-4 setores à frente
            
            // Adicionar voltas extras para tornar a parada mais natural
            const voltasExtras = 3 + Math.random() * 4; // 3-7 voltas extras
            this.anguloAlvo = this.angulo + (voltasExtras * 360) + 
                             (proximoSetor * 45) - (anguloAtual % 360);
            
            return proximoSetor;
        }
        return null;
    }

    atualizar(deltaTime) {
        this.tempo += deltaTime;
        
        switch (this.fase) {
            case 'acelerando':
                this.atualizarAceleracao();
                break;
            case 'constante':
                this.atualizarConstante();
                break;
            case 'desacelerando':
                this.atualizarDesaceleracao();
                break;
        }

        // Atualizar ângulo
        this.angulo += this.velocidade * (deltaTime / 16.67) * 0.6;

        return {
            angulo: this.angulo % 360,
            velocidade: this.velocidade,
            fase: this.fase,
            completo: this.fase === 'parado'
        };
    }

    atualizarAceleracao() {
        if (this.tempo < this.tempoAceleracao) {
            const progresso = this.tempo / this.tempoAceleracao;
            const curva = this.easeOutCubic(progresso);
            this.velocidade = 2 + (this.velocidadeAlvo - 2) * curva;
        } else {
            this.fase = 'constante';
            this.velocidade = this.velocidadeAlvo;
        }
    }

    atualizarConstante() {
        // Manter velocidade constante com pequenas variações naturais
        const variacao = Math.sin(this.tempo * 0.002) * 0.8;
        this.velocidade = this.velocidadeAlvo + variacao;
    }

    atualizarDesaceleracao() {
        if (this.tempo < this.tempoDesaceleracao) {
            const progresso = this.tempo / this.tempoDesaceleracao;
            const curva = this.easeInOutCubic(progresso);
            
            // Desacelerar suavemente
            this.velocidade = this.velocidadeAlvo * (1 - curva);
            
            // Convergir para o ângulo alvo nos últimos 40%
            if (progresso > 0.6) {
                const fatorConvergencia = (progresso - 0.6) / 0.4;
                const convergencia = this.easeInOutCubic(fatorConvergencia);
                
                const diferenca = this.anguloAlvo - this.angulo;
                this.angulo += diferenca * convergencia * 0.015;
            }
        } else {
            this.fase = 'parado';
            this.velocidade = 0;
            this.angulo = this.anguloAlvo;
        }
    }

    // Funções de easing
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// ===== SISTEMA DE ÁUDIO SIMPLIFICADO =====

class AudioSystem {
    constructor() {
        this.context = null;
        this.masterGain = null;
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
        } catch (e) {
            console.log('❌ Áudio não suportado:', e);
        }
    }
    
    play(type) {
        if (!this.context || this.muted) return;
        
        const agora = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        switch (type) {
            case 'giroInicio':
                oscillator.frequency.value = 440;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, agora);
                gainNode.gain.exponentialRampToValueAtTime(0.001, agora + 0.5);
                oscillator.start(agora);
                oscillator.stop(agora + 0.5);
                break;
            case 'parada':
                oscillator.frequency.value = 220;
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.1, agora);
                gainNode.gain.exponentialRampToValueAtTime(0.001, agora + 1);
                oscillator.start(agora);
                oscillator.stop(agora + 1);
                break;
            case 'vitoria':
                [440, 554, 659, 880].forEach((freq, i) => {
                    const osc = this.context.createOscillator();
                    const gain = this.context.createGain();
                    osc.connect(gain);
                    gain.connect(this.masterGain);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.05, agora + i * 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.001, agora + i * 0.15 + 0.15);
                    osc.start(agora + i * 0.15);
                    osc.stop(agora + i * 0.15 + 0.15);
                });
                break;
        }
    }
}

// ===== SISTEMA DE EFEITOS VISUAIS =====

class EfeitosVisuais {
    aplicarEfeitosVelocidade(velocidade) {
        if (!elements.roleta) return;
        
        const velocidadeNormalizada = Math.min(1, velocidade / 20);
        
        // Blur motion realista
        const blur = velocidadeNormalizada * 1.5;
        
        // Brilho dinâmico
        const brilho = 1 + (velocidadeNormalizada * 0.2);
        
        // Aplicar efeitos
        elements.roleta.style.filter = `blur(${blur}px) brightness(${brilho})`;
    }
    
    criarParticulasGiro() {
        if (!elements.particlesBg) return;
        
        for (let i = 0; i < 2; i++) {
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
            
            setTimeout(() => {
                if (particula.parentNode) {
                    particula.parentNode.removeChild(particula);
                }
            }, 2000);
        }
    }
    
    criarConfetes() {
        if (!elements.particlesBg) return;
        
        for (let i = 0; i < 50; i++) {
            const confete = document.createElement('div');
            const cores = ['#ffd700', '#ff6b6b', '#4ecdc4', '#9b59b6', '#ff9f43'];
            
            confete.style.cssText = `
                position: absolute;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${cores[Math.floor(Math.random() * cores.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                pointer-events: none;
                animation: confeteFall ${2 + Math.random() * 3}s ease-out forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            
            elements.particlesBg.appendChild(confete);
        }
        
        setTimeout(() => {
            const confetes = elements.particlesBg.querySelectorAll('div');
            confetes.forEach(confete => {
                if (confete.style.animation.includes('confeteFall')) {
                    confete.remove();
                }
            });
        }, 6000);
    }
    
    limparEfeitos() {
        if (elements.roleta) {
            elements.roleta.style.filter = '';
        }
    }
}

// ===== INSTÂNCIAS DOS SISTEMAS =====
const fisica = new FisicaContinua();
const audioSystem = new AudioSystem();
const efeitos = new EfeitosVisuais();

// ===== FUNÇÕES PRINCIPAIS =====

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 RoletaWin Giro Contínuo - Iniciando...');
    
    setTimeout(() => {
        inicializarEventListeners();
        criarParticulas();
        console.log('🚀 Sistema inicializado!');
    }, 100);
});

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
    
    iniciarGiroProfissional();
}

// Handle click no botão parar
function handlePararClick() {
    if (gameState.bloqueado || gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING) {
        return;
    }
    
    pararGiroProfissional();
}

// ===== FUNÇÃO PRINCIPAL: INICIAR GIRO CONTÍNUO =====
function iniciarGiroProfissional() {
    if (gameState.bloqueado) return;
    
    console.log('🎯 Iniciando giro contínuo');
    
    // Bloquear ações e definir estado
    gameState.bloqueado = true;
    gameState.estadoRoleta = ESTADOS_ROLETA.SPINNING;
    gameState.tempoGiro = 0;
    gameState.podeParar = false;
    
    // Resetar física
    fisica.reset();
    fisica.angulo = gameState.anguloAtual;
    fisica.iniciarGiro();
    
    // Atualizar interface
    trocarBotoes(true);
    
    // Efeitos
    audioSystem.play('giroInicio');
    
    // Iniciar loop de animação
    iniciarLoopAnimacao();
    
    mostrarToast('A roleta está girando! Clique em PARAR quando quiser parar.', 'info');
}

// ===== LOOP DE ANIMAÇÃO CONTÍNUO =====
function iniciarLoopAnimacao() {
    let ultimoTempo = Date.now();
    
    function loop() {
        if (gameState.estadoRoleta === ESTADOS_ROLETA.STOPPED) {
            return; // Parar loop
        }
        
        const agora = Date.now();
        const deltaTime = agora - ultimoTempo;
        ultimoTempo = agora;
        
        // Atualizar tempo de giro
        gameState.tempoGiro += deltaTime;
        
        // Atualizar física
        const estadoFisica = fisica.atualizar(deltaTime);
        
        // Atualizar estado do jogo
        gameState.anguloAtual = estadoFisica.angulo;
        gameState.velocidadeAtual = estadoFisica.velocidade;
        
        // Aplicar rotação
        if (elements.roleta) {
            elements.roleta.style.transform = `rotate(${gameState.anguloAtual}deg)`;
        }
        
        // Efeitos visuais baseados na velocidade
        efeitos.aplicarEfeitosVelocidade(gameState.velocidadeAtual);
        
        // Atualizar indicadores
        atualizarIndicadores(estadoFisica);
        
        // Criar partículas durante o giro
        if (gameState.velocidadeAtual > 8 && Math.random() < 0.3) {
            efeitos.criarParticulasGiro();
        }
        
        // Habilitar botão parar após aceleração
        if (estadoFisica.fase === 'constante' && !gameState.podeParar) {
            gameState.podeParar = true;
            elements.btnParar.disabled = false;
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

// ===== PARAR GIRO CONTÍNUO =====
function pararGiroProfissional() {
    if (gameState.estadoRoleta !== ESTADOS_ROLETA.SPINNING || !gameState.podeParar) {
        return;
    }
    
    console.log('🛑 Parando giro contínuo');
    
    gameState.estadoRoleta = ESTADOS_ROLETA.STOPPING;
    
    // Iniciar desaceleração
    const setorAlvo = fisica.pararGiro();
    gameState.setorAlvo = setorAlvo;
    
    // Atualizar interface
    elements.btnParar.disabled = true;
    
    mostrarToast('Comando de parada recebido! A roleta está desacelerando...', 'warning');
}

// ===== FINALIZAR GIRO CONTÍNUO =====
function finalizarGiroProfissional() {
    console.log('🏁 Finalizando giro contínuo');
    
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
    
    // Resetar indicadores
    if (elements.velocidadeBar) {
        elements.velocidadeBar.style.width = '0%';
    }
    
    // Som de parada
    audioSystem.play('parada');
    
    // Calcular resultado final
    const anguloFinal = (360 - (gameState.anguloAtual % 360)) % 360;
    const setorIndex = Math.floor(anguloFinal / 45);
    const setorResultado = roletaConfig.setores[setorIndex];
    
    gameState.velocidadeAtual = 0;
    
    // Resetar estado da roleta
    gameState.estadoRoleta = ESTADOS_ROLETA.IDLE;
    
    // Mostrar resultado com delay
    setTimeout(() => {
        if (setorResultado.premio > 0) {
            efeitos.criarConfetes();
            audioSystem.play('vitoria');
        }
        
        mostrarResultado(setorResultado);
        
        // Resetar para próximo giro
        setTimeout(() => {
            trocarBotoes(false);
            elements.statusText.textContent = 'Pronto para girar continuamente!';
        }, 3000);
    }, 1000);
}

// ===== FUNÇÕES DE INTERFACE =====

// Trocar botões
function trocarBotoes(girando) {
    if (!elements.btnGirar || !elements.btnParar) return;
    
    if (girando) {
        elements.btnGirar.classList.add('hidden');
        elements.btnParar.classList.remove('hidden');
        elements.btnParar.disabled = true; // Será habilitado após aceleração
    } else {
        elements.btnParar.classList.add('hidden');
        elements.btnGirar.classList.remove('hidden');
    }
}

// Atualizar indicadores
function atualizarIndicadores(estadoFisica) {
    // Atualizar status
    let statusText = '';
    const tempoMinutos = Math.floor(gameState.tempoGiro / 60000);
    const tempoSegundos = Math.floor((gameState.tempoGiro % 60000) / 1000);
    const tempoFormatado = `${tempoMinutos}:${tempoSegundos.toString().padStart(2, '0')}`;
    
    switch (estadoFisica.fase) {
        case 'acelerando':
            statusText = `Acelerando... ${estadoFisica.velocidade.toFixed(1)} rpm`;
            break;
        case 'constante':
            statusText = `Girando continuamente... ${estadoFisica.velocidade.toFixed(1)} rpm (${tempoFormatado})`;
            break;
        case 'desacelerando':
            statusText = `Parando suavemente... ${estadoFisica.velocidade.toFixed(1)} rpm`;
            break;
    }
    
    if (elements.statusText) {
        elements.statusText.textContent = statusText;
    }
    
    // Atualizar barra de velocidade
    if (elements.velocidadeBar) {
        const porcentagem = (estadoFisica.velocidade / 25) * 100;
        elements.velocidadeBar.style.width = `${Math.min(100, porcentagem)}%`;
    }
}

// Mostrar resultado
function mostrarResultado(setor) {
    const isWin = setor.premio > 0;
    
    elements.resultado.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px;">
                ${isWin ? '🎉' : '😔'}
            </div>
            <div style="font-size: 2rem; margin-bottom: 10px; color: ${isWin ? '#ffd700' : '#ff6b6b'};">
                ${setor.texto}
            </div>
            <div style="font-size: 1.2rem; opacity: 0.9;">
                ${isWin ? 'Parabéns! Você ganhou!' : 'Tente novamente!'}
            </div>
        </div>
    `;
    
    elements.resultado.classList.add('show');
    
    setTimeout(() => {
        elements.resultado.classList.remove('show');
    }, 5000);
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
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
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
    toast.style.color = tipo === 'warning' ? '#0a0e27' : '#ffffff';
    
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
    
    for (let i = 0; i < 25; i++) {
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
}

console.log('🎰 RoletaWin Giro Contínuo carregada com sucesso!');


