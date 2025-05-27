// ===================================
// CONFIGURACIÓN Y DATOS INICIALES
// ===================================

const elementos = [
  { nombre: "Hidrógeno", simbolo: "H", descripcion: "Hidrógeno: el elemento más ligero" },
  { nombre: "Helio", simbolo: "He", descripcion: "Helio: gas noble y muy ligero" },
  { nombre: "Litio", simbolo: "Li", descripcion: "Litio: usado en baterías" },
  { nombre: "Berilio", simbolo: "Be", descripcion: "Berilio: metal alcalinotérreo" },
  { nombre: "Boro", simbolo: "B", descripcion: "Boro: metaloide con usos industriales" },
  { nombre: "Carbono", simbolo: "C", descripcion: "Carbono: base de la vida" },
  { nombre: "Nitrógeno", simbolo: "N", descripcion: "Nitrógeno: mayor componente del aire" },
  { nombre: "Oxígeno", simbolo: "O", descripcion: "Oxígeno: esencial para la respiración" },
  { nombre: "Flúor", simbolo: "F", descripcion: "Flúor: muy reactivo, usado en pastas dentales" }
];

// Tablero solución base (matriz 9x9 de índices 0-8 que corresponden a los elementos)
const baseSolucion = [
  [0,1,2, 3,4,5, 6,7,8],
  [3,4,5, 6,7,8, 0,1,2],
  [6,7,8, 0,1,2, 3,4,5],
  [1,2,0, 4,5,3, 7,8,6],
  [4,5,3, 7,8,6, 1,2,0],
  [7,8,6, 1,2,0, 4,5,3],
  [2,0,1, 5,3,4, 8,6,7],
  [5,3,4, 8,6,7, 2,0,1],
  [8,6,7, 2,0,1, 5,3,4]
];

// Medios multimedia para mostrar cuando hay errores
const medios = [
  { tipo: 'imagen', src: 'img.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img1.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img2.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img3.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img4.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img5.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img6.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img7.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img8.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img9.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img10.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img11.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img12.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img13.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img14.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img15.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img16.jpeg', duracion: 3000 },
  { tipo: 'imagen', src: 'img17.jpeg', duracion: 3000 },
  { tipo: 'video', src: 'vid.mp4', duracion: 19000 },
  { tipo: 'video', src: 'vid1.mp4', duracion: 3000 },
  { tipo: 'video', src: 'vid2.mp4', duracion: 45000 },
  { tipo: 'video', src: 'vid3.mp4', duracion: 15000 },
  { tipo: 'video', src: 'vid4.mp4', duracion: 10000 },
  { tipo: 'video', src: 'vid5.mp4', duracion: 13000 },
  { tipo: 'video', src: 'vid6.mp4', duracion: 53000 },
  { tipo: 'video', src: 'vid7.mp4', duracion: 15000 },
  { tipo: 'video', src: 'vid8.mp4', duracion: 43000 }
];

// ===================================
// VARIABLES GLOBALES DEL JUEGO
// ===================================

let board = document.getElementById("sudoku-board");
let solucion = [];
let timerInterval;
let tiempo = 0;
let playerYT;
let videoReady = false;

// ===================================
// FUNCIONES UTILITARIAS
// ===================================

/**
 * Obtiene el texto del elemento según el modo actual (símbolo o nombre)
 * @param {number} index - Índice del elemento en el array
 * @returns {string} - Texto del elemento
 */
function obtenerTextoElemento(index) {
  const modo = document.getElementById("displayMode").value;
  if (modo === "nombre") return elementos[index].nombre;
  return elementos[index].simbolo;
}

/**
 * Crea una copia profunda de una matriz
 * @param {Array} m - Matriz a copiar
 * @returns {Array} - Copia de la matriz
 */
function copiarMatriz(m) {
  return m.map(fila => fila.slice());
}

/**
 * Convierte el valor del input a índice de elemento
 * @param {string} valor - Valor introducido por el usuario
 * @returns {number|null} - Índice del elemento o null si no se encuentra
 */
function valorInputAIndice(valor) {
  const modo = document.getElementById("displayMode").value;
  valor = valor.trim();
  
  if (modo === "nombre") {
    for(let i = 0; i < elementos.length; i++) {
      if (elementos[i].nombre.toLowerCase() === valor.toLowerCase()) return i;
    }
  } else {
    for(let i = 0; i < elementos.length; i++) {
      if (elementos[i].simbolo.toLowerCase() === valor.toLowerCase()) return i;
    }
  }
  return null;
}

// ===================================
// GENERACIÓN DEL SUDOKU
// ===================================

/**
 * Mezcla la solución base para crear diferentes tableros
 * @param {Array} sol - Solución base
 * @returns {Array} - Solución mezclada
 */
