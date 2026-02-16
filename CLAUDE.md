# books-mb

Aplicación móvil para gestión de libros, construida con React Native y Expo.

## Estado actual

La app fue inicializada con Expo + TypeScript (`blank-typescript`). Por ahora solo existe la primera pantalla con un saludo y un botón visual, sin lógica de negocio.

## Stack

- **React Native** con **Expo** (SDK más reciente al momento de creación)
- **TypeScript**
- Backend futuro: **PostgreSQL** (aún no conectado)

## Estructura del proyecto

```
books-mb/
├── App.tsx                  # Entry point — renderiza HomeScreen
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── screens/
│   │   └── HomeScreen.tsx   # Primera pantalla: "Hola!" + botón "Empezar"
│   ├── navigation/          # Configuración de navegación (pendiente)
│   ├── services/            # Llamadas al backend/API (pendiente — PostgreSQL)
│   ├── hooks/               # Custom hooks
│   ├── types/               # Tipos TypeScript globales
│   └── utils/               # Funciones utilitarias
```

## Pendiente / Próximos pasos

- [ ] Agregar navegación (React Navigation o Expo Router)
- [ ] Diseñar pantallas principales (listado de libros, detalle, etc.)
- [ ] Conectar con backend PostgreSQL desde `src/services/`
- [ ] Definir tipos en `src/types/`

## Comandos útiles

```bash
npx expo start          # Iniciar servidor de desarrollo
npx tsc --noEmit        # Verificar tipos TypeScript
```
