"use strict"

// Mostrar/Ocultar contenido al hacer clic en "Ver +"
let botones = document.querySelectorAll(".btn");
for (let i = 0; i < botones.length; i++) {
    botones[i].addEventListener("click", function(e) {
        // Ocultar/mostrar la descripción
        let texto = this.nextElementSibling;
        if (texto && texto.classList) {
            texto.classList.toggle("ver");
        }
        
        // Buscar el contenido del proyecto (está después de la descripción)
        let contenido = this.nextElementSibling.nextElementSibling;
        if (contenido && contenido.classList) {
            contenido.classList.toggle("ver");
        }
        
        // Para el proyecto del cambiador de colores (proyecto 5)
        let descripcion = this.nextElementSibling;
        if (descripcion && descripcion.textContent === "Cambiador de Colores Aleatorios") {
            if (contenido && contenido.classList.contains("ver")) {
                // Se está abriendo - restaurar el color guardado o el original
                restaurarColorOriginal();
            } else {
                // Se está cerrando - volver al color original
                restaurarColorOriginal();
            }
        }
    });
}

// ========== PROYECTO 1: CONTADOR ==========
const contador = document.querySelector('.contador');
const buttons = document.querySelector('.buttons');

function guardarContador(valor) {
    localStorage.setItem("contadorValor", valor);
}

function cargarContador() {
    const valorGuardado = localStorage.getItem("contadorValor");
    if (valorGuardado !== null) {
        contador.innerHTML = valorGuardado;
        setColor();
    }
}

if (buttons) {
    buttons.addEventListener('click', e => {
        if (e.target.classList.contains('agregar')) {
            contador.innerHTML++;
            setColor();
            guardarContador(contador.innerHTML);
        }
        if (e.target.classList.contains('quitar')) {
            contador.innerHTML--;
            setColor();
            guardarContador(contador.innerHTML);
        }
        if (e.target.classList.contains('reiniciar')) {
            contador.innerHTML = 0;
            setColor();
            guardarContador(contador.innerHTML);
        }
    });
}

function setColor() {
    if (contador.innerHTML > 0) {
        contador.style.color = "green";
    } else if (contador.innerHTML < 0) {
        contador.style.color = "red";
    } else {
        contador.style.color = "#808080";
    }
}

cargarContador();

// ========== PROYECTO 2: LISTA DE TAREAS ==========
const input = document.querySelector('input');
const addBtn = document.querySelector('.btn-add');
const ul = document.querySelector("ul");
const empty = document.querySelector('.empty');

function cargarTareas() {
    const tareasGuardadas = localStorage.getItem("tareasLista");
    if (tareasGuardadas) {
        const tareas = JSON.parse(tareasGuardadas);
        tareas.forEach(texto => {
            agregarTareaDOM(texto);
        });
    }
}

function guardarTareas() {
    const items = document.querySelectorAll('li p');
    const tareas = Array.from(items).map(item => item.textContent);
    localStorage.setItem("tareasLista", JSON.stringify(tareas));
}

function agregarTareaDOM(text) {
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.textContent = text;
    li.appendChild(p);
    li.appendChild(addDeleteBtn());
    ul.appendChild(li);
    empty.style.display = "none";
    guardarTareas();
}

if (addBtn) {
    addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text !== '') {
            agregarTareaDOM(text);
            input.value = "";
        }
    });
}

function addDeleteBtn() {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "x";
    deleteBtn.className = "btn-delete";
    deleteBtn.addEventListener('click', (e) => {
        const item = e.target.parentElement;
        ul.removeChild(item);
        const items = document.querySelectorAll('li');
        if (items.length === 0) {
            empty.style.display = "block";
        }
        guardarTareas();
    });
    return deleteBtn;
}

cargarTareas();
if (ul && ul.children.length === 0) {
    empty.style.display = "block";
}

