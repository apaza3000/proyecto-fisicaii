
import { COLORS } from "./colors.js";
import { SETP_V, STEP_R, VALUE_MAX_R, VALUE_MAX_V, VALUE_MIN_R, VALUE_MIN_V } from "./constants.js";
import { Graph } from "./Graph.js";
import { drawRect } from "./helpers.js";
import { Particle } from "./Particle.js";
import { UIManager } from "./UIManager.js";

const DEFAULTS = { ANCHO: 1000, ALTO: 180, FPS: 60 };

class SimulationModular {
    constructor(opts = {}) {
        this.canvas = document.getElementById('simulation-layer');
        this.ctx = this.canvas.getContext('2d');
        this.graph = new Graph(document.getElementById('graph-canvas'));
        this.ui = new UIManager();

        this.width = opts.width || DEFAULTS.ANCHO;
        this.height = opts.height || DEFAULTS.ALTO;

        this.voltage = 5;
        this.resistance = 5;
        this.current = 0;
        this.power = 0;

        this.paused = false;
        this.showHelp = true;

        this.history = [];
        this.particles = [];

        this.h_r = 60;

        this._bindKeys();
        this._bindButtons();
        this._resizeCanvas();
        this._generateParticles(100);
    }
    _resizeCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.graph.canvas.width = this.width - 20;
        this.graph.canvas.height = 230;
    }
    _generateParticles(n) {
        this.particles.length = 0;
        for (let i = 0; i < n; i++) this.particles.push(new Particle(this.width, this.height, this.h_r));
    }
    _bindKeys() {
        const actions = {
            ArrowUp: () => this.voltage = Math.min(VALUE_MAX_V, this.voltage + SETP_V),
            ArrowDown: () => this.voltage = Math.max(VALUE_MIN_V, this.voltage - SETP_V),
            ArrowRight: () => this.resistance = Math.min(VALUE_MAX_R, this.resistance + STEP_R),
            ArrowLeft: () => this.resistance = Math.max(VALUE_MIN_R, this.resistance - STEP_R),
            ' ': () => this.paused = !this.paused,
            r: () => this.reset(),
            R: () => this.reset(),
            h: () => this.showHelp = !this.showHelp,
            H: () => this.showHelp = !this.showHelp
        };

        document.addEventListener('keydown', (e) => { if (actions[e.key]) actions[e.key](); });
    }


    _bindButtons() {
        document.querySelectorAll(".btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const action = btn.dataset.action;

                switch (action) {
                    case "voltaje-mas":
                        this.voltage = Math.min(VALUE_MAX_V, this.voltage + SETP_V);
                        break;
                    case "voltaje-menos":
                        this.voltage = Math.max(VALUE_MIN_V, this.voltage - SETP_V)
                        break;
                    case "resistencia-mas":
                        this.resistance = Math.min(VALUE_MAX_R, this.resistance + STEP_R)
                        break;
                    case "pause":
                        this.paused = !this.paused
                        break;
                    case "resistencia-menos":
                        this.resistance = Math.max(VALUE_MIN_R, this.resistance - STEP_R)
                        break;
                }
            });
        });
    }

    calculate() {
        this.current = this.voltage / this.resistance;
        this.power = this.voltage * this.current;
        this.graph.push(this.current);
        this.ui.updateUI(this.voltage, this.resistance, this.current, this.power);
    }

    updateParticles() {
        const speed = this.current * 3;
        for (const p of this.particles) p.update(speed, this.resistance, this.h_r);
    }

    drawPipe() {
        const ctx = this.ctx;
        const tube_width = this.width * 0.9;
        const tube_height = 100;
        let tube_start_x = this.width / 2 - tube_width / 2
        let tube_end_x = this.width / 2 + tube_width / 2
        let tube_start_y = this.height / 2 - tube_height / 2
        let tube_end_y = this.height / 2 + tube_height / 2
        const w_r = this.width * 0.15
        const h_r = tube_height
        const r_s_x = tube_start_x + (tube_width / 2) - (w_r / 2)
        const r_s_y = tube_start_y;


        const step_resb = ((h_r - 15) / 2) / ((VALUE_MAX_R - VALUE_MIN_R) / STEP_R)

        const bulge = (this.resistance) * 2 * step_resb;     // altura de la “panza”
        ctx.clearRect(0, 0, this.width, this.height);


        // tubería con gradiente interno
        const tubeGrad = ctx.createLinearGradient(50, 150, 900, 250);
        tubeGrad.addColorStop(0, '#2b2b2b');
        tubeGrad.addColorStop(1, '#0f1720');
        drawRect(ctx, tube_start_x, tube_start_y, tube_width / 2 - (w_r / 2), tube_height, tubeGrad, COLORS.GRIS_CLARO, 2);
        drawRect(ctx, r_s_x + w_r, tube_start_y, tube_width / 2 - (w_r / 2), tube_height, tubeGrad, COLORS.GRIS_CLARO, 2);

        drawRect(ctx, tube_start_x, tube_start_y, 40, tube_height, COLORS.AMARILLO, COLORS.NARANJA, 2);
        ctx.fillStyle = COLORS.NEGRO;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', tube_start_x + 20, (tube_start_y + tube_height / 2));
        /* 
        resistencia mediante ddd
        */

        const q1 = r_s_x + w_r * 0.25;    // puntos simétricos
        const q2 = r_s_x + w_r * 0.5;    // puntos simétricos
        const q3 = r_s_x + w_r * 0.75;    // puntos simétricos


        // Función para dibujar un tramo curvo fácil
        function qCurve(cpX, cpY, endX, endY) {
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        }

        ctx.lineWidth = 3;
        ctx.strokeStyle = COLORS.ROJO;
        ctx.fillStyle = '#fc121270';
        ctx.shadowColor = 'rgba(0,0,0,0.50)';
        ctx.shadowBlur = 2;

        ctx.beginPath();

        // ---------- PARTE SUPERIOR ----------
        ctx.moveTo(r_s_x, r_s_y);

        qCurve(q1, r_s_y, q1, r_s_y + bulge / 2);
        qCurve(q1, r_s_y + bulge, q2, r_s_y + bulge);
        qCurve(q3, r_s_y + bulge, q3, r_s_y + bulge / 2);
        qCurve(q3, r_s_y, r_s_x + w_r, r_s_y);

        // ---------- BAJAR LATERAL DERECHO ----------
        ctx.lineTo(r_s_x + w_r, r_s_y + h_r);

        // ---------- PARTE INFERIOR ----------
        qCurve(q3, r_s_y + h_r, q3, r_s_y + h_r - bulge / 2);
        qCurve(q3, r_s_y + h_r - bulge, q2, r_s_y + h_r - bulge);
        qCurve(q1, r_s_y + h_r - bulge, q1, r_s_y + h_r - bulge / 2);
        qCurve(q1, r_s_y + h_r, r_s_x, r_s_y + h_r);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        /* 
        fin de resistencia
         */

        this.h_r = h_r - (bulge * 2);
        // resistencia - más detalle: borde iluminado
        const anchoRes = Math.max(20, 5 + this.resistance * 10);
        const xRes = tube_start_x + tube_width / 2;
        const r = Math.min(255, 120 + this.resistance * 10);
        const g = Math.max(50, 120 - this.resistance * 5);
        const colorRes = `rgb(${r},${g},50)`;
        // gradiente para resistencia
        const resGrad = ctx.createLinearGradient(xRes, 150, xRes + anchoRes, 250);
        resGrad.addColorStop(0, colorRes); resGrad.addColorStop(1, '#402000');
        // drawRect(ctx, xRes - anchoRes / 2, tube_start_y, anchoRes, tube_height, resGrad, 'rgba(255,80,80,0.9)', 2);
        ctx.fillStyle = COLORS.BLANCO; ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RESISTENCIA', xRes, tube_start_y - 15);

        drawRect(ctx, tube_end_x - 40, tube_start_y, 40, tube_height, COLORS.GRIS_OSCURO, COLORS.GRIS_CLARO, 2);

        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = COLORS.BLANCO;
        ctx.fillText('-', tube_end_x - 20, (tube_start_y + tube_height / 2));
    }


    drawParticles() {
        const ctx = this.ctx;
        // aplicar composite para rastro suave
        ctx.globalCompositeOperation = 'lighter';
        for (const p of this.particles) p.draw(ctx);
        ctx.globalCompositeOperation = 'source-over';
    }

    draw() {
        this.drawPipe();
        this.drawParticles();
        this.graph.draw();
        this.ui.toggleHelp(this.showHelp);
        this.ui.togglePause(this.paused);
    }

    step() {
        if (!this.paused) {
            this.calculate();
            this.updateParticles();
        }
        this.draw();
    }

    // override run para controlar framerate opcional
    /*     run() {
            const loop = (t) => { this.step(); requestAnimationFrame(loop); };
            loop();
        } */

    run() {
        let last = performance.now();

        const loop = (now) => {
            // diferencia entre frames
            const dt = (now - last) / 16.67;   // normalizado a 60 fps (16.67ms)
            last = now;

            // límite para evitar saltos fuertes si hay lag
            const smooth = Math.min(dt, 2);    // evita animación rota

            this.step(smooth);
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }


    reset() {
        this.voltage = 5; this.resistance = 5; this.history = []; this.paused = false; this._generateParticles(100);
    }
}





function initSimulacionVisual() {
    const sim = new SimulationModular();
    sim.run();
    return sim;
}

/* ==========================
   FIN DEL ARCHIVO
   ========================== */


// Iniciar simulación cuando se carga la página
window.addEventListener('load', initSimulacionVisual);
