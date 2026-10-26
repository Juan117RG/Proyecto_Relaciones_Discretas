/** Pruebas independientes de la interfaz. Ejecutar: node pruebas/analisis.test.js */
const assert = require("node:assert/strict");
const { analizarRelacion, etiquetaElemento } = require("../js/analisis.js");

// Casos con resultados conocidos: las propiedades se ordenan como en la pantalla.
const casos = [
  {
    nombre: "Vacía sobre un elemento",
    matriz: [[0]],
    esperado: [false, true, true, true],
  },
  {
    nombre: "Identidad unitaria",
    matriz: [[1]],
    esperado: [true, true, false, true],
  },
  {
    nombre: "Una flecha",
    matriz: [
      [0, 1],
      [0, 0],
    ],
    esperado: [false, false, true, true],
  },
  {
    nombre: "Ciclo de dos elementos",
    matriz: [
      [0, 1],
      [1, 0],
    ],
    esperado: [false, true, false, false],
  },
  {
    nombre: "Orden total",
    matriz: [
      [1, 1],
      [0, 1],
    ],
    esperado: [true, false, false, true],
  },
  {
    nombre: "Cadena sin cierre",
    matriz: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    esperado: [true, false, false, false],
  },
];
for (const caso of casos) {
  assert.deepEqual(
    analizarRelacion(caso.matriz).ok,
    caso.esperado,
    caso.nombre,
  );
}

// Comprueba clasificación y pares, incluida la diferencia entre índices y etiquetas.
const identidad = analizarRelacion([
  [1, 0],
  [0, 1],
]);
assert.deepEqual(identidad.pairs, [
  ["a", "a"],
  ["b", "b"],
]);
assert.deepEqual(identidad.types, [
  "Equivalencia",
  "Orden parcial",
  "Preorden",
]);
assert.equal(identidad.anti, true);
assert.ok(
  analizarRelacion([
    [0, 1],
    [0, 0],
  ]).types.includes("Orden estricto total"),
);
assert.ok(
  analizarRelacion([
    [1, 1],
    [0, 1],
  ]).types.includes("Orden total (y parcial)"),
);
assert.deepEqual(analizarRelacion(casos[5].matriz).f[3], [0, 1, 2]);

// No ser simétrica no implica ser asimétrica: ambas pueden fallar.
const mezcla = analizarRelacion([
  [0, 1, 0],
  [1, 0, 1],
  [0, 0, 0],
]);
assert.equal(mezcla.ok[1], false);
assert.equal(mezcla.ok[2], false);
assert.deepEqual(mezcla.pairs, [
  ["a", "b"],
  ["b", "a"],
  ["b", "c"],
]);
assert.deepEqual([0, 1, 25, 26].map(etiquetaElemento), ["a", "b", "z", "aa"]);

// La transitividad también incluye cadenas de regreso al mismo elemento.
const cicloConUnLazo = analizarRelacion([
  [1, 1],
  [1, 0],
]);
assert.equal(cicloConUnLazo.ok[3], false);
assert.deepEqual(cicloConUnLazo.f[3], [1, 0, 1]);

// Una referencia declarativa permite contrastar todas las matrices de hasta 3 x 3.
function propiedadesDeReferencia(matriz) {
  const indices = matriz.map((_, indice) => indice);
  return [
    indices.every((a) => matriz[a][a] === 1),
    indices.every((a) =>
      indices.every((b) => !matriz[a][b] || matriz[b][a] === 1),
    ),
    indices.every((a) =>
      indices.every((b) => !matriz[a][b] || matriz[b][a] === 0),
    ),
    indices.every((a) =>
      indices.every((b) =>
        indices.every(
          (c) => !matriz[a][b] || !matriz[b][c] || matriz[a][c] === 1,
        ),
      ),
    ),
  ];
}
let cantidad = 0;
for (let tamano = 1; tamano <= 3; tamano++) {
  for (let mascara = 0; mascara < 2 ** (tamano * tamano); mascara++) {
    const matriz = Array.from({ length: tamano }, (_, fila) =>
      Array.from(
        { length: tamano },
        (_, columna) => (mascara >> (fila * tamano + columna)) & 1,
      ),
    );
    const resultado = analizarRelacion(matriz);
    assert.deepEqual(resultado.ok, propiedadesDeReferencia(matriz));
    // Cada contraejemplo debe demostrar realmente el incumplimiento indicado.
    resultado.f.forEach((fallo, propiedad) => {
      if (fallo === null) return;
      const [a, b, c] = fallo;
      const demuestraFallo = [
        () => matriz[a][a] === 0,
        () => matriz[a][b] === 1 && matriz[b][a] === 0,
        () => matriz[a][b] === 1 && matriz[b][a] === 1,
        () => matriz[a][b] === 1 && matriz[b][c] === 1 && matriz[a][c] === 0,
      ];
      assert.equal(demuestraFallo[propiedad](), true);
    });
    cantidad++;
  }
}

// Valida entradas incorrectas sin depender de los controles del navegador.
for (const matriz of [null, [], [[1, 0]], [[2]], [["1"]], [[1], null]]) {
  assert.throws(() => analizarRelacion(matriz));
}
console.log(
  `Correcto: ${casos.length} casos conocidos, ${cantidad} matrices exhaustivas y entradas inválidas.`,
);