// ========== PROYECTO 3: ADIVINA EL NUMERO ==========
document.addEventListener("DOMContentLoaded", (event) => {
    let numeroRandom;
    let intentos = document.querySelector("#intentos");
    let ultimoResultado = document.querySelector("#ultimoResultado");
    let menorMayor = document.querySelector("#menorMayor");
    let enviar = document.querySelector("#enviar");
    let entrada = document.querySelector("#entrada");
    let reset = document.querySelector("#reset");
    let contadorIntentos;
    
    const STORAGE_KEY = "adivinaNumero";
    
    function guardarEstado() {
        const estado = {
            numeroRandom: numeroRandom,
            contadorIntentos: contadorIntentos,
            intentosTexto: intentos ? intentos.textContent : "",
            ultimoResultadoTexto: ultimoResultado ? ultimoResultado.textContent : "",
            ultimoResultadoColor: ultimoResultado ? ultimoResultado.style.backgroundColor : "",
            menorMayorTexto: menorMayor ? menorMayor.textContent : "",
            juegoTerminado: entrada ? entrada.disabled : false
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    }
    
    function cargarEstado() {
        const estadoGuardado = localStorage.getItem(STORAGE_KEY);
        if (estadoGuardado) {
            const estado = JSON.parse(estadoGuardado);
            numeroRandom = estado.numeroRandom;
            contadorIntentos = estado.contadorIntentos;
            if (intentos) intentos.textContent = estado.intentosTexto;
            if (ultimoResultado) {
                ultimoResultado.textContent = estado.ultimoResultadoTexto;
                ultimoResultado.style.backgroundColor = estado.ultimoResultadoColor;
            }
            if (menorMayor) menorMayor.textContent = estado.menorMayorTexto;
            if (estado.juegoTerminado && entrada && enviar && reset) {
                entrada.disabled = true;
                enviar.disabled = true;
                reset.style.display = "inline";
            }
            return true;
        }
        return false;
    }
    
    function resetJuego() {
        contadorIntentos = 1;
        numeroRandom = Math.floor(Math.random() * 100) + 1;
        if (intentos) intentos.textContent = "Intentos previos: ";
        if (ultimoResultado) {
            ultimoResultado.textContent = "";
            ultimoResultado.style.backgroundColor = "white";
        }
        if (menorMayor) menorMayor.textContent = "";
        if (reset) reset.style.display = "none";
        if (entrada) {
            entrada.disabled = false;
            entrada.value = "";
            entrada.focus();
        }
        if (enviar) enviar.disabled = false;
        guardarEstado();
    }
    
    function setJuegoFinalizado() {
        if (entrada) entrada.disabled = true;
        if (enviar) enviar.disabled = true;
        if (reset) reset.style.display = "inline";
        guardarEstado();
    }
    
    function revisarIntento() {
        if (!entrada) return;
        let intento = Number(entrada.value);
        if (isNaN(intento) || intento < 1 || intento > 100) {
            if (ultimoResultado) {
                ultimoResultado.textContent = "Por favor ingresa un número entre 1 y 100";
                ultimoResultado.style.backgroundColor = "#e87e72";
            }
            entrada.value = "";
            entrada.focus();
            return;
        }
        if (contadorIntentos === 1 && intentos) {
            intentos.textContent = "Intentos previos: ";
        }
        if (intentos) intentos.textContent += intento + " ";
        if (intento === numeroRandom) {
            if (ultimoResultado) {
                ultimoResultado.textContent = "¡Lo adivinaste! 🎉";
                ultimoResultado.style.backgroundColor = "#8de872";
            }
            if (menorMayor) menorMayor.textContent = "";
            setJuegoFinalizado();
        } else if (contadorIntentos >= 10) {
            if (ultimoResultado) {
                ultimoResultado.textContent = `¡Fin del juego! El número era ${numeroRandom}`;
                ultimoResultado.style.backgroundColor = "#e87e72";
            }
            if (menorMayor) menorMayor.textContent = "";
            setJuegoFinalizado();
        } else {
            if (ultimoResultado) {
                ultimoResultado.textContent = "¡Incorrecto!";
                ultimoResultado.style.backgroundColor = "#e87e72";
            }
            if (menorMayor) {
                if (intento < numeroRandom) {
                    menorMayor.textContent = "¡El número es más grande! ⬆️";
                } else if (intento > numeroRandom) {
                    menorMayor.textContent = "¡El número es más pequeño! ⬇️";
                }
            }
        }
        contadorIntentos++;
        entrada.value = "";
        entrada.focus();
        guardarEstado();
    }
    
    if (enviar) {
        const estadoCargado = cargarEstado();
        if (!estadoCargado) {
            contadorIntentos = 1;
            numeroRandom = Math.floor(Math.random() * 100) + 1;
            if (intentos) intentos.textContent = "Intentos previos: ";
            if (ultimoResultado) ultimoResultado.style.backgroundColor = "white";
            if (entrada) entrada.disabled = false;
            if (enviar) enviar.disabled = false;
            guardarEstado();
        }
        enviar.addEventListener("click", revisarIntento);
        if (entrada) {
            entrada.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    revisarIntento();
                }
            });
        }
        if (reset) {
            reset.addEventListener("click", resetJuego);
        }
    }
});

