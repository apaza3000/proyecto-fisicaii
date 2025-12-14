
/* --- BASE DE DATOS --- */
const materialesDB = [
    {
        nombre: "Cobre",
        rho: 0.0172,
        colores: {
            cuerpo: "#b87333",
            cara: "#8a5528",
            corte: "#dba375",
            texto: "#ffffff"   // cobre es claro → texto negro
        }
    },
    {
        nombre: "Aluminio",
        rho: 0.0282,
        colores: {
            cuerpo: "#c0c0c0",
            cara: "#a6a6a6",
            corte: "#e0e0e0",
            texto: "#000000"   // aluminio es muy claro → texto negro
        }
    },
    {
        nombre: "Plata",
        rho: 0.0159,
        colores: {
            cuerpo: "#d9d9d9",
            cara: "#bfbfbf",
            corte: "#f2f2f2",
            texto: "#000000"   // plateado muy claro → texto negro
        }
    },
    {
        nombre: "Oro",
        rho: 0.0244,
        colores: {
            cuerpo: "#d4af37",
            cara: "#b08c27",
            corte: "#f5d76e",
            texto: "#000000"   // dorado claro → texto negro
        }
    },
    {
        nombre: "Hierro",
        rho: 0.10,
        colores: {
            cuerpo: "#7f7f7f",
            cara: "#595959",
            corte: "#a6a6a6",
            texto: "#ffffff"   // hierro oscuro → texto blanco
        }
    },
    {
        nombre: "Nicromo",
        rho: 1.10,
        colores: {
            cuerpo: "#8e8e8e",
            cara: "#6e6e6e",
            corte: "#b3b3b3",
            texto: "#ffffff"   // nicrom oscuro → texto blanco
        }
    }
];

const cablesDB = [
    { id: 1, calibre: "4/0 AWG", area: 107.0, amp_max: 230 },
    { id: 2, calibre: "3/0 AWG", area: 85.0, amp_max: 200 },
    { id: 3, calibre: "2/0 AWG", area: 67.4, amp_max: 175 },
    { id: 4, calibre: "1/0 AWG", area: 53.5, amp_max: 150 },
    { id: 5, calibre: "2 AWG", area: 33.6, amp_max: 115 },
    { id: 6, calibre: "4 AWG", area: 21.2, amp_max: 85 },
    { id: 7, calibre: "6 AWG", area: 13.3, amp_max: 55 },
    { id: 8, calibre: "8 AWG", area: 8.37, amp_max: 40 },
    { id: 9, calibre: "10 AWG", area: 5.26, amp_max: 30 },
    { id: 10, calibre: "12 AWG", area: 3.31, amp_max: 20 },
    { id: 11, calibre: "14 AWG", area: 2.08, amp_max: 15 },
    { id: 12, calibre: "16 AWG", area: 1.31, amp_max: 13 },
    { id: 13, calibre: "18 AWG", area: 0.82, amp_max: 10 },
    { id: 14, calibre: "20 AWG", area: 0.52, amp_max: 5 },
    { id: 15, calibre: "22 AWG", area: 0.33, amp_max: 3 }
];

/* ------- CARGA INICIAL -------- */
window.onload = () => {
    const selMat = document.getElementById("selectMaterial");
    materialesDB.forEach(m => {
        const op = document.createElement("option");
        op.value = m.nombre;
        op.textContent = m.nombre;
        selMat.appendChild(op);
    });

    const selCable = document.getElementById("selectCable");
    cablesDB.forEach(c => {
        const op = document.createElement("option");
        op.value = c.area + "|" + c.amp_max;
        op.textContent = c.calibre;
        selCable.appendChild(op);
    });


};

function toggleModo() {
    const modo = document.querySelector('input[name="modo"]:checked').value;
    document.getElementById('seccionEstandar').classList.toggle('hidden', modo !== 'estandar');
    document.getElementById('seccionManual').classList.toggle('hidden', modo !== 'manual');
    document.getElementById('resultados').style.display = 'none';
    document.getElementById("canvasConductor").style.display = 'none';
}

