/**
 * Genera un número aleatorio centrado en 0 dentro de un rango definido.
 *
 * Produce valores entre `-scale/2` y `scale/2`, útil para simular
 * ruido, vibración o variaciones naturales en animaciones.
 *
 * @example
 * rnd();       // valor entre -0.5 y 0.5
 * rnd(10);     // valor entre -5 y 5
 *
 * @param {number} [scale=1] - Amplitud máxima del rango aleatorio.
 * @returns {number} Número aleatorio dentro del rango especificado.
 */
const rnd = (scale = 1) => (Math.random() - 0.5) * scale;


/**
 * Limita un valor entre un mínimo y un máximo (clamp).
 * Muy útil para evitar que valores dinámicos salgan de un rango permitido.
 *
 * @example
 * clamp(10, 0, 5); // 5
 * clamp(-3, 0, 5); // 0
 *
 * @param {number} v - Valor a limitar.
 * @param {number} a - Límite inferior.
 * @param {number} b - Límite superior.
 * @returns {number} Valor limitado dentro del rango [a, b].
 */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));


/**
 * Realiza interpolación lineal entre dos valores.
 * Muy usado para animaciones, transiciones suaves y mezclas de valores.
 *
 * @example
 * lerp(0, 100, 0.5); // 50
 * lerp(5, 10, 0.2);  // 6
 *
 * @param {number} a - Valor inicial.
 * @param {number} b - Valor final.
 * @param {number} t - Factor de interpolación (0 = a, 1 = b).
 * @returns {number} Valor interpolado linealmente.
 */
const lerp = (a, b, t) => a + (b - a) * t;


/**
 * Dibuja un rectángulo con relleno y borde en un canvas.
 *
 * Simplifica las operaciones comunes de dibujo en simulaciones
 * para evitar repetición de código.
 *
 * @example
 * drawRect(ctx, 10, 10, 100, 50, "#000", "#fff", 2);
 *
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D del canvas.
 * @param {number} x - Posición X del rectángulo.
 * @param {number} y - Posición Y del rectángulo.
 * @param {number} w - Ancho del rectángulo.
 * @param {number} h - Alto del rectángulo.
 * @param {string} fill - Color de relleno.
 * @param {string} stroke - Color del borde.
 * @param {number} [line=3] - Grosor del borde.
 */
function drawRect(ctx, x, y, w, h, fill, stroke, line = 3) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = stroke;
    ctx.lineWidth = line;
    ctx.strokeRect(x, y, w, h);
}

export { rnd, clamp, lerp, drawRect };