// ========== PROYECTO 4: CALCULADORA ==========
const pantalla = document.getElementById('pantalla');

function verEnPantalla(input) {
    pantalla.value += input;
}

function limpiarPantalla() {
    pantalla.value = "";
}

function calcular() {
    try {
        let expresion = pantalla.value;
        let resultado = eval(expresion);
        if (!isFinite(resultado)) {
            pantalla.value = "Error";
        } else {
            pantalla.value = resultado;
        }
    } catch (error) {
        pantalla.value = "Error";
    }
}

// ========== PROYECTO 5: CAMBIADOR DE COLORES ALEATORIOS ==========
let colorOriginal = "#e1e1e1"; // Color original de la página

function generarColorAleatorio() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const hexDisplay = document.getElementById('hexCodeDisplay');
const randomBtn = document.getElementById('randomColorBtn');
const copyBtn = document.getElementById('copyHexBtn');
const copyMsg = document.getElementById('copyMessage');

function aplicarColorAleatorio() {
    const nuevoColor = generarColorAleatorio();
    document.body.style.backgroundColor = nuevoColor;
    if (hexDisplay) hexDisplay.textContent = nuevoColor;
}

function copiarHex() {
    const colorActual = hexDisplay ? hexDisplay.textContent : '';
    if (!colorActual) return;
    navigator.clipboard.writeText(colorActual).then(() => {
        if (copyMsg) {
            copyMsg.style.display = 'inline-block';
            setTimeout(() => {
                copyMsg.style.display = 'none';
            }, 1500);
        }
    }).catch(() => {
        alert('No se pudo copiar');
    });
}

function restaurarColorOriginal() {
    document.body.style.backgroundColor = colorOriginal;
    if (hexDisplay) hexDisplay.textContent = colorOriginal;
}

// Configurar el color inicial
document.body.style.backgroundColor = colorOriginal;
if (hexDisplay) hexDisplay.textContent = colorOriginal;

if (randomBtn) {
    randomBtn.addEventListener('click', aplicarColorAleatorio);
}
if (copyBtn) {
    copyBtn.addEventListener('click', copiarHex);
}

// ========== PROYECTO 6: TEMPORIZADOR (COUNTDOWN TIMER) ==========
let intervalo;
let tiempoRestante = 0; // en segundos
let temporizadorActivo = false;

const minutosInput = document.getElementById('minutosInput');
const segundosInput = document.getElementById('segundosInput');
const reloj = document.getElementById('reloj');
const iniciarBtn = document.getElementById('iniciarBtn');
const pausarBtn = document.getElementById('pausarBtn');
const reiniciarBtn = document.getElementById('reiniciarBtn');
const mensajeTerminado = document.getElementById('mensajeTerminado');

