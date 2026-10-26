# Proyecto: relaciones binarias y grafos dirigidos

Aplicación interactiva en **HTML, CSS y JavaScript**, con código separado,
formateado y comentado en español. No necesita instalar bibliotecas para usarla.

Consulta los [ejemplos de prueba y resultados esperados](documentacion/EJEMPLOS_DE_PRUEBA.md)
y la [guía del código](documentacion/GUIA_DEL_CODIGO.md).

## Abrir la aplicación

1. Extrae todo el ZIP, conservando sus carpetas.
2. Abre `index.html` con Chrome, Edge o Firefox.
3. Selecciona un tamaño entre 1 y 10.
4. Haz clic en cada celda para cambiar entre 0 y 1, o pulsa **Aleatoria**.
5. Observa el grafo, los pares y las propiedades actualizadas al instante.
6. Selecciona una propiedad para consultar su explicación o contraejemplo.

Puedes arrastrar los vértices y cargar ejemplos.

El portapapeles puede estar restringido al abrir archivos locales; en ese caso,
selecciona el conjunto R y usa Ctrl+C. No se requiere conexión a Internet.

## Estructura

```text
Proyecto_Relaciones_Binarias/
├── index.html                     Estructura y controles de la pantalla
├── css/
│   └── estilos.css                Diseño, adaptación e impresión
├── js/
│   ├── analisis.js                Propiedades y clasificación matemática
│   └── aplicacion.js              Eventos, matriz y grafo
├── pruebas/
│   └── analisis.test.js           Pruebas del analizador
├── documentacion/
│   └── GUIA_DEL_CODIGO.md         Explicación de archivos y algoritmos
├── evidencias/
│   └── interfaz.png               Captura de la interfaz con letras
├── .editorconfig                  Convenciones de formato y codificación
└── README.md                      Instrucciones de uso
```

## Ejecutar las pruebas (opcional)

Si tienes Node.js instalado, abre una terminal dentro de la carpeta y ejecuta:

```console
node pruebas/analisis.test.js
```

Las pruebas revisan casos conocidos, las 530 matrices binarias posibles de tamaños
1, 2 y 3 y el rechazo de entradas inválidas. Node.js solo se necesita para estas
pruebas; la aplicación se ejecuta directamente en el navegador.

## Convenciones y límites

- El conjunto base es A = {a, b, c, ...}; la fila indica origen y la columna destino.
- El valor 1 representa un par presente y una flecha en el grafo.
- Las propiedades pedidas son reflexiva, simétrica, asimétrica y transitiva.
- También se comprueba antisimetría para identificar órdenes parciales.
- Las clasificaciones pueden coexistir; una relación identidad es equivalencia y orden parcial.
- La captura se limita a 10 elementos para conservar una visualización manejable.
- Los cambios viven en memoria: recargar la página restaura el ejemplo inicial.
- La captura incluida muestra esta versión con etiquetas alfabéticas.

## Entrega escolar

La evidencia de ejecución y el reporte PDF son entregables externos al programa.
La consigna no exige incluir formularios para integrantes ni exportaciones dentro
de la interfaz. Esta carpeta contiene el proyecto web.
