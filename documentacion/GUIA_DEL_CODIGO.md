# Guía del código

## Separación de responsabilidades

`index.html` contiene etiquetas, campos y botones. Carga primero `analisis.js` y
después `aplicacion.js`, porque la interfaz necesita la función `analizarRelacion`.
Se utilizan scripts clásicos para poder abrir el proyecto como archivo local.

`css/estilos.css` define colores, tamaños, distribución, tarjetas, estados de foco,
reglas para pantallas pequeñas y estilos de impresión.

`js/analisis.js` no accede al documento HTML. Recibe una matriz y devuelve datos.
Esto permite comprobar el algoritmo desde consola sin abrir el navegador.

`js/aplicacion.js` conecta la captura con el analizador y dibuja el grafo mediante
SVG, sin bibliotecas externas. Conserva las posiciones al editar celdas y vuelve a
distribuirlas al cargar una matriz nueva.

## Resultado de analizarRelacion(matriz)

| Clave   | Significado                                                                          |
| ------- | ------------------------------------------------------------------------------------ |
| `pairs` | Pares presentes, con etiquetas alfabéticas a, b, c, ....                             |
| `ok`    | Cuatro booleanos: reflexiva, simétrica, asimétrica, transitiva.                      |
| `f`     | Primer contraejemplo de cada propiedad; `null` si cumple. Sus índices empiezan en 0. |
| `anti`  | Indica si la relación es antisimétrica.                                              |
| `types` | Nombres de las clasificaciones que satisface.                                        |

Las claves breves mantienen la compatibilidad con la interfaz original. Los
comentarios en `analisis.js` explican cada condición matemática.

## Definiciones

- **Reflexiva:** para todo a, existe (a,a).
- **Simétrica:** si existe (a,b), existe (b,a).
- **Asimétrica:** si existe (a,b), no existe (b,a). Esto prohíbe los lazos.
- **Transitiva:** si existen (a,b) y (b,c), existe (a,c).
- **Antisimétrica:** si existen (a,b) y (b,a), necesariamente a=b.

La relación vacía sobre un conjunto no vacío es simétrica, asimétrica y transitiva
por vacuidad; no es reflexiva. No debe confundirse el conjunto base con la relación:
en esta aplicación A siempre contiene al menos un elemento.

## Clasificación

| Tipo                   | Condiciones                                                 |
| ---------------------- | ----------------------------------------------------------- |
| Equivalencia           | Reflexiva, simétrica y transitiva.                          |
| Preorden               | Reflexiva y transitiva.                                     |
| Orden parcial          | Reflexiva, antisimétrica y transitiva.                      |
| Orden total            | Orden parcial con comparabilidad entre elementos distintos. |
| Orden estricto parcial | Asimétrica y transitiva.                                    |
| Orden estricto total   | Orden estricto parcial con comparabilidad.                  |

Si ninguna coincide, la pantalla lo indica sin asignar una clasificación incorrecta.

## Flujo de interacción

1. Un evento cambia la matriz o la propiedad seleccionada.
2. `actualizarInterfaz()` invoca el analizador y reconstruye los resultados.
3. `dibujarGrafo()` dibuja una arista por cada 1 y un círculo por cada elemento.
4. Las aristas del contraejemplo seleccionado se resaltan en naranja.
5. Al arrastrar un vértice solo cambian sus coordenadas, no la relación.

En `aplicacion.js`, `M` es la matriz, `selected` el índice de propiedad,
`points` las posiciones y `drag` el vértice que se está arrastrando.
En los recorridos, i y j representan fila/origen y columna/destino; k es el tercer
elemento utilizado para comprobar transitividad.

## Coste y comprobaciones

El análisis recorre ternas de elementos y tarda O(m³). La matriz y los pares
ocupan O(m²) espacio. Solo se conserva el primer fallo de cada propiedad para
mostrar una explicación breve.

Las pruebas contrastan el resultado con una segunda formulación declarativa de
las definiciones y comprueban casos de clasificación. Para verificar la interfaz:
alterna una celda, cambia el tamaño, usa Aleatoria y Vaciar, carga cada ejemplo,
selecciona las propiedades y arrastra vértices.