function actualizarReloj() {
    if (!reloj) return;
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    reloj.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function obtenerTiempoDesdeInputs() {
    const minutos = parseInt(minutosInput?.value) || 0;
    const segundos = parseInt(segundosInput?.value) || 0;
    return (minutos * 60) + segundos;
}

function detenerTemporizador() {
    if (intervalo) {
        clearInterval(intervalo);
        intervalo = null;
    }
    temporizadorActivo = false;
}

function finalizarTemporizador() {
    detenerTemporizador();
    if (mensajeTerminado) {
        mensajeTerminado.style.display = 'block';
    }
    temporizadorActivo = false;
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        if (mensajeTerminado) {
            mensajeTerminado.style.display = 'none';
        }
    }, 3000);
}

function iniciarTemporizador() {
    // Si ya está activo, no hacer nada
    if (temporizadorActivo) return;
    
    // Ocultar mensaje si estaba visible
    if (mensajeTerminado) {
        mensajeTerminado.style.display = 'none';
    }
    
    // Si el tiempo llegó a 0, obtener nuevo tiempo de los inputs
    if (tiempoRestante <= 0) {
        tiempoRestante = obtenerTiempoDesdeInputs();
        if (tiempoRestante <= 0) {
            if (mensajeTerminado) {
                mensajeTerminado.textContent = '¡Ingresa un tiempo válido! ⏰';
                mensajeTerminado.style.display = 'block';
                setTimeout(() => {
                    if (mensajeTerminado) {
                        mensajeTerminado.style.display = 'none';
                        mensajeTerminado.textContent = '¡Tiempo terminado! ⏰';
                    }
                }, 2000);
            }
            return;
        }
        actualizarReloj();
    }
    
    temporizadorActivo = true;
    
    intervalo = setInterval(() => {
        if (tiempoRestante > 0) {
            tiempoRestante--;
            actualizarReloj();
            
            if (tiempoRestante === 0) {
                finalizarTemporizador();
            }
        }
    }, 1000);
}

function pausarTemporizador() {
    detenerTemporizador();
}

function reiniciarTemporizador() {
    detenerTemporizador();
    tiempoRestante = obtenerTiempoDesdeInputs();
    actualizarReloj();
    if (mensajeTerminado) {
        mensajeTerminado.style.display = 'none';
    }
    temporizadorActivo = false;
}

// Agregar event listeners
if (iniciarBtn) {
    iniciarBtn.addEventListener('click', iniciarTemporizador);
}
if (pausarBtn) {
    pausarBtn.addEventListener('click', pausarTemporizador);
}
if (reiniciarBtn) {
    reiniciarBtn.addEventListener('click', reiniciarTemporizador);
}

// Inicializar reloj
if (reloj) {
    tiempoRestante = 0;
    actualizarReloj();
}

// Evitar que se puedan poner más de 59 segundos
if (segundosInput) {
    segundosInput.addEventListener('change', function() {
        if (this.value > 59) this.value = 59;
        if (this.value < 0) this.value = 0;
    });
}
if (minutosInput) {
    minutosInput.addEventListener('change', function() {
        if (this.value > 99) this.value = 99;
        if (this.value < 0) this.value = 0;
    });
}

// ========== PROYECTO 7: GENERADOR DE CONTRASEÑAS ==========
const passwordInput = document.getElementById('passwordInput');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const mayusculasCheck = document.getElementById('mayusculas');
const minusculasCheck = document.getElementById('minusculas');
const numerosCheck = document.getElementById('numeros');
const simbolosCheck = document.getElementById('simbolos');
const generarBtn = document.getElementById('generarPasswordBtn');
const copyPasswordBtn = document.getElementById('copyPasswordBtn');
const passwordMessage = document.getElementById('passwordMessage');

// Caracteres disponibles
const MAYUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz';
const NUMEROS = '0123456789';
const SIMBOLOS = '!@#$%^&*';

