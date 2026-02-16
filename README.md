# books-mb

Aplicacion movil de lectura competitiva. Los usuarios hacen login, eligen un libro, responden un quiz de 10 preguntas sobre ese libro y acumulan puntos segun la dificultad. Un ranking mundial muestra a los mejores lectores.

## Historia de usuario

1. El usuario abre la app y se encuentra con la pantalla de login. Inicia sesion con su cuenta de Google.
2. Una vez autenticado, ve el **catalogo de libros**. Puede buscar por titulo o autor y filtrar por dificultad (facil, medio, dificil).
3. Al tocar un libro, ve el **detalle**: titulo, autor, descripcion, cantidad de paginas, dificultad y cuantos puntos vale cada respuesta correcta.
4. Presiona **"Empezar Quiz"** y se le presentan 10 preguntas de multiple choice (4 opciones, 1 correcta), una a la vez. Puede navegar entre preguntas antes de enviar.
5. Al enviar, ve la **pantalla de resultado**: cuantas acerto, cuantos puntos gano y un desglose pregunta por pregunta.
6. Los puntos se suman a su perfil. Desde la tab **"Perfil"** puede ver su total de puntos, libros completados y cerrar sesion.
7. En la tab **"Ranking"** ve el leaderboard mundial ordenado por puntos, con su posicion resaltada.

## De donde salen los libros

El catalogo de libros se sirve desde el backend via API REST. Actualmente la app usa datos mock con 10 libros de ejemplo (El Principito, 1984, Cien Anos de Soledad, etc.). Cada libro tiene un nivel de dificultad asignado que determina cuantos puntos vale.

Cuando el backend este listo, los libros se cargan desde una base de datos PostgreSQL. La idea es que el catalogo incluya los libros mas conocidos y leidos, organizados por dificultad.

## De donde salen las preguntas

Las 10 preguntas de cada libro son generadas por una **IA** (proveedor por definir: Claude, OpenAI u otro). El flujo es:

1. El usuario pide hacer el quiz de un libro.
2. La app llama al endpoint `GET /books/:id/questions` del backend.
3. El backend envia el titulo y autor del libro a la IA con un prompt que le pide generar 10 preguntas de comprension lectora con 4 opciones y 1 correcta.
4. El backend devuelve las preguntas a la app (sin la respuesta correcta).
5. Al enviar el quiz, la app manda las respuestas al backend (`POST /quiz/submit`), que las evalua y devuelve el resultado con los puntos.

Actualmente la app usa preguntas mock hardcodeadas para 2 libros (El Principito y 1984).

## Sistema de puntuacion

Los puntos por respuesta correcta dependen de la dificultad del libro:

| Dificultad | Puntos por correcta | Maximo por quiz |
|------------|---------------------|-----------------|
| Facil      | 1                   | 10              |
| Medio      | 2                   | 20              |
| Dificil    | 3                   | 30              |

La logica esta en `src/utils/scoring.ts`.

## Navegacion

La app usa React Navigation con dos niveles:

```
RootStack (Stack Navigator) - controla si el usuario esta autenticado
│
├── AuthScreen                    (no autenticado)
│
└── MainTabs (Tab Navigator)      (autenticado)
    ├── Tab: Libros → CatalogScreen
    ├── Tab: Ranking → LeaderboardScreen
    └── Tab: Perfil → ProfileScreen

    Pantallas de drill-down (stack sobre las tabs):
    ├── BookDetailScreen          (desde Catalogo, al tocar un libro)
    ├── QuizScreen                (desde Detalle, al presionar "Empezar Quiz")
    └── QuizResultScreen          (desde Quiz, al enviar respuestas)
```

El auth gating esta en `src/navigation/RootNavigator.tsx`: si el usuario esta autenticado ve las tabs, si no ve la pantalla de login.

## Arquitectura de servicios

La app esta desacoplada del backend mediante una capa de servicios con interfaces:

```
src/services/
├── interfaces/        ← contratos (IAuthService, IBookService, IQuizService, etc.)
├── mock/              ← implementaciones mock para desarrollo sin backend
├── api/client.ts      ← instancia axios con JWT automatico
└── index.ts           ← aca se elige cual implementacion usar (mock o real)
```

Para conectar el backend real, se crean implementaciones en `src/services/real/` y se cambia el import en `src/services/index.ts`.

## Stack tecnico

- **React Native** con **Expo** SDK 54
- **TypeScript** 5.9
- **React Navigation** (native stack + bottom tabs)
- **Zustand** para estado global (autenticacion)
- **Axios** como HTTP client
- **expo-auth-session** para Google OAuth (preparado, actualmente mock)
- **expo-secure-store** para almacenar tokens JWT

## Levantar el proyecto

```bash
npm install
npx expo start
```

Escanear el QR con Expo Go (celular) o presionar `a` para Android / `i` para iOS.

## Verificar tipos

```bash
npx tsc --noEmit
```
