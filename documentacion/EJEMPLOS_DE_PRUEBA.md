# Ejemplos para probar la aplicación

Selecciona tamaño 3 y pulsa **Vaciar** antes de capturar cada matriz.
Las filas y columnas representan a, b y c, en ese orden.

| Ejemplo | Reflexiva | Simétrica | Asimétrica | Transitiva |
| --- | --- | --- | --- | --- |
| Identidad | Sí | Sí | No | Sí |
| Orden estricto | No | No | Sí | Sí |
| Cadena incompleta | No | No | Sí | No |
| Flechas recíprocas | No | Sí | No | No |
| Mezcla | No | No | No | No |
| Relación vacía | No | Sí | Sí | Sí |

## 1. Identidad

```text
    a b c
a   1 0 0
b   0 1 0
c   0 0 1
```

R={(a,a),(b,b),(c,c)}. Tiene todos los lazos y es reflexiva. Cada par es su
propio inverso, por lo que es simétrica. Los lazos impiden la asimetría.
Es transitiva; se clasifica como equivalencia, orden parcial y preorden.

## 2. Orden estricto

```text
    a b c
a   0 1 1
b   0 0 1
c   0 0 0
```

R={(a,b),(a,c),(b,c)}. Es asimétrica porque no tiene lazos ni inversos.
Es transitiva porque la cadena a -> b -> c tiene el enlace directo a -> c.
Se clasifica como orden estricto total.

## 3. Cadena incompleta

```text
    a b c
a   0 1 0
b   0 0 1
c   0 0 0
```

R={(a,b),(b,c)}. No es transitiva: falta (a,c). Cambia la celda de fila a y
columna c a 1 y comprueba que la transitividad cambia a Sí, como en el ejemplo 2.

## 4. Flechas recíprocas

```text
    a b c
a   0 1 0
b   1 0 0
c   0 0 0
```

R={(a,b),(b,a)}. Es simétrica. No es transitiva: la cadena a -> b -> a exige
(a,a), que falta. La cadena b -> a -> b también exige el lazo (b,b).

## 5. Mezcla: no simétrica y tampoco asimétrica

```text
    a b c
a   0 1 0
b   1 0 1
c   0 0 0
```

R={(a,b),(b,a),(b,c)}. No es simétrica porque falta (c,b). Tampoco es
asimétrica porque existen (a,b) y (b,a). Esto demuestra que asimétrica
no significa simplemente «no simétrica».

## 6. Relación vacía

Pulsa **Vaciar**. No es reflexiva sobre A={a,b,c}, pues faltan los lazos.
Es simétrica, asimétrica y transitiva por vacuidad: no hay pares que
contradigan esas condiciones.
