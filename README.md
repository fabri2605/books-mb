# books-mb

Aplicación móvil de lectura competitiva. Los usuarios hacen login con Google, eligen un libro del catálogo, responden un quiz de 10 preguntas y acumulan puntos según la dificultad del libro. Un ranking mundial muestra a los mejores lectores.

## Historia de usuario

1. El usuario abre la app y ve la pantalla de login. Inicia sesión con su cuenta de Google.
2. Una vez autenticado, ve el **catálogo de libros**. Puede buscar por título o autor y filtrar por dificultad (fácil, medio, difícil).
3. Al tocar un libro ve el **detalle**: título, autor, descripción, cantidad de páginas, dificultad y cuántos puntos vale cada respuesta correcta.
4. Presiona **"Empezar Quiz"** y se le presentan 10 preguntas de múltiple choice (4 opciones, 1 correcta), una a la vez. Puede navegar entre preguntas antes de enviar.
5. Al enviar ve la **pantalla de resultado**: cuántas acertó, cuántos puntos ganó y un desglose pregunta por pregunta.
6. Los puntos se suman a su perfil. Desde la tab **Perfil** puede ver sus estadísticas y cerrar sesión.
7. En la tab **Ranking** ve el leaderboard mundial ordenado por puntos, con su posición resaltada.

## Estado actual

- **Backend conectado**: la app consume datos reales desde `books-api` (Flask + PostgreSQL).
- **10 libros** disponibles con **100 preguntas** (10 por libro), servidos desde la base de datos.
- **Auth**: el flujo de Google OAuth todavía usa un token mock. El backend ya valida tokens reales de Google; falta integrar `expo-auth-session` en la app.
- **Scoring**: calculado en el servidor y devuelto al cliente.
- **Perfil y leaderboard**: datos reales de la base de datos.

## Sistema de puntuación

| Dificultad | Puntos por correcta | Máximo por quiz |
|------------|---------------------|-----------------|
| Fácil      | 1                   | 10              |
| Medio      | 2                   | 20              |
| Difícil    | 3                   | 30              |

## Navegación

```
RootStack (Stack)          — controla si el usuario está autenticado
│
├── AuthScreen             — no autenticado
│
└── MainTabs (Tab)         — autenticado
    ├── Libros  → CatalogScreen
    ├── Ranking → LeaderboardScreen
    └── Perfil  → ProfileScreen

    Pantallas de drill-down:
    ├── BookDetailScreen   — al tocar un libro
    ├── QuizScreen         — al presionar "Empezar Quiz"
    └── QuizResultScreen   — al enviar las respuestas
```

## Arquitectura de servicios

La app está desacoplada del backend mediante interfaces TypeScript. La implementación se elige en un solo lugar (`src/services/index.ts`):

```
src/services/
├── interfaces/          ← contratos: IAuthService, IBookService, IQuizService, IUserService, ILeaderboardService
├── mock/                ← implementaciones con datos hardcodeados (no usadas en producción)
├── real/                ← implementaciones que consumen la API REST
│   ├── realAuthService.ts
│   ├── realBookService.ts
│   ├── realQuizService.ts
│   ├── realUserService.ts
│   └── realLeaderboardService.ts
├── api/client.ts        ← instancia Axios; agrega el JWT automáticamente en cada request
└── index.ts             ← exporta los servicios activos (actualmente: real)
```

Para volver a los mocks (desarrollo offline), en `src/services/index.ts` reemplazar las importaciones de `real/` por las de `mock/`.

## Cómo funciona el token JWT

El `accessToken` que devuelve el backend al hacer login se guarda en el store de Zustand (persistido en `AsyncStorage` bajo la clave `auth-storage`). El interceptor de Axios lee ese valor y lo inyecta como `Authorization: Bearer <token>` en cada request automáticamente.

## Stack técnico

| Tecnología | Uso |
|---|---|
| React Native + Expo SDK 54 | Framework mobile |
| TypeScript 5.9 | Tipado |
| React Navigation | Navegación (stack + bottom tabs) |
| Zustand | Estado global (autenticación) |
| Axios | HTTP client con interceptor JWT |
| expo-auth-session | Google OAuth (preparado, pendiente de integrar) |
| AsyncStorage | Persistencia del store de autenticación |

## Levantar el proyecto

```bash
npm install
npx expo start
```

Escanear el QR con Expo Go (dispositivo) o presionar `a` (Android) / `i` (iOS).

> El backend debe estar corriendo. Ver instrucciones en `../books-api/README.md`.

## Pendiente

- [ ] **Google OAuth real**: reemplazar el token mock en `src/hooks/useGoogleAuth.ts` por el flujo real con `expo-auth-session`. Requiere un Google Client ID configurado tanto en la app como en el backend (`.env`).
- [ ] **Portadas de libros**: agregar URLs de imágenes reales a los libros en la base de datos (`cover_url`).
- [ ] **Refresh automático de token**: cuando el backend devuelve 401, llamar a `/auth/refresh` y reintentar. Implementar en el interceptor de respuesta en `src/services/api/client.ts`.
- [ ] **URL del backend configurable**: mover `API_BASE_URL` en `src/services/api/client.ts` a una variable de entorno (`app.config.ts` con `extra`), para no tener que editar código al cambiar de entorno.

## Verificar tipos

```bash
node_modules/.bin/tsc --noEmit
```
