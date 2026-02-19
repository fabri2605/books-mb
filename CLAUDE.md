# books-mb

Aplicación móvil de lectura competitiva, construida con React Native y Expo.

## Estado actual

App con flujo completo funcional conectada al backend real (`books-api`):
- Login con Google (token mock por ahora; backend listo para token real)
- Catálogo de libros con búsqueda y filtro por dificultad (datos desde PostgreSQL)
- Quiz de 10 preguntas por libro (preguntas desde la DB, evaluación server-side)
- Puntuación por dificultad (fácil: 1pt, medio: 2pt, difícil: 3pt)
- Pantalla de resultados con desglose
- Perfil de usuario con stats reales
- Ranking/leaderboard mundial con datos reales

## Stack

- **React Native** con **Expo** (SDK 54)
- **TypeScript** 5.9
- **React Navigation** (native stack + bottom tabs)
- **Zustand** (estado global para auth, persistido en AsyncStorage)
- **Axios** (HTTP client con interceptor JWT que lee de AsyncStorage)
- **expo-auth-session** para Google OAuth (preparado, actualmente mock)

## Estructura del proyecto

```
books-mb/
├── App.tsx                          # Entry point — NavigationContainer + RootNavigator
├── babel.config.js                  # Babel config con babel-preset-expo
├── metro.config.js                  # Metro config — fuerza CJS para evitar import.meta en web
├── src/
│   ├── components/
│   │   ├── BookCard.tsx             # Card de libro para el catálogo
│   │   ├── DifficultyBadge.tsx      # Badge de dificultad (Fácil/Medio/Difícil)
│   │   ├── FilterChips.tsx          # Chips de filtro por dificultad
│   │   ├── SearchBar.tsx            # Barra de búsqueda con debounce
│   │   ├── QuestionCard.tsx         # Pregunta + 4 opciones
│   │   ├── OptionButton.tsx         # Botón de opción (selected/correct/incorrect)
│   │   ├── LeaderboardRow.tsx       # Fila del ranking
│   │   ├── UserAvatar.tsx           # Avatar con fallback a iniciales
│   │   └── StatCard.tsx             # Card de estadística (label + valor)
│   ├── screens/
│   │   ├── AuthScreen.tsx           # Login con Google
│   │   ├── CatalogScreen.tsx        # Lista de libros
│   │   ├── BookDetailScreen.tsx     # Detalle + "Empezar Quiz"
│   │   ├── QuizScreen.tsx           # 10 preguntas, una a la vez
│   │   ├── QuizResultScreen.tsx     # Resultado con puntos y desglose
│   │   ├── LeaderboardScreen.tsx    # Ranking mundial
│   │   └── ProfileScreen.tsx        # Perfil + sign-out
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Stack con auth gating
│   │   └── MainTabs.tsx             # Bottom tabs (Libros, Ranking, Perfil)
│   ├── services/
│   │   ├── interfaces/              # Contratos TypeScript de cada servicio
│   │   ├── mock/                    # Implementaciones mock con datos de ejemplo (no activas)
│   │   ├── real/                    # Implementaciones reales que consumen la API REST
│   │   │   ├── realAuthService.ts   # POST /auth/google, /refresh, /signout
│   │   │   ├── realBookService.ts   # GET /books, /books/:id
│   │   │   ├── realQuizService.ts   # GET /books/:id/questions, POST /quiz/submit
│   │   │   ├── realUserService.ts   # GET /users/me
│   │   │   └── realLeaderboardService.ts
│   │   ├── api/client.ts            # Axios con interceptor JWT (lee token de AsyncStorage)
│   │   └── index.ts                 # Exporta los servicios activos (real)
│   ├── hooks/
│   │   ├── useAuthStore.ts          # Zustand store (user, tokens, isAuthenticated)
│   │   ├── useGoogleAuth.ts         # Hook de login — token mock, pendiente real
│   │   ├── useBooks.ts              # Fetch de libros con filtros
│   │   ├── useQuiz.ts               # Sesión de quiz completa
│   │   └── useLeaderboard.ts        # Fetch del ranking
│   ├── types/index.ts               # Todos los tipos TypeScript
│   └── utils/scoring.ts             # Puntuación por dificultad (referencia, cálculo real en backend)
```

## Pendiente

- [ ] **Google OAuth real**: integrar `expo-auth-session` en `useGoogleAuth.ts` para obtener un token real de Google y pasarlo al backend. Requiere `GOOGLE_CLIENT_ID` en el `.env` del backend.
- [ ] **Refresh automático de token**: agregar interceptor de respuesta en `src/services/api/client.ts` que llame a `/auth/refresh` cuando el backend devuelva 401 y reintente el request original.
- [ ] **URL del backend por entorno**: mover `API_BASE_URL` en `client.ts` a una variable de entorno via `app.config.ts` + `expo-constants`, para no hardcodear la IP.
- [ ] **Portadas de libros**: cargar URLs de imágenes reales para `cover_url` en la base de datos.

## Notas técnicas

- **Interceptor JWT**: el token se persiste en el store de Zustand (AsyncStorage, clave `auth-storage`). El interceptor parsea ese JSON para leer `state.tokens.accessToken`. Si se cambia el nombre del store de Zustand, actualizar el interceptor.
- **Swap mock/real**: para volver a modo offline, cambiar las importaciones en `src/services/index.ts` de `real/` a `mock/`.
- **Web (Metro)**: Zustand v5 publica `.mjs` con `import.meta.env`. Metro no lo soporta, así que `metro.config.js` fuerza condiciones CJS. Si se agrega otra dependencia ESM-only que rompa web, revisar esa config.
- Siempre usar `--clear` después de cambiar configs de Metro/Babel.

## Comandos útiles

```bash
npm install
npx expo start                    # Iniciar servidor de desarrollo
npx expo start --web --clear      # Web con caché limpia
node_modules/.bin/tsc --noEmit    # Verificar tipos TypeScript
```
