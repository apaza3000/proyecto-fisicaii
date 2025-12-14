import { COLORS } from "./colors.js";

export class Graph {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.history = [];
        this.maxPoints = 200;
    }

    push(val) {
        this.history.push(val);
        if (this.history.length > this.maxPoints) this.history.shift();
    }

    draw() {
        const ctx = this.ctx; 
        const W = this.canvas.width; 
        const H = this.canvas.height;
        // fondo gradiente
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, '#0b1220');
        g.addColorStop(1, '#14141e');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

        // ejes
        ctx.strokeStyle = COLORS.AZUL_CLARO; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(50, H - 10); ctx.lineTo(W - 10, H - 10); ctx.stroke(); // x
        ctx.beginPath(); ctx.moveTo(50, 10); ctx.lineTo(50, H - 10); ctx.stroke(); // y

        if (this.history.length < 2) return;
        const maxVal = Math.max(...this.history, 1);

        ctx.beginPath(); ctx.strokeStyle = COLORS.VERDE; ctx.lineWidth = 2;
        for (let i = 0; i < this.history.length; i++) {
            const px = 50 + (i / this.history.length) * (W - 50);
            const py = H - 20 - (this.history[i] / maxVal) * (H - 30);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();



        // guías
        ctx.strokeStyle = COLORS.GRIS_OSCURO;
        ctx.lineWidth = 1;
        const lines = 4;
        for (let i = 0; i <= lines; i++) {
            const y = 10 + (i / lines) * (H - 20);
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(W, y);
            ctx.stroke();

            // marcas y valores (simple)
            ctx.fillStyle = COLORS.AMARILLO; ctx.font = '0.9rem Arial';
            if (i == lines) {
                ctx.fillText('0 A', 2, H - 8);
                continue;
            }
            ctx.fillText((maxVal / (i + 1)).toFixed(2) + " A", 2, y +2);


        }
    }
}