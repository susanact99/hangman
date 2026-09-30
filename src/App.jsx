import React,{ useState } from "react";


const palabras = [
  "casa",
  "perro",
  "gato",
  "ordenador",
  "programacion",
  "javascript",
  "react",
  "java",
  "teclado",
  "pantalla",
  "servidor"
];

const NUMERO_INTENTOS = 5;

function elegirPalabra() {
  const posicion = Math.floor(Math.random() * palabras.length);
  return palabras[posicion];
}

function App() {
  const [palabra, setPalabra] = useState(elegirPalabra);
  const [letras, setLetras] = useState([]);
  const [letrasIncorrectas, setLetrasIncorrectas] = useState([]);
  const [letra, setLetra] = useState("");
  const [intentos, setIntentos] = useState(NUMERO_INTENTOS);
  const [mensaje, setMensaje] = useState("");

 
  const palabraCompletada = palabra
    .split("")
    .every((caracter) => letras.includes(caracter));

  const juegoTerminado = palabraCompletada || intentos === 0;

  function comprobarLetra() {
    const nuevaLetra = letra.toLowerCase().trim();

    // No hacemos nada si no se ha escrito una letra.
    if (nuevaLetra === "") {
      return;
    }

    // Solo aceptamos una letra.
    if (nuevaLetra.length !== 1 || !/[a-záéíóúüñ]/i.test(nuevaLetra)) {
      setMensaje("Introduce una sola letra.");
      setLetra("");
      return;
    }

    
    if (letras.includes(nuevaLetra) || letrasIncorrectas.includes(nuevaLetra)) {
      setMensaje("Ya has probado esa letra.");
      setLetra("");
      return;
    }

    if (palabra.includes(nuevaLetra)) {
      setLetras([...letras, nuevaLetra]);
      setMensaje("¡Letra correcta!");
    } else {
      setLetrasIncorrectas([...letrasIncorrectas, nuevaLetra]);
      setIntentos(intentos - 1);
      setMensaje(`La letra "${nuevaLetra}" es incorrecta.`);
    }

    setLetra("");
  }

  function manejarTecla(event) {
    if (event.key === "Enter" && !juegoTerminado) {
      comprobarLetra();
    }
  }

  function nuevoJuego() {
    let nuevaPalabra = elegirPalabra();

    while (palabras.length > 1 && nuevaPalabra === palabra) {
      nuevaPalabra = elegirPalabra();
    }

    setPalabra(nuevaPalabra);
    setLetras([]);
    setLetrasIncorrectas([]);
    setLetra("");
    setIntentos(NUMERO_INTENTOS);
    setMensaje("");
  }

  return (
    <main className="contenedor">
      <section className="juego">
        <h1>Adivina la palabra</h1>

        <p className="subtitulo">
          Descubre la palabra antes de quedarte sin corazones.
        </p>

        <div className="palabra">
          {palabra.split("").map((caracter, indice) => (
            <span key={indice} className="caracter">
              {letras.includes(caracter) ? caracter.toUpperCase() : "_"}
            </span>
          ))}
        </div>

        <div className="panel">
          <div className="dato">
            <span>Intentos</span>
            <div className="corazones">
              {Array.from({ length: NUMERO_INTENTOS }).map((_, indice) => (
                <span
                  key={indice}
                  className={indice < intentos ? "corazon activo" : "corazon perdido"}
                >
                  {indice < intentos ? "♥" : "♡"}
                </span>
              ))}
            </div>
          </div>

          <div className="dato">
            <span>Letras incorrectas</span>
            <strong>
              {letrasIncorrectas.length > 0
                ? letrasIncorrectas.join(" - ").toUpperCase()
                : "Ninguna"}
            </strong>
          </div>
        </div>

        {!juegoTerminado && (
          <div className="entrada">
            <label htmlFor="letra">Dime una letra:</label>

            <div className="formulario">
              <input
                id="letra"
                type="text"
                maxLength="1"
                value={letra}
                onChange={(event) => setLetra(event.target.value)}
                onKeyDown={manejarTecla}
                autoFocus
              />

              <button onClick={comprobarLetra}>Comprobar</button>
            </div>
          </div>
        )}

        {mensaje && !juegoTerminado && (
          <p className="mensaje">{mensaje}</p>
        )}

        {palabraCompletada && (
          <div className="resultado ganado">
            <h2>¡Palabra correcta!</h2>
            <p>Has acertado: <strong>{palabra.toUpperCase()}</strong></p>
            <button onClick={nuevoJuego}>Nuevo juego</button>
          </div>
        )}

        {intentos === 0 && !palabraCompletada && (
          <div className="resultado perdido">
            <h2>Te has quedado sin intentos</h2>
            <p>La palabra era: <strong>{palabra.toUpperCase()}</strong></p>
            <button onClick={nuevoJuego}>Intentar de nuevo</button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;