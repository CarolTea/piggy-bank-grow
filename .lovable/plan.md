# Login com Passkey Stellar (passkey-kit) — Plano

Substituir o login de email/senha por **Passkey Stellar real** usando `passkey-kit`. Cada passkey criada vira uma **smart wallet** na Stellar e fica ligada a um usuário real do backend.

## Visão geral do fluxo

```text
[Tela de Login]
   │
   ├─ "Criar conta com Passkey"  ──► WebAuthn create  ──► passkey-kit cria smart wallet
   │                                                   ──► edge function registra credencial + cria usuário
   │                                                   ──► retorna sessão Supabase
   │
   └─ "Entrar com Passkey"       ──► WebAuthn get     ──► edge function valida assertion
                                                       ──► retorna sessão Supabase do usuário existente
```

A wallet criada pela passkey passa a ser a `walletAddress` real exibida no Dashboard (substitui o mock atual do `AuthContext`).

## Mudanças no backend

### Novas tabelas (migration)

- `passkey_wallets`
  - `user_id` (FK `auth.users`, PK)
  - `contract_id` (string, endereço da smart wallet Stellar)
  - `credential_id` (text, único — id da passkey WebAuthn em base64url)
  - `public_key` (bytea)
  - `created_at`
- RLS: usuário só lê o próprio registro; inserts só via service role (edge function).

### Edge functions (3)

1. `passkey-register-begin` — gera challenge WebAuthn (`PublicKeyCredentialCreationOptions`).
2. `passkey-register-complete` — recebe attestation + contract_id da wallet criada pelo passkey-kit no client, valida, cria usuário via `auth.admin.createUser`, grava `passkey_wallets`, gera sessão e devolve `{ access_token, refresh_token }`.
3. `passkey-login` — gera challenge, recebe assertion, valida com a public_key salva, localiza `user_id`, gera sessão e devolve tokens.

Sessão entregue ao client via `supabase.auth.setSession(...)`.

### Secrets necessários

- `LAUNCHTUBE_JWT` — relay de gas para submeter txs Stellar sem o usuário pagar.
- `MERCURY_JWT` — indexador usado pelo passkey-kit server.
- `STELLAR_RPC_URL` — RPC pública (Testnet por padrão; configurável).
- `STELLAR_NETWORK_PASSPHRASE` — ex.: `Test SDF Network ; September 2015`.
- `WALLET_WASM_HASH` — hash do contrato smart-wallet do passkey-kit.

(Já temos `SUPABASE_SERVICE_ROLE_KEY`.)

Vou parar e pedir esses secrets antes de codificar — sem eles a integração real não funciona.

## Mudanças no frontend

- `bun add passkey-kit` (e `@stellar/stellar-sdk` se necessário).
- Novo módulo `src/lib/passkey.ts` encapsulando `PasskeyKit` (rpcUrl, networkPassphrase, walletWasmHash) e helpers `createWallet()` / `connectWallet()`.
- Reescrever `src/pages/Login.tsx`: remover bloco email/senha, deixar dois botões grandes:
  - **Criar conta com Passkey** (chama register-begin → `kit.createWallet()` → register-complete).
  - **Entrar com Passkey** (chama passkey-login).
  - Mantém visual neon, porquinho animado e copy atual.
- `src/contexts/AuthContext.tsx`:
  - Remove `login`/`signup` por email/senha; expõe `loginWithPasskey()` e `registerWithPasskey()`.
  - `walletAddress` passa a vir do `contract_id` salvo (busca em `passkey_wallets` após sessão).
- `supabase/config.toml`: desabilitar provider de email (`[auth.email] enable_signup = false`) já que email/senha sai do fluxo.

## Pontos de atenção

- **HTTPS obrigatório** para WebAuthn — preview/published do Lovable já atendem.
- **Domínio (rpId)** deve bater com a origem; usar `window.location.hostname` no client e validar no servidor.
- Sem `LAUNCHTUBE_JWT` válido a criação de wallet falha — função retornará erro claro.
- O resto do app (PIX mock, Blend mock, flashcards) **não muda**; só a auth e o `walletAddress` real entram em cena.

## Ordem de execução

1. Pedir os 5 secrets via `add_secret`.
2. Migration: tabela `passkey_wallets` + RLS.
3. Edge functions (3) + deploy.
4. `bun add passkey-kit`, criar `lib/passkey.ts`.
5. Reescrever `Login.tsx` e `AuthContext.tsx`.
6. Ajustar `config.toml` (desabilitar signup por email).
7. Testar criar conta + login no preview.