function mezclarSolucion(sol) {
  let mezcla = copiarMatriz(sol);

  // Intercambia filas dentro de subcuadros 3x3
  function permutarFilaBloque(bloque) {
    const base = bloque * 3;
    const filas = [0,1,2].sort(() => Math.random() - 0.5);
    let temp = [];
    for(let i = 0; i < 3; i++) temp[i] = mezcla[base + filas[i]];
    for(let i = 0; i < 3; i++) mezcla[base + i] = temp[i];
  }

  // Intercambia columnas dentro de subcuadros 3x3
  function permutarColumnaBloque(bloque) {
    const base = bloque * 3;
    const cols = [0,1,2].sort(() => Math.random() - 0.5);
    for(let fila = 0; fila < 9; fila++) {
      let temp = [];
      for(let i = 0; i < 3; i++) temp[i] = mezcla[fila][base + cols[i]];
      for(let i = 0; i < 3; i++) mezcla[fila][base + i] = temp[i];
    }
  }

  // Aplica permutaciones aleatorias a cada bloque
  for(let i = 0; i < 3; i++) {
    permutarFilaBloque(i);
    permutarColumnaBloque(i);
  }

  return mezcla;
}

/**
 * Crea el puzzle quitando celdas de la solución
 * @param {Array} sol - Solución completa
 * @param {number} vacias - Número de celdas a vaciar
 * @returns {Array} - Puzzle con celdas vacías
 */
function crearPuzzle(sol, vacias) {
  let puzzle = copiarMatriz(sol);
  let celdasVacias = 0;
  
  while (celdasVacias < vacias) {
    let f = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    if (puzzle[f][c] !== null) {
      puzzle[f][c] = null;
      celdasVacias++;
    }
  }
  return puzzle;
}

// ===================================
// CREACIÓN Y MANEJO DEL TABLERO
// ===================================

/**
 * Crea el tablero de juego con la dificultad especificada
 * @param {number} vacias - Número de celdas vacías
 */
function crearTablero(vacias) {
  board.innerHTML = "";
  tiempo = 0;
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = "Tiempo: 0s";

  solucion = mezclarSolucion(baseSolucion);
  const puzzle = crearPuzzle(solucion, vacias);

  for(let fila = 0; fila < 9; fila++) {
    for(let col = 0; col < 9; col++) {
      const celda = document.createElement("div");
      celda.classList.add("cell");
      
      // Añade bordes para separar bloques 3x3
      if (fila % 3 === 0) celda.classList.add("top-border");
      if (col % 3 === 0) celda.classList.add("left-border");

      if (puzzle[fila][col] !== null) {
        // Celda con valor fijo (pista)
        const span = document.createElement("input");
        span.type = "text";
        span.disabled = true;
        span.value = obtenerTextoElemento(puzzle[fila][col]);
        celda.appendChild(span);
      } else {
        // Celda vacía para que el usuario complete
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 10;
        input.autocomplete = "off";
        input.spellcheck = false;
        
        // Maneja la entrada del usuario
        input.addEventListener("input", () => {
          input.value = input.value.trim();
          // Formatea según el modo (nombre o símbolo)
          if(document.getElementById("displayMode").value === "nombre"){
            input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1).toLowerCase();
          } else {
            input.value = input.value.toUpperCase();
          }
        });
        
        celda.appendChild(input);
      }
      board.appendChild(celda);
    }
  }
  
  mostrarLeyenda();
  iniciarTemporizador();
}

/**
 * Muestra la leyenda con elementos y sus símbolos
 */
function mostrarLeyenda() {
  const legend = document.getElementById("legend");
  legend.innerHTML = "";
  const modo = document.getElementById("displayMode").value;
  
  for(let i = 0; i < elementos.length; i++) {
    const div = document.createElement("div");
    div.classList.add("legend-item");
    
    if(modo === "nombre") {
      div.textContent = `${elementos[i].nombre} (${elementos[i].simbolo})`;
    } else {
      div.textContent = `${elementos[i].simbolo} - ${elementos[i].nombre}`;
    }
    
    legend.appendChild(div);
  }
}

// ===================================
// VALIDACIÓN Y VERIFICACIÓN
// ===================================

/**
 * Verifica si el sudoku está completo y correcto
 */
function verificarSudoku() {
  // Lógica de verificación aquí...
  const sudokuEstaBien = false; // Para testing - cambiar por lógica real

  if (!sudokuEstaBien) {
    document.getElementById("sound-wrong").play();
    mostrarMedioRandom();
  }
}

// ===================================
// MULTIMEDIA Y EFECTOS
// ===================================

/**
 * Muestra un medio aleatorio (imagen o video) cuando hay un error
 */
