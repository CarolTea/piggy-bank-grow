

# Fix: Contraste, Proporção do Porquinho, Sons e Menções à Solana

## Problemas Identificados
1. **Porquinho pequeno demais** — SVG tem apenas 100-140px, quase invisível no header gradiente
2. **Contraste ruim** — porquinho rosa sobre fundo rosa/roxo se perde; textos com opacidade baixa
3. **Sons escassos** — só tem `playClick`, `playCoin`, `playSuccess`; faltam sons ao navegar, ao swipe de cards, ao abrir modais
4. **Zero menções à Solana** — o card de info diz "Cofre Seguro v2", flashcards não explicam Solana, tela de login não menciona

## Correções

### 1. Porquinho Maior e Visível (`EvolutionaryPig.tsx`)
- Aumentar tamanhos de 100-140px para **160-220px**
- Adicionar um **fundo circular branco/claro semitransparente** atrás do porquinho para separar do gradiente do header
- Melhorar contraste dos olhos e detalhes com strokes mais definidos

### 2. Contraste e Cores (`index.css`, `Dashboard.tsx`, `Login.tsx`)
- Textos informativos: subir opacidade de `text-white/40` e `text-white/50` para `text-white/70` e `text-white/80`
- Porquinho: círculo de fundo `bg-white/15` com backdrop-blur para destacar do gradiente
- Labels de saldo e rendimento com maior contraste
- Info card: bordas mais visíveis, texto com maior peso

### 3. Mais Sons (`useSound.ts`, vários componentes)
- Adicionar novos sons ao hook:
  - `playSwipe` — ao arrastar flashcard
  - `playDeposit` — som de "cha-ching" ao confirmar depósito (mais elaborado que playCoin)
  - `playNav` — click suave ao trocar de tab
  - `playLevelUp` já existe mas **usar efetivamente** ao mudar de nível do porquinho
  - `playError` — tom grave para erro/valor inválido
- Integrar sons em:
  - `FlashcardSwiper` — playSwipe ao arrastar
  - `BottomNav` — playNav ao trocar tab
  - `DepositModal` — playDeposit no sucesso (substituir playSuccess+playCoin)
  - `EvolutionaryPig` — playLevelUp quando nível muda
  - `Login` — playSuccess ao logar com sucesso

### 4. Menções à Solana (`Dashboard.tsx`, `mockWeb3Services.ts`, flashcards)
- Dashboard info card: trocar "Cofre Seguro v2" por "Solana • Kamino Vaults"
- Adicionar linha "Rede: Solana" com ícone de velocidade
- Adicionar texto sutil no depósito: "Confirmado via Solana em <1s"
- Flashcards: adicionar 2 novos cards:
  - "O que é a Solana?" — rede ultra-rápida, transações em menos de 1 segundo, sem taxas para você
  - "Kamino Vaults" — seus reais são convertidos e depositados em cofres na Solana que rendem automaticamente
- Login footer: mudar de "carteira segura" para "Protegido pela rede Solana — rápida, segura e sem taxas"
- Deposit success: mostrar "Confirmado na Solana ⚡" em vez de só "Depósito confirmado"

### 5. Deposit Modal: porquinho SVG no sucesso (`DepositModal.tsx`)
- Substituir o emoji 🐷 no passo de sucesso pelo componente `PigSVG` inline (porquinho real do app)

## Arquivos a Modificar
1. `src/components/EvolutionaryPig.tsx` — tamanhos maiores, fundo de destaque
2. `src/hooks/useSound.ts` — novos sons (swipe, nav, deposit, error)
3. `src/pages/Dashboard.tsx` — contraste de textos, info card com Solana
4. `src/pages/Login.tsx` — footer com menção Solana, som ao logar
5. `src/components/DepositModal.tsx` — texto Solana no sucesso, som deposit
6. `src/components/FlashcardSwiper.tsx` — som ao swipe
7. `src/components/BottomNav.tsx` — som ao navegar
8. `src/services/mockWeb3Services.ts` — 2 novos flashcards sobre Solana
9. `src/index.css` — ajustes de contraste mínimos

