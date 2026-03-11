<img width="1205" height="749" alt="image" src="https://github.com/user-attachments/assets/ea8fc839-1b38-4811-8cb0-0d89dfd3e512" />

## Porrify

Webapp en Next.js para crear y jugar porras privadas de fútbol y Formula 1.

## Stack

- Next.js App Router
- NextAuth (Google)
- MongoDB Atlas
- Stripe Checkout + Webhook
- TheSportsDB

## Setup local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Variables esperadas en `.env.local`:

```bash
AUTH_SECRET=
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
MONGODB_URI=
MONGODB_DB=porra
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
THESPORTSDB_API_KEY=
```

## OAuth local (Google)

- Callback URL: `http://localhost:3000/api/auth/callback/google`

## Stripe webhook local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copia el `whsec_...` que devuelve Stripe en `STRIPE_WEBHOOK_SECRET`.

## Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En Vercel, `Add New -> Project` y selecciona el repo.
3. En `Environment Variables`, añade todas las variables de `.env.example`.
4. Ajusta estas URLs de producción:
   - `NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app`
   - Google OAuth Authorized redirect URI: `https://tu-dominio.vercel.app/api/auth/callback/google`
5. Deploy.

## Configuración Stripe en producción

1. En Stripe Dashboard, crea endpoint webhook:
   - URL: `https://tu-dominio.vercel.app/api/stripe/webhook`
2. Eventos mínimos recomendados:
   - `checkout.session.completed`
   - `checkout.session.expired`
3. Copia el secret del endpoint en Vercel como `STRIPE_WEBHOOK_SECRET`.
4. Usa `STRIPE_SECRET_KEY` en modo live o test según el entorno.

## Sincronización de datos

De momento la sincronización se ejecuta de forma manual desde el panel `/admin`, usando los botones de sync por competición.

## Colecciones MongoDB

- `users`
- `porras`
- `entries`
- `payments`
- `teamProgress`
- `syncLogs`
