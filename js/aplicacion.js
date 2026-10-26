// Acceso abreviado a los elementos por su identificador HTML.
const $ = (id) => document.getElementById(id);

// Estado: matriz, propiedad seleccionada, posiciones y vértice arrastrado.
let M = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  selected = 0,
  points = [],
  drag = null;
// Definiciones en el mismo orden que los resultados del analizador.
const definitions = [
  "Para todo x en A debe existir (x,x): todos los lazos son obligatorios.",
  "Para todo par (x,y) presente debe existir también (y,x).",
  "Para todo par (x,y) presente debe faltar (y,x). No permite lazos.",
  "Siempre que existan (x,y) y (y,z), debe existir (x,z).",
];
/** Distribuye inicialmente los vértices alrededor de una elipse. */
function ubicarVertices() {
  let n = M.length;
  points = Array.from({ length: n }, (_, i) => ({
    x: 320 + 135 * Math.cos((2 * Math.PI * i) / n - Math.PI / 2),
    y: 185 + 115 * Math.sin((2 * Math.PI * i) / n - Math.PI / 2),
  }));
}
/** Carga otra matriz, sincroniza el tamaño y reconstruye las vistas. */
function cargarMatriz(m) {
  M = m;
  points = [];
  $("size").value = m.length;
  actualizarInterfaz();
}
/** Actualiza matriz, pares, propiedades, clasificación y grafo tras cada cambio. */
function actualizarInterfaz() {
  let n = M.length,
    a = analizarRelacion(M);
  $("base").textContent =
    "A = {" +
    Array.from({ length: n }, (_, i) => etiquetaElemento(i)).join(", ") +
    "}";
  $("matrix").innerHTML =
    "<table><thead><tr><th></th>" +
    M.map((_, i) => '<th scope="col">' + etiquetaElemento(i) + "</th>").join(
      "",
    ) +
    "</tr></thead><tbody>" +
    M.map(
      (r, i) =>
        '<tr><th scope="row">' +
        etiquetaElemento(i) +
        "</th>" +
        r
          .map(
            (v, j) =>
              `<td>
                <button
                  class="${v ? "one" : ""}"
                  data-i="${i}"
                  data-j="${j}"
                  aria-label="Relación de ${etiquetaElemento(i)} a ${etiquetaElemento(j)}: ${v}"
                  aria-pressed="${!!v}"
                >${v}</button>
              </td>`,
          )
          .join("") +
        "</tr>",
    ).join("") +
    "</tbody></table>";
  $("pairs").textContent =
    "R={" + a.pairs.map((p) => "(" + p.join(",") + ")").join(", ") + "}";
  $("nodes").textContent = n;
  $("edges").textContent = a.pairs.length;
  $("loops").textContent = M.filter((r, i) => r[i]).length;
  $("cards").innerHTML = ["Reflexiva", "Simétrica", "Asimétrica", "Transitiva"]
    .map(
      (name, i) =>
        `<button
          class="property ${selected === i ? "selected" : ""}"
          data-property="${i}"
          aria-pressed="${selected === i}"
        >
          <span class="badge ${a.ok[i] ? "" : "no"}">
            ${a.ok[i] ? "✓ Sí cumple" : "× No cumple"}
          </span>
          <strong>${name}</strong>
          <small>${definitions[i]}</small>
        </button>`,
    )
    .join("");
  // Se muestra el primer fallo de la propiedad seleccionada, si existe.
  let t = a.f[selected],
    desc;
  if (!t)
    desc = [
      "Todos los elementos tienen un lazo: la diagonal completa es 1.",
      "Cada par presente tiene su inverso.",
      "No hay lazos ni pares de flechas en sentidos opuestos.",
      "Todas las cadenas de dos enlaces tienen el enlace directo correspondiente.",
    ][selected];
  else {
    let [i, j, k] = t.map(etiquetaElemento);
    desc = [
      `Falta (${i},${i}): el elemento ${i} no tiene un lazo.`,
      `Existe (${i},${j}), pero falta (${j},${i}).`,
      `Existe (${i},${j}) y también (${j},${i}). ${i === j ? "Un lazo basta para incumplir asimetría." : "Las flechas recíprocas incumplen asimetría."}`,
      `Existen (${i},${j}) y (${j},${k}), pero falta (${i},${k}).`,
    ][selected];
  }
  $("explanation").textContent =
    (t ? "Contraejemplo: " : "Comprobación: ") +
    desc +
    (t && selected !== 0
      ? " Las aristas presentes involucradas se resaltan en naranja."
      : "");
  $("types").innerHTML = a.types.length
    ? a.types.map((x) => '<span class="tag">' + x + "</span>").join("")
    : '<span class="tag">Sin clasificación entre los tipos evaluados</span>';
  $("interpretation").textContent =
    `Antisimétrica: ${a.anti ? "sí" : "no"}. Esta comprobación auxiliar permite identificar órdenes parciales; permite lazos, mientras que la asimetría los prohíbe. Las clasificaciones pueden coexistir.` +
    (a.pairs.length === 0
      ? " La relación vacía es simétrica, asimétrica y transitiva por vacuidad: no hay pares que contradigan esas condiciones."
      : "") +
    (!a.types.length
      ? " No satisface los criterios de equivalencia, preorden ni de los órdenes evaluados."
      : "");
  dibujarGrafo();
}
/** Dibuja en SVG los lazos, flechas y vértices. Curva las aristas recíprocas. */
function dibujarGrafo() {
  if (!points.length) ubicarVertices();
  let a = analizarRelacion(M),
    t = a.f[selected],
    hi = [];
  if (t) {
    let [i, j, k] = t;
    if (selected === 3)
      hi = [
        [i, j],
        [j, k],
      ];
    else
      hi = [
        [i, j],
        [j, i],
      ];
  }
  // Los marcadores SVG son las puntas de flecha normal y resaltada.
  let html = `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#7d9488"/>
      </marker>
      <marker id="orange" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="7" markerHeight="7" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#cf752c"/>
      </marker>
    </defs>
  `;
  M.forEach((r, i) =>
    r.forEach((v, j) => {
      if (!v) return;
      let p = points[i],
        q = points[j],
        d;
      // Un lazo se dibuja como una curva cúbica por encima del vértice.
      if (i === j)
        d = `M ${p.x - 15} ${p.y - 15} C ${p.x - 65} ${p.y - 85},${p.x + 65} ${p.y - 85},${p.x + 15} ${p.y - 15}`;
      else {
        // El vector unitario permite recortar la flecha fuera de los círculos.
        let dx = q.x - p.x,
          dy = q.y - p.y,
          L = Math.hypot(dx, dy) || 1,
          ux = dx / L,
          uy = dy / L,
          sx = p.x + 24 * ux,
          sy = p.y + 24 * uy,
          ex = q.x - 28 * ux,
          ey = q.y - 28 * uy;
        // Se separan las flechas recíprocas con una curva cuadrática.
        d = M[j][i]
          ? `M ${sx} ${sy} Q ${(p.x + q.x) / 2 - 35 * uy} ${(p.y + q.y) / 2 + 35 * ux} ${ex} ${ey}`
          : `M ${sx} ${sy} L ${ex} ${ey}`;
      }
      let h = hi.some((e) => e[0] === i && e[1] === j);
      html += `
        <path d="${d}" class="edge ${h ? "highlight" : ""}"
          marker-end="url(#${h ? "orange" : "arrow"})">
          <title>${etiquetaElemento(i)} → ${etiquetaElemento(j)}</title>
        </path>`;
    }),
  );
  points.forEach(
    (p, i) =>
      (html += `
        <g data-node="${i}">
          <circle class="node" cx="${p.x}" cy="${p.y}" r="23"/>
          <text x="${p.x}" y="${p.y + 6}" text-anchor="middle">${etiquetaElemento(i)}</text>
        </g>`),
  );
  $("graph").innerHTML = html;
}
// Inicializa los tamaños permitidos y los eventos de captura de la matriz.
$("size").innerHTML = Array.from(
  { length: 10 },
  (_, i) => `<option>${i + 1}</option>`,
).join("");
$("size").value = 3;
$("size").onchange = () => {
  let n = +$("size").value;
  cargarMatriz(Array.from({ length: n }, () => Array(n).fill(0)));
  $("example").value = "";
};
$("matrix").onclick = (e) => {
  let b = e.target.closest("button");
  if (b) {
    let i = +b.dataset.i,
      j = +b.dataset.j;
    M[i][j] = 1 - M[i][j];
    $("example").value = "";
    actualizarInterfaz();
    $("matrix").querySelector(`[data-i="${i}"][data-j="${j}"]`).focus();
  }
};
$("cards").onclick = (e) => {
  let b = e.target.closest("[data-property]");
  if (b) {
    selected = +b.dataset.property;
    actualizarInterfaz();
    $("cards").children[selected].focus();
  }
};
$("random").onclick = () => {
  let n = M.length;
  cargarMatriz(
    Array.from({ length: n }, () =>
      Array.from({ length: n }, () => (Math.random() < 0.5 ? 0 : 1)),
    ),
  );
  $("example").value = "";
};
$("clear").onclick = () => {
  cargarMatriz(M.map((r) => r.map(() => 0)));
  $("example").value = "";
};
$("example").onchange = () => {
  // El ejemplo de cadena utiliza tres elementos; los demás respetan el tamaño.
  let v = $("example").value,
    n = M.length;
  if (v === "chain")
    cargarMatriz([
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ]);
  else if (v === "mixed")
    // Hay un par recíproco (a,b)/(b,a), pero (b,c) no tiene inverso.
    cargarMatriz([
      [0, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
    ]);
  else if (v)
    cargarMatriz(
      Array.from({ length: n }, (_, i) =>
        Array.from(
          { length: n },
          (_, j) =>
            +(v === "identity"
              ? i === j
              : v === "order"
                ? i <= j
                : v === "strict"
                  ? i < j
                  : v === "full"),
        ),
      ),
    );
};
// Convierte coordenadas del puntero al sistema del SVG para arrastrar vértices.
$("graph").onpointerdown = (e) => {
  let g = e.target.closest("[data-node]");
  if (g) {
    drag = +g.dataset.node;
    $("graph").setPointerCapture(e.pointerId);
    e.preventDefault();
  }
};
$("graph").onpointermove = (e) => {
  if (drag === null) return;
  let p = $("graph").createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  p = p.matrixTransform($("graph").getScreenCTM().inverse());
  points[drag] = {
    x: Math.max(40, Math.min(600, p.x)),
    y: Math.max(75, Math.min(320, p.y)),
  };
  dibujarGrafo();
};
$("graph").onpointerup = () => (drag = null);
$("graph").onpointercancel = () => (drag = null);
// La copia usa el portapapeles cuando el navegador concede acceso.
$("copy").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("pairs").textContent);
    $("toast").textContent = "Conjunto copiado.";
  } catch {
    $("toast").textContent = "Selecciona el texto de R y cópialo con Ctrl+C.";
  }
};

actualizarInterfaz();
