

# Atualizar bullets Demo com stack técnico real do pitch

## O que muda

Reescrever o array `DEMO_BULLETS` em `src/pages/Login.tsx` (linhas 42-49) para refletir fielmente o stack descrito no pitch, com as tecnologias corretas e APY atualizado.

## Novos bullets

1. **Auth invisível via Privy** (icon: `Shield`) — "Login social cria sua carteira automaticamente. Sem seed phrase, sem extensão, sem complicação"
2. **PIX → USDC via Bipa API** (icon: `QrCode`) — "Conversão PIX → USDC na Solana em D+2. Deposite R$10, R$50 ou R$500"
3. **Melhor rota via Jupiter V6** (icon: `ArrowRightLeft`) — "Swap automático USDC → JitoSOL pela melhor rota e menor taxa do mercado"
4. **JitoSOL: ~7.5–8.5% ao ano** (icon: `TrendingUp`) — "Liquid Staking nativo da Solana. Rendimento de validação sem Impermanent Loss"
5. **Gamificação que educa** (icon: `GraduationCap`) — "Porquinho evolui conforme você poupa, com flashcards de educação financeira"
6. **Só cobramos quando você ganha** (icon: `Wallet`) — "Performance fee de 15% sobre o yield. Sem mensalidade, sem barreira de entrada"

## Detalhes técnicos

- Arquivo: `src/pages/Login.tsx`
- Adicionar import `ArrowRightLeft` do Lucide (substituir `EyeOff`)
- Atualizar o array `DEMO_BULLETS` com os 6 novos itens
- Remover imports não utilizados (`EyeOff`)