function generarContrasena() {
    // Verificar que al menos una opción esté seleccionada
    if (!mayusculasCheck.checked && !minusculasCheck.checked && !numerosCheck.checked && !simbolosCheck.checked) {
        alert('Selecciona al menos una opción (Mayúsculas, Minúsculas, Números o Símbolos)');
        return '';
    }
    
    let caracteresDisponibles = '';
    let contrasena = '';
    const longitud = parseInt(lengthSlider.value);
    
    if (mayusculasCheck.checked) caracteresDisponibles += MAYUSCULAS;
    if (minusculasCheck.checked) caracteresDisponibles += MINUSCULAS;
    if (numerosCheck.checked) caracteresDisponibles += NUMEROS;
    if (simbolosCheck.checked) caracteresDisponibles += SIMBOLOS;
    
    // Generar contraseña
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteresDisponibles.length);
        contrasena += caracteresDisponibles[indiceAleatorio];
    }
    
    // Garantizar que tenga al menos un carácter de cada tipo seleccionado
    // (esto evita contraseñas que solo tengan un tipo por casualidad)
    let necesitaRevision = false;
    let contrasenaArray = contrasena.split('');
    
    if (mayusculasCheck.checked && !contrasenaArray.some(c => MAYUSCULAS.includes(c))) {
        contrasenaArray[0] = MAYUSCULAS[Math.floor(Math.random() * MAYUSCULAS.length)];
        necesitaRevision = true;
    }
    if (minusculasCheck.checked && !contrasenaArray.some(c => MINUSCULAS.includes(c))) {
        contrasenaArray[1] = MINUSCULAS[Math.floor(Math.random() * MINUSCULAS.length)];
        necesitaRevision = true;
    }
    if (numerosCheck.checked && !contrasenaArray.some(c => NUMEROS.includes(c))) {
        contrasenaArray[2] = NUMEROS[Math.floor(Math.random() * NUMEROS.length)];
        necesitaRevision = true;
    }
    if (simbolosCheck.checked && !contrasenaArray.some(c => SIMBOLOS.includes(c))) {
        contrasenaArray[3] = SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];
        necesitaRevision = true;
    }
    
    if (necesitaRevision) {
        // Mezclar el array para que los caracteres añadidos no estén siempre al inicio
        for (let i = contrasenaArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [contrasenaArray[i], contrasenaArray[j]] = [contrasenaArray[j], contrasenaArray[i]];
        }
        contrasena = contrasenaArray.join('');
    }
    
    return contrasena;
}

function mostrarContrasena() {
    const nuevaContrasena = generarContrasena();
    if (passwordInput && nuevaContrasena) {
        passwordInput.value = nuevaContrasena;
    }
}

function copiarContrasena() {
    if (!passwordInput || !passwordInput.value) {
        alert('Primero genera una contraseña');
        return;
    }
    
    navigator.clipboard.writeText(passwordInput.value).then(() => {
        if (passwordMessage) {
            passwordMessage.style.display = 'block';
            setTimeout(() => {
                passwordMessage.style.display = 'none';
            }, 1500);
        }
    }).catch(() => {
        alert('No se pudo copiar la contraseña');
    });
}

// Actualizar el valor de longitud mostrado
if (lengthSlider && lengthValue) {
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
}

// Generar contraseña al hacer clic en el botón
if (generarBtn) {
    generarBtn.addEventListener('click', mostrarContrasena);
}

// Copiar contraseña
if (copyPasswordBtn) {
    copyPasswordBtn.addEventListener('click', copiarContrasena);
}

// Generar una contraseña por defecto al cargar la página
if (passwordInput) {
    const contrasenaInicial = generarContrasena();
    if (contrasenaInicial) {
        passwordInput.value = contrasenaInicial;
    }
}

// ========== PROYECTO 8: PIEDRA, PAPEL O TIJERA ==========
let puntosUsuario = 0;
let puntosComputadora = 0;

const puntosUsuarioSpan = document.getElementById('puntosUsuario');
const puntosComputadoraSpan = document.getElementById('puntosComputadora');
const eleccionUsuarioDiv = document.getElementById('eleccionUsuario');
const eleccionComputadoraDiv = document.getElementById('eleccionComputadora');
const resultadoRondaDiv = document.getElementById('resultadoRonda');
const piedraBtn = document.getElementById('piedraBtn');
const papelBtn = document.getElementById('papelBtn');
const tijeraBtn = document.getElementById('tijeraBtn');
const reiniciarMarcadorBtn = document.getElementById('reiniciarMarcadorBtn');

