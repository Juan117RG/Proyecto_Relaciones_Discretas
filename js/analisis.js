/**
 * Analiza una relación binaria sobre el conjunto A = {a, b, c, ...}.
 * No depende del navegador: también puede ejecutarse desde Node.js.
 * Los índices internos comienzan en 0; los pares usan etiquetas alfabéticas.
 *
 * @param {number[][]} matriz Matriz cuadrada con valores numéricos 0 y 1.
 * @returns {object} Pares, propiedades, contraejemplos y clasificaciones.
 */
function analizarRelacion(matriz) {
  validarMatriz(matriz);
  const tamano = matriz.length;
  const pares = [];

  // Orden fijo: reflexiva, simétrica, asimétrica y transitiva.
  // null significa que todavía no se encontró un contraejemplo.
  const fallos = [null, null, null, null];

  for (let origen = 0; origen < tamano; origen++) {
    // Reflexividad: todos los valores de la diagonal deben ser 1.
    if (matriz[origen][origen] === 0 && fallos[0] === null) {
      fallos[0] = [origen, origen];
    }

    for (let destino = 0; destino < tamano; destino++) {
      if (matriz[origen][destino] === 1) {
        pares.push([etiquetaElemento(origen), etiquetaElemento(destino)]);
      }

      // Simetría: si existe (a,b), también debe existir (b,a).
      if (
        matriz[origen][destino] === 1 &&
        matriz[destino][origen] === 0 &&
        fallos[1] === null
      ) {
        fallos[1] = [origen, destino];
      }

      // Asimetría: ningún par admite inverso; esto incluye los lazos.
      if (
        matriz[origen][destino] === 1 &&
        matriz[destino][origen] === 1 &&
        fallos[2] === null
      ) {
        fallos[2] = [origen, destino];
      }

      // Transitividad: cada cadena a -> b -> c exige el enlace a -> c.
      for (let final = 0; final < tamano; final++) {
        if (
          matriz[origen][destino] === 1 &&
          matriz[destino][final] === 1 &&
          matriz[origen][final] === 0 &&
          fallos[3] === null
        ) {
          fallos[3] = [origen, destino, final];
        }
      }
    }
  }

  const propiedades = fallos.map((fallo) => fallo === null);

  // La antisimetría permite lazos y prohíbe inversos entre elementos distintos.
  // Es auxiliar: no debe confundirse con la asimetría solicitada.
  const antisimetrica = matriz.every((fila, origen) =>
    fila.every(
      (valor, destino) =>
        origen === destino || valor === 0 || matriz[destino][origen] === 0,
    ),
  );

  // Comparabilidad: cada pareja de elementos distintos tiene algún enlace.
  const comparable = matriz.every((fila, origen) =>
    fila.every(
      (valor, destino) =>
        origen === destino || valor === 1 || matriz[destino][origen] === 1,
    ),
  );

  const [reflexiva, simetrica, asimetrica, transitiva] = propiedades;
  const tipos = [];
  if (reflexiva && simetrica && transitiva) {
    tipos.push("Equivalencia");
  }
  if (reflexiva && antisimetrica && transitiva) {
    tipos.push(comparable ? "Orden total (y parcial)" : "Orden parcial");
  }
  if (reflexiva && transitiva) {
    tipos.push("Preorden");
  }
  if (asimetrica && transitiva) {
    tipos.push(comparable ? "Orden estricto total" : "Orden estricto parcial");
  }

  // Estas claves mantienen el contrato utilizado por la interfaz:
  // f: fallos; ok: propiedades; anti: antisimetría; types: tipos; pairs: pares.
  return {
    f: fallos,
    ok: propiedades,
    anti: antisimetrica,
    types: tipos,
    pairs: pares,
  };
}

/** Convierte un índice en a, b, ..., z, aa, ab, ... sin modificar la matriz binaria. */
function etiquetaElemento(indice) {
  let numero = indice + 1;
  let etiqueta = "";
  while (numero > 0) {
    numero--;
    etiqueta = String.fromCharCode(97 + (numero % 26)) + etiqueta;
    numero = Math.floor(numero / 26);
  }
  return etiqueta;
}

/** Rechaza matrices vacías, no cuadradas o con valores distintos de 0 y 1. */
function validarMatriz(matriz) {
  if (!Array.isArray(matriz) || matriz.length === 0) {
    throw new Error("La matriz debe ser un arreglo cuadrado no vacío.");
  }
  if (
    matriz.some((fila) => !Array.isArray(fila) || fila.length !== matriz.length)
  ) {
    throw new Error(
      "Todas las filas deben tener el mismo tamaño que la matriz.",
    );
  }
  if (matriz.some((fila) => fila.some((valor) => valor !== 0 && valor !== 1))) {
    throw new Error("Los elementos deben ser los números 0 o 1.");
  }
}

// Exportación opcional para las pruebas de consola; no altera el uso en HTML.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { analizarRelacion, validarMatriz, etiquetaElemento };
}
