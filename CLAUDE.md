# books-mb

Aplicación móvil de lectura competitiva, construida con React Native y Expo.

## Estado actual

App con flujo completo funcional usando datos mock:
- Login (mock, preparado para Google OAuth)
- Catálogo de libros con búsqueda y filtro por dificultad
- Quiz de 10 preguntas multiple choice por libro
- Puntuación por dificultad (fácil: 1pt, medio: 2pt, difícil: 3pt)
- Pantalla de resultados con desglose
- Perfil de usuario con stats
- Ranking/leaderboard mundial
- Capa de servicios con interfaces + mocks (swap a real cambiando `src/services/index.ts`)

## Stack

- **React Native** con **Expo** (SDK 54)
- **TypeScript** 5.9
- **React Navigation** (native stack + bottom tabs)
- **Zustand** (estado global para auth)
- **Axios** (HTTP client, preparado para backend)
- Backend futuro: **PostgreSQL** + IA para generar preguntas

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
│   │   ├── interfaces/              # Contratos de servicios (IAuthService, etc.)
│   │   ├── mock/                    # Implementaciones mock con datos de ejemplo
│   │   ├── api/client.ts            # Instancia axios con interceptor JWT
│   │   └── index.ts                 # Exports (cambiar mock → real aquí)
│   ├── hooks/
│   │   ├── useAuthStore.ts          # Zustand store de autenticación
│   │   ├── useGoogleAuth.ts         # Hook de login con Google
│   │   ├── useBooks.ts              # Fetch de libros con filtros
│   │   ├── useQuiz.ts               # Sesión de quiz completa
│   │   └── useLeaderboard.ts        # Fetch del ranking
│   ├── types/index.ts               # Todos los tipos TypeScript
│   └── utils/scoring.ts             # Puntuación por dificultad
```

## Pendiente / Próximos pasos

- [ ] Integrar Google OAuth real (expo-auth-session) en `useGoogleAuth.ts`
- [ ] Construir backend (API REST + PostgreSQL)
- [ ] Conectar IA para generar preguntas (proveedor por definir)
- [ ] Crear implementaciones reales en `src/services/real/`
- [ ] Agregar imágenes de portada de libros

## Notas técnicas

- **Web (Metro)**: Zustand v5 publica `.mjs` con `import.meta.env`. Metro no lo soporta, así que `metro.config.js` fuerza condiciones CJS (`react-native`, `require`, `default`). Si se agrega otra dependencia ESM-only que rompa web, revisar esa config.
- Siempre usar `--clear` después de cambiar configs de Metro/Babel.

## Comandos útiles

```bash
npx expo start          # Iniciar servidor de desarrollo
npx expo start --web --clear  # Web con caché limpia
npx tsc --noEmit        # Verificar tipos TypeScript
```