// Texto para cada eleccion
const textos = {
    piedra: 'Piedra',
    papel: 'Papel',
    tijera: 'Tijera'
};

// Cargar marcador guardado
function cargarMarcador() {
    const usuarioGuardado = localStorage.getItem('pptPuntosUsuario');
    const computadoraGuardado = localStorage.getItem('pptPuntosComputadora');
    
    if (usuarioGuardado !== null) {
        puntosUsuario = parseInt(usuarioGuardado);
    }
    if (computadoraGuardado !== null) {
        puntosComputadora = parseInt(computadoraGuardado);
    }
    
    actualizarMarcador();
}

// Guardar marcador
function guardarMarcador() {
    localStorage.setItem('pptPuntosUsuario', puntosUsuario);
    localStorage.setItem('pptPuntosComputadora', puntosComputadora);
}

// Actualizar visual del marcador
function actualizarMarcador() {
    if (puntosUsuarioSpan) puntosUsuarioSpan.textContent = puntosUsuario;
    if (puntosComputadoraSpan) puntosComputadoraSpan.textContent = puntosComputadora;
    guardarMarcador();
}

// Eleccion aleatoria de la computadora
function eleccionComputadora() {
    const opciones = ['piedra', 'papel', 'tijera'];
    const indice = Math.floor(Math.random() * 3);
    return opciones[indice];
}

// Determinar ganador
function determinarGanador(usuario, computadora) {
    if (usuario === computadora) {
        return 'empate';
    }
    
    if (
        (usuario === 'piedra' && computadora === 'tijera') ||
        (usuario === 'papel' && computadora === 'piedra') ||
        (usuario === 'tijera' && computadora === 'papel')
    ) {
        return 'usuario';
    }
    
    return 'computadora';
}

// Mostrar resultado y actualizar puntos
function mostrarResultado(usuario, computadora, ganador) {
    // Mostrar textos
    if (eleccionUsuarioDiv) eleccionUsuarioDiv.textContent = textos[usuario];
    if (eleccionComputadoraDiv) eleccionComputadoraDiv.textContent = textos[computadora];
    
    // Mostrar resultado y actualizar puntos
    if (ganador === 'empate') {
        resultadoRondaDiv.innerHTML = 'Empate!';
        resultadoRondaDiv.style.background = 'rgba(255, 215, 0, 0.3)';
    } else if (ganador === 'usuario') {
        puntosUsuario++;
        actualizarMarcador();
        resultadoRondaDiv.innerHTML = 'Ganaste! ' + textos[usuario] + ' vence a ' + textos[computadora];
        resultadoRondaDiv.style.background = 'rgba(76, 175, 80, 0.3)';
    } else {
        puntosComputadora++;
        actualizarMarcador();
        resultadoRondaDiv.innerHTML = 'Perdiste... ' + textos[computadora] + ' vence a ' + textos[usuario];
        resultadoRondaDiv.style.background = 'rgba(244, 67, 54, 0.3)';
    }
}

// Jugar ronda
function jugar(eleccionUsuario) {
    const eleccionPC = eleccionComputadora();
    const ganador = determinarGanador(eleccionUsuario, eleccionPC);
    mostrarResultado(eleccionUsuario, eleccionPC, ganador);
}

// Reiniciar marcador
function reiniciarMarcador() {
    puntosUsuario = 0;
    puntosComputadora = 0;
    actualizarMarcador();
    resultadoRondaDiv.innerHTML = 'Marcador reiniciado! Elige una opcion para jugar.';
    resultadoRondaDiv.style.background = 'rgba(0, 0, 0, 0.5)';
    if (eleccionUsuarioDiv) eleccionUsuarioDiv.textContent = '?';
    if (eleccionComputadoraDiv) eleccionComputadoraDiv.textContent = '?';
}

