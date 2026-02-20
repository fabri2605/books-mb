# BookBrawl — Publicación en Google Play Store

## Estado actual
- [x] Cuenta Google Play Developer creada (verificación de identidad en curso)
- [x] `app.json` configurado: package `com.bookbrawl.app`, versionCode 1
- [ ] EAS CLI instalado y configurado
- [ ] Build de producción generado (.aab)
- [ ] App subida a Play Console

---

## Paso 1 — Instalar EAS CLI y loguearse

```bash
npm install -g eas-cli
cd /home/fabricio/Work/mine/books-mb
eas login          # cuenta expo.dev (crear gratis si no tenés)
eas build:configure
```

`eas build:configure` genera `eas.json`. Elegir **Android** cuando pregunte.

### eas.json esperado

```json
{
  "cli": { "version": ">= 13.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Paso 2 — Build de producción (AAB)

```bash
eas build --platform android --profile production
```

- Sube el código a los servidores de Expo (build en la nube)
- Primera vez: genera y guarda el **keystore** automáticamente
- **IMPORTANTE**: guardar las credenciales del keystore que muestra
- Tarda ~10-15 min
- Al terminar: link para descargar el `.aab`

### Build alternativo — APK para testeo directo

```bash
eas build --platform android --profile preview
```

Genera un `.apk` instalable sin pasar por Play Store. Útil para probar antes de publicar.

---

## Paso 3 — Crear la app en Play Console

> Requiere que la verificación de identidad esté aprobada.

URL: https://play.google.com/console

1. **Crear nueva app**
   - Nombre: BookBrawl
   - Idioma predeterminado: Español (Latinoamérica)
   - App o juego: App
   - Gratuita o de pago: Gratuita

2. Ir a **Producción → Crear nueva versión**
3. Subir el `.aab` generado en el Paso 2

---

## Paso 4 — Completar ficha de la app (obligatorio)

### Assets necesarios
| Asset | Tamaño | Notas |
|---|---|---|
| Ícono | 512×512 px | PNG, sin transparencia |
| Feature graphic | 1024×500 px | Banner destacado |
| Screenshots teléfono | mín. 2, máx. 8 | Ratio 16:9 o 9:16 |

### Textos
- **Descripción corta** (máx. 80 chars): p.ej. "Leé libros, respondé quizzes y competí con amigos ⚔️"
- **Descripción larga** (máx. 4000 chars): detallar features, gamificación, etc.

### Clasificación de contenido
- Completar el cuestionario en Play Console → genera la clasificación automáticamente

### Política de privacidad
- URL obligatoria. Opciones gratuitas: privacypolicytemplate.net o termly.io
- Mínimo mencionar: datos recopilados (Google auth, email), cómo se usan

---

## Paso 5 — Enviar a revisión

- Play Console → Producción → Enviar a revisión
- Tiempo de aprobación: **24 a 48 horas**
- Google puede pedir info adicional por email

---

## Actualizaciones futuras

Para subir una nueva versión:

```bash
# 1. Incrementar versionCode en app.json (1 → 2 → 3...)
# 2. Incrementar version si es un cambio mayor ("1.0.0" → "1.1.0")
eas build --platform android --profile production
# 3. En Play Console → Producción → Crear nueva versión → subir nuevo .aab
```

---

## Comandos útiles

```bash
eas build:list                          # ver historial de builds
eas build --platform android --profile preview  # APK de prueba
eas credentials                         # gestionar keystore
eas submit --platform android           # subir a Play Store desde CLI (opcional)
```
