

# Implementar autenticação real com e-mail e Google

## Resumo

Substituir o mock de autenticação por autenticação real usando Lovable Cloud (Supabase). O usuário poderá criar conta com e-mail/senha ou conectar com Google, com os dados salvos no banco de dados.

## Etapas

### 1. Habilitar Lovable Cloud
- Ativar o backend Supabase integrado via ferramenta `cloud-enable`
- Isso provisiona banco de dados, autenticação e API automaticamente

### 2. Criar tabela `profiles`
- Tabela `profiles` com `id` (FK para `auth.users`), `name`, `avatar_url`, `created_at`
- RLS: usuários só leem/editam o próprio perfil
- Trigger para criar perfil automaticamente no signup

### 3. Configurar Google OAuth
- Habilitar provider Google no Lovable Cloud

### 4. Criar cliente Supabase no frontend
- Arquivo `src/integrations/supabase/client.ts` com `createClient`
- Variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### 5. Reescrever `AuthContext.tsx`
- Substituir `mockPrivyAuth` por chamadas reais ao Supabase Auth
- `login('email')` → `supabase.auth.signUp()` ou `signInWithPassword()`
- `login('google')` → `supabase.auth.signInWithOAuth({ provider: 'google' })`
- `logout` → `supabase.auth.signOut()`
- Listener `onAuthStateChange` para manter sessão
- Buscar perfil da tabela `profiles` após login

### 6. Atualizar `Login.tsx`
- Adicionar campo de senha para login com e-mail
- Adicionar toggle "Criar conta" vs "Já tenho conta"
- Manter o visual atual (cores, animações, pig)
- Botão Google chama OAuth real

### 7. Remover mock de auth
- Remover `mockPrivyAuth` de `mockWeb3Services.ts`
- Manter os outros mocks (deposit, withdraw, yield) intactos

## Detalhes técnicos

- Arquivo novo: `src/integrations/supabase/client.ts`
- Arquivos alterados: `src/contexts/AuthContext.tsx`, `src/pages/Login.tsx`, `src/services/mockWeb3Services.ts`
- Migration: criar tabela `profiles` + trigger + RLS policies
- O tipo `AuthUser` passa a refletir o perfil do Supabase em vez do mock