// Event listeners
if (piedraBtn) {
    piedraBtn.addEventListener('click', () => jugar('piedra'));
}
if (papelBtn) {
    papelBtn.addEventListener('click', () => jugar('papel'));
}
if (tijeraBtn) {
    tijeraBtn.addEventListener('click', () => jugar('tijera'));
}
if (reiniciarMarcadorBtn) {
    reiniciarMarcadorBtn.addEventListener('click', reiniciarMarcador);
}

// Cargar marcador guardado al iniciar
cargarMarcador();

// ========== PROYECTO 9: MODO OSCURO / CLARO ==========
// Función para aplicar el tema
function aplicarTema(tema) {
    if (tema === 'dark') {
        document.body.classList.add('dark-mode');
        if (toggleLabel) toggleLabel.textContent = 'Modo Oscuro';
        if (darkModeToggle) darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if (toggleLabel) toggleLabel.textContent = 'Modo Claro';
        if (darkModeToggle) darkModeToggle.checked = false;
    }
}

// Función para cambiar el tema
function cambiarTema() {
    if (document.body.classList.contains('dark-mode')) {
        aplicarTema('light');
        localStorage.setItem('tema', 'light');
    } else {
        aplicarTema('dark');
        localStorage.setItem('tema', 'dark');
    }
}

// Obtener elementos del DOM
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleLabel = document.getElementById('toggleLabel');

// Cargar tema guardado al iniciar
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'dark') {
    aplicarTema('dark');
} else {
    aplicarTema('light');
}

// Agregar event listener al toggle
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', cambiarTema);
}

