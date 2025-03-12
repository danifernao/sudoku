# Sudoku

Un sudoku elaborado con React. Este aplicación no genera nuevos sudokus, sino que toma una muestra existente, ya resuelta, y la manipula, presentando el mismo ejercicio, pero en otro orden, ofreciendo una experiencia similar.

![Captura de pantalla del sudoku](/screenshot.png)

### Instalación

1. Asegúrate de tener instalado Node.js y NPM.
2. Descarga o clona este repositorio e ingresa a él.
3. Abre el terminal en dicha ubicación y ejecuta lo siguiente para instalar las dependencias:

```
npm install
```

### Visualización

Ubícate en la raíz del proyecto, abre el terminal en dicha ubicación y ejecuta lo siguiente para iniciar el entorno de desarrollo y visualizarlo en el explorador web:

```
npm run dev
```

### Configuración

Los sudokus resueltos se agregan en el archivo `src/assets/samples.json`. A las pistas se les agregan un cero a la izquierda y al resto de números, los cuales permancerán ocultos, un cero a la derecha para mejorar su legibilidad. Por ejemplo:

```
[
  [9.0,  0.7,  4.0,    3.0,  2.0,  6.0,    5.0,  0.1,  8.0],
  [1.0,  3.0,  0.2,    0.7,  5.0,  8.0,    4.0,  6.0,  9.0],
  [0.8,  5.0,  6.0,    4.0,  9.0,  0.1,    7.0,  0.2,  0.3],

  [0.6,  9.0,  8.0,    5.0,  0.4,  7.0,    1.0,  3.0,  2.0],
  [2.0,  1.0,  0.7,    0.6,  0.3,  0.9,    0.8,  4.0,  5.0],
  [3.0,  4.0,  5.0,    1.0,  0.8,  2.0,    6.0,  9.0,  0.7],

  [0.4,  0.6,  3.0,    0.9,  7.0,  5.0,    2.0,  8.0,  0.1],
  [5.0,  8.0,  1.0,    2.0,  6.0,  0.3,    0.9,  7.0,  4.0],
  [7.0,  0.2,  9.0,    8.0,  1.0,  4.0,    3.0,  0.5,  6.0]
]
```

Representa el siguiente Sudoku:

![Captura de pantalla del sudoku](/screenshot-2.png)

Ten presente que los sudokus deben ser únicos, no deben tener más de una solución.

### Uso

- El sudoku se llena haciendo clic en alguna casilla de la cudrícula e ingresando un número con el teclado.
- Cuando ingresas un número, el foco pasa a la siguiente casilla. Para regresar a la casilla anterior o ubicarte en otra distinta, puedes hacer clic en ella o utilizar las teclas de dirección de tu teclado.
- El sudoku estará resuelto cuando así lo indique el mensaje que aparece en la parte superior del mismo.
- El botón _Resolver_ borra lo ingresado y soluciona el sudoku. No valida lo ingresado.

### Producción

Ubícate en la raíz del proyecto, abre el terminal en dicha ubicación y ejecuta lo siguiente para generar los archivos destinados a un entorno de producción:

```
npm run build
```

Estos se guardarán en una nueva carpeta llamada `dist`.