/* ----------- CÁLCULO PRINCIPAL ----------- */

function calcular() {

    let material = materialesDB.find(x => x.nombre == document.getElementById("selectMaterial").value)
    console.log(material);
    const rho = material.rho;
    let L = parseFloat(document.getElementById("inputLongitud").value);
    const unidad = document.getElementById("selectUnidad").value;
    const modo = document.querySelector("input[name='modo']:checked").value;

    if (!rho || !L || L <= 0) return alert("Verifica los datos ingresados.");

    if (unidad === "km") L *= 1000;
    if (unidad === "cm") L /= 100;
    if (unidad === "mm") L /= 1000;

    let A, amp;

    if (modo === "estandar") {
        const datos = document.getElementById("selectCable").value.split("|");

        A = parseFloat(datos[0]);
        amp = parseFloat(datos[1]);
    } else {
        const d = parseFloat(document.getElementById("inputDiametro").value);
        if (!d || d <= 0) return alert("Ingresa un diámetro válido.");
        A = Math.PI * Math.pow(d / 2, 2);
        amp = null;
    }

    const R = rho * (L / A);

    document.getElementById("resultados").style.display = "none";
    document.getElementById("canvasConductor").style.display = 'block'
    document.getElementById("resResistencia").innerText = R.toFixed(4) + " Ω";

    if (amp) {
        document.getElementById("resAmperaje").innerText = amp + " A";
        document.getElementById("resCaida").innerText = (R * amp).toFixed(2) + " V";
        document.getElementById("avisoManual").style.display = "none";
    } else {
        document.getElementById("resAmperaje").innerText = "---";
        document.getElementById("resCaida").innerText = "---";
        document.getElementById("avisoManual").style.display = "block";
    }

    dibujarConductor(rho, A, L, R, unidad, material.nombre, material.colores);
}


/* ===========================
       GRÁFICOS DINÁMICOS
============================ */


function dibujarConductor(rho, A, L, R, LM, MT, colores) {
    const c = document.getElementById("canvasConductor");
    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    // Colores según material seleccionado
    const col = colores;

    // ====== dibujo ======
    const x = 60;
    const y = 100;
    const largo = 420;
    const radio = 35;

    // cuerpo del cilindro
    ctx.fillStyle = col.cuerpo;
    ctx.fillRect(x, y - radio, largo, radio * 2);
    ctx.strokeRect(x, y - radio, largo, radio * 2);

    // cara derecha
    ctx.beginPath();
    ctx.arc(x + largo, y, radio, 0, Math.PI * 2);
    ctx.fillStyle = col.cara;
    ctx.fill();
    ctx.stroke();

    // corte transversal (A)
    ctx.beginPath();
    ctx.arc(x + largo / 2, y, radio - 5, 0, Math.PI * 2);
    ctx.fillStyle = col.corte;
    ctx.fill();
    ctx.stroke();

    // etiquetas
    ctx.fillStyle = col.texto;
    ctx.font = "16px Arial";
    ctx.fillText(`Material = ${MT}`, x + 5, y + 5);
    ctx.fillText(`A = ${A.toFixed(4)}`, x + largo / 2 - 30, y + 5);
    ctx.fillText(`ρ = ${rho}`, x + largo - 50, y + 5);


    // flecha L
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x + largo, y - 50);
    ctx.strokeStyle = "white"
    ctx.stroke();

    // etiquetas
    ctx.fillStyle = "white";
    // punta izquierda
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x + 15, y - 55);
    ctx.lineTo(x + 15, y - 45);
    ctx.fill();

    // punta derecha
    ctx.beginPath();
    ctx.moveTo(x + largo, y - 50);
    ctx.lineTo(x + largo - 15, y - 55);
    ctx.lineTo(x + largo - 15, y - 45);
    ctx.fill();

    ctx.fillText(`L = ${L} ${LM}`, x + largo / 2 - 20, y - 55);
    ctx.font = "20px Arial";
    ctx.fillText(`R = ${R.toFixed(5)}  Ω`, x + largo / 2 - 40, y + radio + 60);
}