// ========== PROYECTO 10: GALERÍA DE IMÁGENES CON FILTROS ==========
// Creo un array con las 9 imágenes que voy a mostrar
// Cada imagen tiene un id, título, categoría, url y descripción
const imagenes = [
    // 3 imágenes de animales
    { id: 1, titulo: "Perro feliz", categoria: "animales", url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop", descripcion: "Un perro muy contento" },
    { id: 2, titulo: "Gato curioso", categoria: "animales", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop", descripcion: "Gato mirando fijamente" },
    { id: 3, titulo: "Loro colorido", categoria: "animales", url: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop", descripcion: "Loro con colores vibrantes" },
    // 3 imágenes de tecnología
    { id: 4, titulo: "Laptop moderna", categoria: "tecnologia", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop", descripcion: "Computadora portátil" },
    { id: 5, titulo: "Smartphone", categoria: "tecnologia", url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", descripcion: "Teléfono inteligente" },
    { id: 6, titulo: "Auriculares", categoria: "tecnologia", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", descripcion: "Audífonos profesionales" },
    // 3 imágenes de naturaleza
    { id: 7, titulo: "Montaña nevada", categoria: "naturaleza", url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=300&fit=crop", descripcion: "Paisaje montañoso" },
    { id: 8, titulo: "Playa paradisíaca", categoria: "naturaleza", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", descripcion: "Mar cristalino" },
    { id: 9, titulo: "Bosque verde", categoria: "naturaleza", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", descripcion: "Naturaleza exuberante" }
];

// Variables para guardar el filtro activo y el texto de búsqueda
let filtroActivo = "todas";
let textoBusqueda = "";

// Obtengo todos los elementos del DOM que voy a necesitar
const galeriaGrid = document.getElementById("galeriaGrid");
const searchInput = document.getElementById("searchInput");
const filtroBtns = document.querySelectorAll(".filtro-btn");
const noResults = document.getElementById("noResults");
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.querySelector(".modal-close");

// Función para mostrar las imágenes en la cuadrícula
function mostrarImagenes() {
    if (!galeriaGrid) return;
    
    // Filtro las imágenes según la categoría seleccionada y la búsqueda
    let imagenesFiltradas = imagenes.filter(img => {
        // Primero filtro por categoría
        if (filtroActivo !== "todas" && img.categoria !== filtroActivo) {
            return false;
        }
        // Luego filtro por búsqueda (si hay texto)
        if (textoBusqueda && !img.titulo.toLowerCase().includes(textoBusqueda.toLowerCase())) {
            return false;
        }
        return true;
    });
    
    // Si no hay resultados, muestro el mensaje y oculto la cuadrícula
    if (imagenesFiltradas.length === 0) {
        galeriaGrid.style.display = "none";
        if (noResults) noResults.style.display = "block";
        return;
    }
    
    // Si hay resultados, muestro la cuadrícula y oculto el mensaje
    galeriaGrid.style.display = "grid";
    if (noResults) noResults.style.display = "none";
    
    // Limpio la cuadrícula antes de agregar nuevas imágenes
    galeriaGrid.innerHTML = "";
    
    // Recorro cada imagen filtrada y la agrego al DOM
    imagenesFiltradas.forEach(img => {
        // Creo un div para cada imagen
        const item = document.createElement("div");
        item.className = "galeria-item";
        
        // Convierto la categoría a texto legible
        let categoriaTexto = "";
        if (img.categoria === "animales") categoriaTexto = "Animales";
        else if (img.categoria === "tecnologia") categoriaTexto = "Tecnología";
        else categoriaTexto = "Naturaleza";
        
        // Agrego el HTML del item
        item.innerHTML = `
            <img src="${img.url}" alt="${img.titulo}" loading="lazy">
            <div class="galeria-item-info">
                <div class="galeria-item-titulo">${img.titulo}</div>
                <div class="galeria-item-categoria">${categoriaTexto}</div>
            </div>
        `;
        
        // Agrego evento para abrir el modal cuando se hace clic en la imagen
        item.addEventListener("click", () => {
            if (modal && modalImg && modalCaption) {
                modalImg.src = img.url;
                modalCaption.textContent = `${img.titulo} - ${categoriaTexto}`;
                modal.style.display = "block";
                // Evito que se pueda hacer scroll mientras el modal está abierto
                document.body.style.overflow = "hidden";
            }
        });
        
        // Agrego el item a la cuadrícula
        galeriaGrid.appendChild(item);
    });
}

// Función para cerrar el modal
function cerrarModal() {
    if (modal) {
        modal.style.display = "none";
        // Vuelvo a permitir el scroll
        document.body.style.overflow = "";
    }
}

// Configuro los botones de filtro
filtroBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Quito la clase active de todos los botones
        filtroBtns.forEach(b => b.classList.remove("active"));
        // Agrego la clase active al botón que se clickeó
        btn.classList.add("active");
        
        // Actualizo el filtro activo
        filtroActivo = btn.getAttribute("data-filtro");
        
        // Vuelvo a mostrar las imágenes con el nuevo filtro
        mostrarImagenes();
    });
});

// Configuro el buscador
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        textoBusqueda = e.target.value;
        mostrarImagenes();
    });
}

// Configuro el botón de cerrar del modal
if (modalClose) {
    modalClose.addEventListener("click", cerrarModal);
}

// Configuro que al hacer clic fuera de la imagen también se cierre el modal
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrarModal();
    });
}

// Configuro que la tecla ESC también cierre el modal
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.style.display === "block") {
        cerrarModal();
    }
});

// Hago que la galería se cargue cuando se abre con el botón "Ver +"
// Busco todos los botones "Ver +"
const botonGaleria = document.querySelectorAll(".btn");
for (let i = 0; i < botonGaleria.length; i++) {
    const btn = botonGaleria[i];
    btn.addEventListener("click", function() {
        // Verifico si este botón pertenece a la galería
        const descripcion = this.nextElementSibling;
        if (descripcion && descripcion.textContent === "Galería de Imágenes") {
            const contenido = this.nextElementSibling.nextElementSibling;
            // Si el contenido está visible y la galería está vacía, cargo las imágenes
            if (contenido && contenido.classList.contains("ver")) {
                if (galeriaGrid && galeriaGrid.children.length === 0) {
                    mostrarImagenes();
                }
            }
        }
    });
}

// Por si acaso la galería ya está visible al cargar la página
if (galeriaGrid && galeriaGrid.children.length === 0) {
    const contenidoGaleria = document.querySelector(".contenido-galeria");
    if (contenidoGaleria && contenidoGaleria.classList.contains("ver")) {
        mostrarImagenes();
    }
}