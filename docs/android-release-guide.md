# Guía: Publicar BookBrawl en Android (Prueba Cerrada)

Fecha de redacción: 2026-03-23
Estado actual: Google OAuth funciona en desarrollo (Expo Go / web). Falta configurar para builds nativas.

---

## Prerequisitos

- Cuenta en [expo.dev](https://expo.dev) con username `fabri2605`
- Cuenta en [Google Cloud Console](https://console.cloud.google.com) con el proyecto `react-native-maps-363820`
- Cuenta en [Google Play Console](https://play.google.com/console) (necesitás pagar el registro de desarrollador una sola vez, ~$25 USD)
- Node.js y npm instalados
- El backend `books-api` desplegado en un servidor accesible desde internet (no en localhost) — ver nota al final

---

## Paso 1: Configurar EAS Build

EAS (Expo Application Services) es el servicio de Expo para compilar apps nativas en la nube.

```bash
# Instalar EAS CLI globalmente
npm install -g eas-cli

# Loguearse con tu cuenta de expo.dev
eas login
# Te va a pedir usuario y contraseña de expo.dev

# Verificar que estás logueado
eas whoami
# Debe mostrar: fabri2605

# Desde la raíz del proyecto books-mb
cd /home/fabricio/Work/mine/books-mb

# Inicializar EAS en el proyecto (genera eas.json)
eas build:configure
```

El archivo `eas.json` generado va a tener perfiles de build. Editalo para que quede así:

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

- **preview**: genera un `.apk` directo, fácil de instalar en dispositivos de testers sin Play Store
- **production**: genera un `.aab` (Android App Bundle), requerido por Play Store

---

## Paso 2: Primera build de preview (APK)

```bash
cd /home/fabricio/Work/mine/books-mb
eas build --platform android --profile preview
```

**Lo que va a pasar:**
1. EAS te va a preguntar si querés generar un keystore automáticamente → decí **Yes**
2. Va a subir el código a los servidores de Expo y compilar (tarda ~10-15 minutos la primera vez)
3. Al terminar te da un link de descarga del `.apk`

> **Importante:** EAS guarda el keystore en sus servidores. Este keystore es lo que firma tu app. Si alguna vez necesitás subir a Play Store, tenés que usar siempre el mismo keystore. No lo pierdas.

---

## Paso 3: Obtener el SHA-1 del keystore

El SHA-1 es necesario para que Google sepa que los tokens vienen de tu app firmada y no de otra.

```bash
eas credentials
```

Navegá por el menú:
1. Seleccioná **Android**
2. Seleccioná tu app (`com.bookbrawl.app`)
3. Seleccioná **Keystore**
4. Va a mostrar algo así:

```
SHA1 Fingerprint: AB:CD:12:34:EF:... (40 caracteres hex separados por :)
```

Copiá ese SHA-1, lo necesitás en el próximo paso.

---

## Paso 4: Crear el Android Client ID en Google Cloud Console

1. Ir a [console.cloud.google.com](https://console.cloud.google.com)
2. Seleccionar el proyecto **react-native-maps-363820**
3. Ir a **APIs & Services → Credentials**
4. Click en **+ Create Credentials → OAuth 2.0 Client ID**
5. Tipo de aplicación: **Android**
6. Completar:
   - **Name**: BookBrawl Android
   - **Package name**: `com.bookbrawl.app`
   - **SHA-1 certificate fingerprint**: el que copiaste en el paso 3
7. Click en **Create**
8. Copiar el **Client ID** generado (formato: `XXXXXXXXXX-XXXXXXXXXXXXXXXX.apps.googleusercontent.com`)

> **Nota:** Para Android no se configura redirect URI. Google valida la identidad de la app mediante el package name + SHA-1, no mediante redirect.

---

## Paso 5: Actualizar el código de la app

### 5.1 — Agregar el Android Client ID en `useGoogleAuth.ts`

Archivo: `src/hooks/useGoogleAuth.ts`

```typescript
const GOOGLE_WEB_CLIENT_ID =
  '821408212211-ghprct2fficcqetr7npbj497lcb9sbr2.apps.googleusercontent.com';

const GOOGLE_ANDROID_CLIENT_ID =
  'TU_ANDROID_CLIENT_ID.apps.googleusercontent.com'; // reemplazar con el del paso 4

// ...

const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: GOOGLE_WEB_CLIENT_ID,       // usado en Expo Go y web
  androidClientId: GOOGLE_ANDROID_CLIENT_ID, // usado en builds nativas Android
});
```

### 5.2 — Eliminar el log de debug

En el mismo archivo, eliminar el `useEffect` que imprime el `redirectUri`:

```typescript
// ELIMINAR ESTO:
useEffect(() => {
  if (request?.redirectUri) {
    console.log('[GoogleAuth] redirectUri:', request.redirectUri);
  }
}, [request]);
```

---

## Paso 6: Actualizar el backend para aceptar el Android Client ID

Cuando la app corre como build nativa Android, el ID token de Google tiene el `androidClientId` como `aud` (audiencia). El backend actual solo acepta tokens con el Web Client ID como audiencia.

### 6.1 — Agregar la variable en `.env`

Archivo: `books-api/.env`

```env
DATABASE_URL=postgresql://books_user:books_secret@localhost:5432/books_db
JWT_SECRET_KEY=ea0b367bfc77cb851f8ccd0acf10fc82c651762b35e125330c46ed9b6397970a
GOOGLE_CLIENT_ID=821408212211-ghprct2fficcqetr7npbj497lcb9sbr2.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=TU_ANDROID_CLIENT_ID.apps.googleusercontent.com
```

### 6.2 — Actualizar `config.py`

Archivo: `books-api/app/config.py`

```python
# Google OAuth
GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
GOOGLE_ANDROID_CLIENT_ID = os.environ.get("GOOGLE_ANDROID_CLIENT_ID", "")
```

### 6.3 — Actualizar `_verify_google_token` en `auth.py`

Archivo: `books-api/app/routes/auth.py`

Reemplazar la función actual:

```python
# ANTES:
def _verify_google_token(google_id_token: str) -> dict:
    idinfo = id_token.verify_oauth2_token(
        google_id_token,
        google_requests.Request(),
        current_app.config["GOOGLE_CLIENT_ID"],
    )
    return idinfo

# DESPUÉS:
def _verify_google_token(google_id_token: str) -> dict:
    # Verificar sin validar audiencia primero
    idinfo = id_token.verify_oauth2_token(
        google_id_token,
        google_requests.Request(),
    )
    # Aceptar Web Client ID y Android Client ID
    allowed_audiences = {
        current_app.config["GOOGLE_CLIENT_ID"],
        current_app.config.get("GOOGLE_ANDROID_CLIENT_ID", ""),
    }
    if idinfo.get("aud") not in allowed_audiences:
        raise ValueError("Token audience not recognized")
    return idinfo
```

---

## Paso 7: URL del backend para producción

El backend debe ser accesible desde internet (no desde `192.168.x.x`) para que los testers puedan usarlo.

### Opción rápida: ngrok (solo para testing, no producción)
```bash
# Instalar ngrok: https://ngrok.com
ngrok http 5000
# Te da una URL pública tipo: https://abc123.ngrok.io
```

### Opción real: servidor en la nube
Opciones simples y baratas:
- **Railway** (railway.app) — free tier disponible, deploy con `railway up`
- **Render** (render.com) — free tier disponible, conecta con GitHub
- **DigitalOcean App Platform** — ~$5/mes

En cualquier caso, al tener la URL pública del backend, actualizala en:

Archivo: `books-mb/src/services/api/client.ts`
```typescript
const API_BASE_URL = 'https://tu-backend.railway.app'; // o la URL que uses
```

---

## Paso 8: Build final y distribución

### Opción A: APK directo a testers (más simple)

```bash
eas build --platform android --profile preview
```

Al terminar, EAS te da un link. Compartís ese link a tus testers, ellos lo descargan e instalan directamente en su Android (necesitan activar "instalar desde fuentes desconocidas").

### Opción B: Play Store — Prueba Cerrada

1. Subir el `.aab` a [Play Console](https://play.google.com/console)
2. Crear una prueba cerrada (Internal Testing o Closed Testing)
3. Agregar los emails de los testers
4. Los testers reciben un link de invitación y pueden instalar desde Play Store

Para el `.aab`:
```bash
eas build --platform android --profile production
```

---

## Checklist final antes de distribuir

- [ ] Android Client ID creado en Google Cloud Console con el SHA-1 correcto
- [ ] `androidClientId` agregado en `useGoogleAuth.ts`
- [ ] Log de debug eliminado de `useGoogleAuth.ts`
- [ ] Backend actualizado para aceptar Android Client ID como audiencia válida
- [ ] `GOOGLE_ANDROID_CLIENT_ID` en el `.env` del backend
- [ ] `API_BASE_URL` en `client.ts` apuntando a la URL pública del backend (no a `192.168.x.x`)
- [ ] Build generada con `eas build --platform android`
- [ ] App instalada y probada en un dispositivo físico Android antes de distribuir

---

## Notas adicionales

- **Expo Go vs build nativa**: Expo Go usa el Web Client ID. Las builds nativas usan el Android Client ID. Ambos deben funcionar en paralelo.
- **El keystore es crítico**: si perdés el keystore con el que firmaste la app, no podés publicar actualizaciones en Play Store para esa misma app. EAS lo guarda en la nube pero podés hacer un backup local con `eas credentials`.
- **SHA-1 de debug vs release**: el keystore que genera EAS es el de release. Si alguna vez corres `eas build --profile development`, tiene un SHA-1 diferente que podés agregar como segundo Android Client ID en Google Console.
