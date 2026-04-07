

# Remover modo Demo padrão, iniciar no login, e trocar Solana → Stellar

## Resumo

1. Remover o modo Demo como tela inicial — o app começa direto na tela de login (modo "experience"). O toggle Demo/Experiência permanece para quem quiser ver os bullets.
2. Trocar todas as referências a **Solana** por **Stellar** em todo o projeto.
3. Trocar **Protocolo: Solana • Kamino Vaults** por **Stellar • Blend** no Dashboard.
4. Atualizar flashcards e mock services que mencionam Solana/Jito/Kamino.

## Alterações por arquivo

### `src/pages/Login.tsx`
- Mudar `useState<'demo' | 'experience'>('demo')` → `('experience')` para iniciar no login
- Nos `DEMO_BULLETS`: trocar "na Solana" → "na Stellar", "JitoSOL" → "Blend", "Liquid Staking nativo da Solana" → "Lending nativo da Stellar"
- "Powered by Solana ⚡" → "Powered by Stellar ⚡"

### `src/pages/Dashboard.tsx`
- "Rendendo via Solana ⚡" → "Rendendo via Stellar ⚡"
- "Protocolo: Solana • Kamino Vaults" → "Stellar • Blend"
- "Rede Solana — transações em <1s" → "Rede Stellar — transações em <1s"

### `src/components/DepositModal.tsx`
- Todas as menções "Solana" → "Stellar" (PIX key, confirmação, processamento)

### `src/components/WithdrawModal.tsx`
- "Processado via Solana → PIX" → "Processado via Stellar → PIX"
- "Processando saque via Solana..." → "Processando saque via Stellar..."
- "via Solana → PIX" → "via Stellar → PIX"

### `src/services/mockWeb3Services.ts`
- Comentário "Kamino/Jito" → "Blend"
- `mockKaminoYield`: protocol → "Blend Protocol"
- Mensagens de depósito/saque: "Solana" → "Stellar"
- Flashcards: trocar Solana por Stellar, Jito por Blend, Kamino Vaults por Blend Protocol

### `src/pages/Education.tsx`
- "DeFi, Solana" → "DeFi, Stellar"

