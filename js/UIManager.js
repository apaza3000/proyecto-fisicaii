import { COLORS, hexToRGB } from "./colors.js";
import { VALUE_MAX_A, VALUE_MAX_R, VALUE_MAX_V } from "./constants.js";
import { clamp } from "./helpers.js";
export class UIManager {
    constructor() {
        this.voltageValue = document.getElementById('voltage-value');
        this.resistanceValue = document.getElementById('resistance-value');
        this.currentValue = document.getElementById('current-value');
        this.powerValue = document.getElementById('power-value');

        this.voltageBar = document.getElementById('voltage-bar');
        this.resistanceBar = document.getElementById('resistance-bar');
        this.currentBar = document.getElementById('current-bar');

        this.pauseIndicator = document.getElementById('pause-indicator');
        this.helpPanel = document.getElementById('help-panel');
    }

    updateUI(volt, res, cur, pow) {
        this.setText(this.voltageValue, volt, 'V', 1);
        this.setText(this.resistanceValue, res, 'Ω', 1);
        this.setText(this.currentValue, cur, 'A', 2);
        this.setText(this.powerValue, pow, 'W', 2);

        this.setBar(this.voltageBar, volt, VALUE_MAX_V, COLORS.VERDE, COLORS.ROJO, this.voltageValue);
        this.setBar(this.resistanceBar, res, VALUE_MAX_R, COLORS.VERDE, COLORS.ROJO, this.resistanceValue);
        this.setBar(this.currentBar, cur, VALUE_MAX_A, COLORS.VERDE, COLORS.ROJO, this.currentValue);
    }

    toggleHelp(show) { if (this.helpPanel) this.helpPanel.style.display = show ? 'block' : 'none'; }
    togglePause(ind) { if (this.pauseIndicator) this.pauseIndicator.style.display = ind ? 'block' : 'none'; }

    setText(element, value, unit = '', decimals = 1) {
        if (!element) return;
        element.textContent = `${Number(value).toFixed(decimals)} ${unit}`.trim();

    }

    setBar(bar, value, max, colorMin, colorMax, elementValue) {
        if (!bar) return;
        bar.style.width = `${clamp((value / max) * 100, 0, 100)}%`;
        bar.style.backgroundColor = this.obtenerColorIntensidad(value, 0, max, colorMin, colorMax);
        elementValue.style.color = this.obtenerColorIntensidad(value, 0, max, colorMin, colorMax);
    }



    obtenerColorIntensidad(valor, minVal, maxVal, colorMin, colorMax) {
        const progreso = clamp((valor - minVal) / (maxVal - minVal), 0, 1);
        const minRGB = hexToRGB(colorMin);
        const maxRGB = hexToRGB(colorMax);
        const r = Math.floor(minRGB.r + (maxRGB.r - minRGB.r) * progreso);
        const g = Math.floor(minRGB.g + (maxRGB.g - minRGB.g) * progreso);
        const b = Math.floor(minRGB.b + (maxRGB.b - minRGB.b) * progreso);
        return `rgb(${r}, ${g}, ${b})`;
    }




}
