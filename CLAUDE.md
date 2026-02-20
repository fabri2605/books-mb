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
- **react-native-reanimated** v3.17.5 (animaciones: FadeInDown, ZoomIn, SlideInUp, shimmer)
- **expo-linear-gradient** v15 (gradientes en headers de todas las pantallas)

## Estructura del proyecto

```
books-mb/
├── App.tsx                          # Entry point — NavigationContainer + RootNavigator
├── babel.config.js                  # Babel config con babel-preset-expo
├── metro.config.js                  # Metro config — fuerza CJS para evitar import.meta en web
├── src/
│   ├── components/
│   │   ├── BookCard.tsx             # Card de libro — grilla 3 columnas, cover aspectRatio 2/3
│   │   ├── TrendingCard.tsx         # Card horizontal trending — badge lector top-right, badge dificultad
│   │   ├── TrendingCardSkeleton.tsx # Shimmer skeleton para trending (reanimated)
│   │   ├── ProceduralCover.tsx      # Portadas geométricas procedurales (djb2 hash, 5 patrones)
│   │   ├── StreakModal.tsx          # Modal de racha diaria con animaciones ZoomIn/FadeIn
│   │   ├── DifficultyBadge.tsx      # Badge de dificultad (Fácil/Medio/Difícil)
│   │   ├── FilterChips.tsx          # Chips de filtro por dificultad
│   │   ├── SearchBar.tsx            # Barra de búsqueda con debounce
│   │   ├── QuestionCard.tsx         # Pregunta + 4 opciones
│   │   ├── OptionButton.tsx         # Botón de opción (selected/correct/incorrect)
│   │   ├── LeaderboardRow.tsx       # Fila del ranking — flat style, avatar con color por nombre
│   │   ├── UserAvatar.tsx           # Avatar con fallback a iniciales
│   │   └── StatCard.tsx             # Card de estadística (label + valor)
│   ├── screens/
│   │   ├── AuthScreen.tsx           # Login con Google
│   │   ├── CatalogScreen.tsx        # Dashboard v2: gradient header, XP bar, stats row, grilla 3 col
│   │   ├── BookDetailScreen.tsx     # Detalle + "Empezar Quiz"
│   │   ├── QuizScreen.tsx           # 10 preguntas, una a la vez
│   │   ├── QuizResultScreen.tsx     # Resultado con XP toast animado (SlideInUp)
│   │   ├── LeaderboardScreen.tsx    # Podio + tabs Global/Amigos/Mensual + separador "TU POSICIÓN"
│   │   └── ProfileScreen.tsx        # Perfil: 4 stats, todos los logros, leídos recientemente
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Stack con auth gating
│   │   └── MainTabs.tsx             # Bottom tabs (Libros, Ranking, Perfil) — dot indicator
│   ├── services/
│   │   ├── interfaces/              # Contratos TypeScript de cada servicio
│   │   ├── mock/                    # Implementaciones mock con datos de ejemplo (no activas)
│   │   ├── real/                    # Implementaciones reales que consumen la API REST
│   │   │   ├── realAuthService.ts   # POST /auth/google, /refresh, /signout
│   │   │   ├── realBookService.ts   # GET /books, /books/:id, importBook
│   │   │   ├── realQuizService.ts   # GET /books/:id/questions, POST /quiz/submit
│   │   │   ├── realUserService.ts   # GET /users/me
│   │   │   └── realLeaderboardService.ts
│   │   ├── api/client.ts            # Axios con interceptor JWT (lee token de AsyncStorage)
│   │   └── index.ts                 # Exporta los servicios activos (real)
│   ├── hooks/
│   │   ├── useAuthStore.ts          # Zustand store (user, tokens, isAuthenticated)
│   │   ├── useGoogleAuth.ts         # Hook de login — token mock, pendiente real
│   │   ├── useBooks.ts              # Fetch de libros con filtros + Open Library toggle
│   │   ├── useQuiz.ts               # Sesión de quiz completa
│   │   ├── useLeaderboard.ts        # Fetch del ranking
│   │   └── useStreak.ts             # Racha diaria (AsyncStorage: streak_last_open, streak_count)
│   ├── types/index.ts               # Todos los tipos TypeScript
│   └── utils/scoring.ts             # Puntuación por dificultad (referencia, cálculo real en backend)
```

