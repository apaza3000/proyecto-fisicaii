/**
 * Paleta de colores utilizada en la interfaz y simulación.
 * Cada propiedad representa un color en formato hexadecimal,
 * organizado por tonos o propósito visual.
 */
export const COLORS = {
    /** Azul oscuro para elementos principales o resaltados profundos */
    AZUL_OSCURO: '#0064c8',

    /** Azul claro para detalles, brillos o acentos suaves */
    AZUL_CLARO: '#64b4ff',

    /** Azul usado en partículas dinámicas dentro de la simulación */
    AZUL_PARTICULA: '#3296ff',

    /** Gris oscuro para bordes, sombras o estructura */
    GRIS_OSCURO: '#646464',

    /** Gris claro para superficies, rellenos o fondos secundarios */
    GRIS_CLARO: '#b4b4b4',

    /** Negro profundo para fondos y contraste */
    NEGRO: '#14141e',

    /** Blanco para textos, iconos o elementos de alto contraste */
    BLANCO: '#ffffff',

    /** Amarillo intenso para energía, conexión o entrada positiva */
    AMARILLO: '#ffdc00',

    /** Verde para estados activos o indicadores positivos */
    VERDE: '#00ff64',

    /** Rojo para errores, alertas o salida negativa */
    ROJO: '#ff5050',

    /** Naranja usado en resistencias o partes cálidas de la simulación */
    NARANJA: '#ffa500'
};

/**
 * Convierte un color en formato hexadecimal (#RRGGBB)
 * a un objeto RGB con valores numéricos independientes.
 *
 * @example
 * const color = hexToRGB('#ff0000');
 * console.log(color); // { r: 255, g: 0, b: 0 }
 *
 * @param {string} hex - El color en formato hexadecimal (ej. "#64b4ff").
 * @returns {{ r:number, g:number, b:number }} Objeto con componentes RGB.
 */
function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

export { hexToRGB };
