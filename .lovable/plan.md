

# Smart Pig 🐷 — Protótipo Funcional

## Visão Geral
Aplicativo mobile-first de poupança gamificada com experiência "Web3 Invisível". Interface lúdica inspirada no Duolingo, com um porquinho evolutivo como elemento central.

## Estrutura de Páginas e Componentes

### 1. Tela de Autenticação
- Login whitelabel simulando Privy SDK
- Botões: "Entrar com Google", "Entrar com Apple", "Continuar com E-mail"
- Rodapé: "Sua carteira segura é criada automaticamente"
- Animação de entrada com Framer Motion
- Fundo gradiente roxo/rosa com o porquinho animado

### 2. Dashboard Principal — "Porquinho Evolutivo"
- **Porquinho central animado** que evolui conforme o saldo:
  - R$0-100: Porquinho bebê 🐷
  - R$100-500: Porquinho com óculos 🤓🐷
  - R$500-1000: Porquinho musculoso 💪🐷
  - R$1000-5000: Porquinho dourado ✨🐷
  - R$5000+: Porquinho rei 👑🐷
- Animações de bounce, scale e partículas (confetti) ao depositar
- **Saldo em R$** com destaque, subtítulo verde: "+5.87% ao ano • Rendendo automaticamente todos os dias"
- **Barra de progresso** para próxima evolução do porquinho
- 3 botões de ação: Depositar (PIX), Sacar, Educação
- Sons de moeda/level-up via Web Audio API
- Bottom navigation: Home, Histórico, Educação, Perfil

### 3. Modal de Depósito
- Input de valor em R$ com sugestões rápidas (R$10, R$50, R$100, R$500)
- Toggle "Pix Automático" com seleção de frequência (semanal/mensal)
- Fluxo: Confirmar → "Processando..." → Animação de moedas caindo no porquinho → "Depósito confirmado em <1s!"
- Confetti e som de sucesso

### 4. Módulo de Educação — Flashcards
- Cards swipeable (arrastar para esquerda/direita) com Framer Motion
- Conteúdo simplificado: como o dinheiro rende, o que são vaults, por que é seguro
- Sem jargões crypto — linguagem acessível
- Sistema de progresso (cards vistos / total)

### 5. Tela de Saque
- Input de valor, saldo disponível
- Simulação de processamento e confirmação

### 6. Serviços Mock (`services/mockWeb3Services.ts`)
- `mockPrivyAuth()` — simula login
- `mockJupiterQuote()` — simula cotação BRL→SOL
- `mockKaminoYield()` — retorna APY simulado (5.87%)
- `mockDeposit()` / `mockWithdraw()` — simula transações com delay

## Navegação
- React Router: `/login`, `/dashboard`, `/education`
- Bottom tab bar no dashboard
- Modais para depósito e saque

## Stack
- React + TypeScript + Tailwind CSS
- Framer Motion para todas as animações
- Lucide React para ícones
- Estado local com React Context (AuthContext + BalanceContext)
- Sons via useSound hook customizado

## Design
- Paleta: roxo/rosa gradient como primária, verde para rendimentos, dourado para conquistas
- Mobile-first (max-width container)
- Cantos arredondados, sombras suaves, tipografia bold e divertida

