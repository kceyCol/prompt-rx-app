# CID Medical AI - Environment Variables

Para que o aplicativo funcione corretamente, você deve configurar o arquivo `.env.local` na raiz da pasta `cid-medical-ai` com as seguintes chaves:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (LibSQL / SQLite)
DATABASE_URL=file:local.db
# DATABASE_AUTH_TOKEN=seu_token_se_usar_turso

# Google Gemini AI
GEMINI_API_KEY=AIzaSyDfvwB3g29tURnIuyNu5-KFflUUb0Qv8Rs
```

## Como obter as chaves:
1. **Clerk:** Crie um projeto em [clerk.com](https://clerk.com).
2. **Gemini:** Obtenha sua API Key em [aistudio.google.com](https://aistudio.google.com).
3. **Database:** Por padrão, o app usará um arquivo local `local.db`.
