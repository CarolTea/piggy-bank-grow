

# Fix: Layout, Porquinho, PIX Simulado, Flashcards DeFi e Sons

## Problemas Identificados

1. **Hero sobrepondo conteúdo abaixo** — o header gradiente com `rounded-b-[2rem]` e os botões com `-mt-5` causam sobreposição; o porquinho (170-220px) + saldo + yield ocupa muito espaço vertical sem overflow controlado
2. **Porquinho parece rato** — SVG rosa sobre fundo rosa/roxo sem contraste; orelhas muito pontiagudas e longas (`ry: r*0.38`); corpo pequeno relativo ao viewBox; focinho estreito
3. **PIX não simulado** — depósito mostra apenas spinner genérico sem simulação de QR code ou chave PIX; saque não simula Pix
4. **Flashcards fracos em DeFi/Web3** — apenas 2 cards mencionam Solana/Kamino; faltam conceitos como yield farming, staking, DeFi, liquidez, smart contracts
5. **Sem música de fundo** — nenhum som ambiente ao abrir o app; som de "registradora/cha-ching" existe no hook mas pode não estar tocando corretamente

## Correções

### 1. Layout do Dashboard — Eliminar sobreposição
- Remover `-mt-5` dos botões de ação
- Reduzir padding do header (`pb-10` → `pb-6`)
- Porquinho com tamanho fixo menor no header (140px max) para caber sem overflow
- Adicionar `relative z-10` nos botões para garantir que ficam acima
- Mover o card de info para dentro de um scroll area se necessário

### 2. Redesenhar o Porquinho SVG
- **Orelhas mais redondas e curtas**: reduzir `ry` de `0.38` para `0.25`, aumentar `rx` — forma mais arredondada de porco
- **Corpo mais gordo**: aumentar o raio do corpo (`r` de `0.32` para `0.38`)
- **Focinho maior e mais oval**: aumentar proporções do snout
- **Nariz característico**: nostrils maiores e mais visíveis
- **Cor mais clara e contrastante**: corpo `#FFB0C8` (rosa mais claro e saturado) com stroke branco mais grosso
- **Fundo circular** mais opaco (`bg-white/25` em vez de `bg-white/12`) para separar do gradiente
- **Bochechas mais proeminentes**

### 3. Simulação de PIX no Depósito
- Após clicar "Confirmar Depósito", mostrar um passo intermediário **"QR Code PIX"** com:
  - QR code SVG gerado (padrão visual, não funcional)
  - Chave PIX fictícia: `smartpig@solana.pay`
  - Botão "Copiar Chave" com feedback
  - Timer de 10s simulando "Aguardando pagamento..."
  - Após 3s, auto-confirmar como "Pagamento detectado!"
- No saque, adicionar passo de "Chave PIX de destino" com input para a chave

### 4. Flashcards com Conteúdo DeFi Real
Substituir e expandir os flashcards para 12 cards cobrindo:
- O que é DeFi (finanças sem banco)
- Yield Farming explicado simplesmente
- Staking — como funciona o rendimento
- Liquidez — por que seus reais rendem
- Smart Contracts — contratos automáticos
- Solana vs sistema bancário tradicional
- Kamino Vaults em detalhe
- Risco vs Poupança tradicional
- Composabilidade DeFi
- Taxas zero — como é possível
- Carteira digital invisível
- O futuro das finanças

### 5. Sons — Música Ambiente e Registradora
- Adicionar `playAmbient` ao `useSound.ts`: loop suave de tons harmônicos (acorde em C major) que toca ao entrar no Dashboard
- Garantir que `playDeposit` (cha-ching) toca corretamente — verificar se AudioContext está resumed (precisa de user interaction first)
- Adicionar `playChaChing` mais elaborado: sequência rápida de tons metálicos agudos (1200→1600→2000→2400 Hz)
- Som de "moedas caindo" no confetti
- Botão mute no canto do Dashboard para controlar sons

## Arquivos a Modificar
1. `src/components/EvolutionaryPig.tsx` — redesenhar SVG (orelhas, corpo, focinho)
2. `src/pages/Dashboard.tsx` — fix layout/sobreposição, botão mute
3. `src/components/DepositModal.tsx` — adicionar passo QR Code PIX
4. `src/components/WithdrawModal.tsx` — adicionar input chave PIX
5. `src/services/mockWeb3Services.ts` — 12 flashcards DeFi
6. `src/hooks/useSound.ts` — ambient loop, cha-ching melhorado
7. `src/pages/Education.tsx` — atualizar contagem de cards