function mostrarMedioRandom() {
  const medio = medios[Math.floor(Math.random() * medios.length)];

  // Crea el overlay si no existe
  let overlay = document.getElementById("media-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "media-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    });
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = "";

  if (medio.tipo === "imagen") {
    const img = document.createElement("img");
    img.src = medio.src;
    img.style.maxWidth = "80vw";
    img.style.maxHeight = "80vh";
    overlay.appendChild(img);
  } else if (medio.tipo === "video") {
    const video = document.createElement("video");
    video.src = medio.src;
    video.style.maxWidth = "80vw";
    video.style.maxHeight = "80vh";
    video.autoplay = true;
    video.controls = false;
    video.playsInline = true;
    video.loop = true;

    video.addEventListener("canplay", () => {
      video.play().catch((err) => {
        console.error("Autoplay con sonido falló:", err);
      });
    });

    overlay.appendChild(video);
  }

  overlay.style.display = "flex";

  // Oculta el overlay después de la duración especificada
  setTimeout(() => {
    overlay.style.display = "none";
  }, medio.duracion);
}

/**
 * Muestra un mensaje superpuesto
 * @param {string} texto - Texto del mensaje
 * @param {boolean} esError - Si es un mensaje de error
 */
function mostrarMensaje(texto, esError) {
  const overlay = document.getElementById("message-overlay");
  overlay.textContent = texto;
  overlay.className = "show";
  if (esError) overlay.classList.add("error");
  
  setTimeout(() => {
    overlay.className = "";
  }, 3000);
}

/**
 * Reproduce sonido según si la acción es correcta o incorrecta
 * @param {boolean} esCorrecto - Si la acción es correcta
 */
function reproducirSonido(esCorrecto) {
  const audio = esCorrecto ? 
    document.getElementById("sound-correct") : 
    document.getElementById("sound-wrong");
  audio.currentTime = 0;
  audio.play();
}

// ===================================
// CONTROLES DE JUEGO
// ===================================

/**
 * Muestra la solución completa del sudoku
 */
function mostrarSolucion() {
  const inputs = board.querySelectorAll("input:not(:disabled)");
  inputs.forEach(input => {
    const celdaDiv = input.parentElement;
    const pos = Array.from(board.children).indexOf(celdaDiv);
    const fila = Math.floor(pos / 9);
    const col = pos % 9;
    
    input.value = obtenerTextoElemento(solucion[fila][col]);
    input.classList.remove("incorrect");
    input.classList.add("correct");
  });
  
  mostrarMensaje("Solución mostrada", false);
}

/**
 * Reinicia el juego generando un nuevo tablero
 */
function reiniciarJuego() {
  clearInterval(timerInterval);
  tiempo = 0;
  const vacias = parseInt(document.getElementById("difficulty").value);
  crearTablero(vacias);
}

// ===================================
// TEMPORIZADOR
// ===================================

/**
 * Inicia el temporizador del juego
 */
function iniciarTemporizador() {
  clearInterval(timerInterval);
  tiempo = 0;
  const timerDisplay = document.getElementById("timer");
  
  timerInterval = setInterval(() => {
    tiempo++;
    timerDisplay.textContent = `Tiempo: ${tiempo}s`;
  }, 1000);
}

// ===================================
// MODO OSCURO/CLARO
// ===================================

/**
 * Alterna entre modo oscuro y claro
 */
function alternarModo() {
  document.body.classList.toggle('modo-oscuro');
  const boton = document.getElementById('modoNocheBtn');
  boton.textContent = document.body.classList.contains('modo-oscuro') ? '☀️' : '🌙';
}

// ===================================
// INTEGRACIÓN CON YOUTUBE
// ===================================

// Carga la API de YouTube solo una vez
if (!window.YT) {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

/**
 * Función llamada cuando la API de YouTube está lista
 */
function onYouTubeIframeAPIReady() {
  playerYT = new YT.Player('youtube-player', {
    width: '100%',
    height: '100%',
    videoId: '',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      disablekb: 1,
      showinfo: 0,
    },
    events: {
      onStateChange: function (event) {
        if (event.data === YT.PlayerState.ENDED) {
          const videoContainer = document.getElementById('video-container');
          videoContainer.style.display = 'none';
          playerYT.stopVideo();
        }
      }
    }
  });

  videoReady = true;
}

/**
 * Muestra la solución a través de un video de YouTube
 */
function mostrarSolucionT() {
  const videoId = '1gUCu2e_JiM';
  const videoContainer = document.getElementById('video-container');

  if (playerYT && videoReady) {
    playerYT.loadVideoById(videoId);
    videoContainer.style.display = 'block';
  } else {
    // Espera hasta que el reproductor esté listo
    const interval = setInterval(() => {
      if (playerYT && videoReady) {
        playerYT.loadVideoById(videoId);
        videoContainer.style.display = 'block';
        clearInterval(interval);
      }
    }, 100);
  }
}

// ===================================
// INICIALIZACIÓN
// ===================================

// Inicializa el juego con dificultad media
reiniciarJuego();