## Diseño

El diseño de referencia está en `design/bookquest-dashboard-v2.html` (versión actual implementada).
Fuentes del diseño: `Cormorant Garamond` (serif elegante) → mapeada a `PlayfairDisplay` en RN.

### Paleta de colores (theme.ts)
- `ink` #0f0e0b · `cream` #f5f0e8 · `amber` #d4821a · `amberLight` #f5a623
- `forest` #1a3a2a · `sage` #4a7c5f · `dust` #c8b99a · `paper` #ede8dc

### Gradientes usados
- Dashboard/Profile hero: `['#142b1f', '#1e3d2c', '#243322']`
- Ranking hero: `['#1a1508', '#2a2010', '#3a2d15']`
- Avatar: `[Colors.amber, Colors.amberLight]`

## Pendiente

- [ ] **Google OAuth real**: integrar `expo-auth-session` en `useGoogleAuth.ts` para obtener un token real de Google y pasarlo al backend. Requiere `GOOGLE_CLIENT_ID` en el `.env` del backend.
- [ ] **Refresh automático de token**: agregar interceptor de respuesta en `src/services/api/client.ts` que llame a `/auth/refresh` cuando el backend devuelva 401 y reintente el request original.
- [ ] **URL del backend por entorno**: mover `API_BASE_URL` en `client.ts` a una variable de entorno via `app.config.ts` + `expo-constants`, para no hardcodear la IP.
- [ ] **Portadas de libros**: cargar URLs de imágenes reales para `cover_url` en la base de datos.
- [ ] **Leídos recientemente**: conectar sección en ProfileScreen a datos reales del backend (actualmente usa datos mock estáticos).
- [ ] **Rank en tiempo real en Dashboard**: stats row muestra "Nv.X" en lugar del ranking real por falta de datos en authStore; podría incorporar useLeaderboard en CatalogScreen.
- [ ] **Tabs de Ranking**: Global/Amigos/Mensual son UI-only; Amigos y Mensual muestran los mismos datos que Global.

## Notas técnicas

- **Interceptor JWT**: el token se persiste en el store de Zustand (AsyncStorage, clave `auth-storage`). El interceptor parsea ese JSON para leer `state.tokens.accessToken`. Si se cambia el nombre del store de Zustand, actualizar el interceptor.
- **Swap mock/real**: para volver a modo offline, cambiar las importaciones en `src/services/index.ts` de `real/` a `mock/`.
- **Web (Metro)**: Zustand v5 publica `.mjs` con `import.meta.env`. Metro no lo soporta, así que `metro.config.js` fuerza condiciones CJS. Si se agrega otra dependencia ESM-only que rompa web, revisar esa config.
- **Reanimated**: usar v3.17.5 (NO v4). La v4 depende de `react-native-worklets` que no tiene soporte web y rompe el bundle con 500. El plugin `react-native-reanimated/plugin` debe ser el último en `babel.config.js`.
- **Portadas procedurales**: `ProceduralCover` usa hash djb2 sobre el título para elegir 1 de 5 patrones geométricos. Funciona sin librerías externas (pure RN Views).
- **Racha diaria**: `useStreak` guarda `streak_last_open` (fecha ISO) y `streak_count` en AsyncStorage. Misma fecha → no-op; día siguiente → streak+1; gap >1 día → reset a 1.
- **Nivel del usuario**: `nivel = Math.floor(totalPoints / 500) + 1`. Progreso al siguiente nivel: `(totalPoints % 500) / 500`.
- Siempre usar `--clear` después de cambiar configs de Metro/Babel.

## Comandos útiles

```bash
npm install
npx expo start                    # Iniciar servidor de desarrollo
npx expo start --web --clear      # Web con caché limpia
node_modules/.bin/tsc --noEmit    # Verificar tipos TypeScript
```
