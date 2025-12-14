import { COLORS } from "./colors.js";
import { clamp, lerp, rnd } from "./helpers.js";

export class Particle {
    constructor(width_c, height_c, h_r = 60, color = COLORS.AZUL_PARTICULA) {

        this.h_r = h_r;
        this.cw = width_c;
        this.ch = height_c;

        this.updateTubeStart();

        // posición inicial
        this.x = 50 + Math.random() * 370;
        this.y = this.tube_start_y + Math.random() * h_r;

        this.vx = 0;
        this.radius = 3 + Math.random() * 2;
        this.color = color;
        this.brightness = 200 + Math.random() * 55;

        this.targetX = 50 + Math.random() * 370;

        this.trail = new Array(5).fill(null);
        this.trailIndex = 0;
        this.alpha = 0.4 + Math.random() * 0.6;
    }

    updateTubeStart() {
        this.tube_start_y = this.ch / 2 - (this.h_r / 2) + 10;
    }

    update(speed, resistance, h_r) {
        this.h_r = h_r;
        this.updateTubeStart();

        // velocidad
        this.vx = speed;

        // suavizado de movimiento
        const randomX = rnd(0.6);
        const newX = this.x + this.vx + randomX;
        this.x = lerp(this.x, newX, 0.7);

        // movimiento vertical leve
        this.y = lerp(this.y, this.y + rnd(1.2), 0.7);

        // zona sensible
        const zoneStart = 420;
        const zoneEnd = 420 + Math.max(20, 150 - resistance * 10);
        if (this.x > zoneStart && this.x < zoneEnd) this.y += rnd(2.2);

        // límites verticales
        const minY = this.tube_start_y;
        const maxY = this.tube_start_y + h_r - 20;
        this.y = clamp(this.y, minY, maxY);

        // reinicio si sale del canvas
        if (this.x > this.cw * 0.9) this.reset();

        // actualizar trail (optimizado con buffer circular)
        this.trail[this.trailIndex] = { x: this.x, y: this.y, r: this.radius };
        this.trailIndex = (this.trailIndex + 1) % this.trail.length;
    }

    reset() {
        this.x = 50 + Math.random() * 100;
        this.y = this.tube_start_y + 10 + Math.random() * (this.h_r - 40);
    }

    draw(ctx) {
        // === TRAIL ===
        ctx.save();

        const len = this.trail.length;
        for (let i = 0; i < len; i++) {
            const t = this.trail[(this.trailIndex + i) % len];
            if (!t) continue;

            const op = ((i + 1) / len) * this.alpha;

            ctx.globalAlpha = op * 0.6;
            ctx.beginPath();
            ctx.arc(t.x - (len - i) * 0.6, t.y, t.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        ctx.restore();

        // === PARTÍCULA PRINCIPAL ===
        ctx.save();
        /* ctx.shadowColor = 'rgba(50,150,255,0.6)';
        ctx.shadowBlur = 3; */

        ctx.globalCompositeOperation = "lighter";

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();

        // centro blanco
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.BLANCO;
        ctx.fill();
    }
}
