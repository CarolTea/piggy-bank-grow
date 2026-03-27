

# Modo Demo vs Experiência na tela de Login

## O que muda

Na tela de Login (`Login.tsx`), adicionar uma **chave seletora (Switch)** no topo com duas opções: **Demo** e **Experiência**.

- **Experiência** (padrão): tela de login atual, sem alterações.
- **Demo**: substitui os botões de login por uma seção informativa com bullets extraídos do pitch, explicando a tecnologia e os objetivos do SmartPig.

## Conteúdo da seção Demo

Bullets baseados no pitch:

1. **O primeiro cofre digital** — Transforma o PIX em rendimento DeFi, sem que o usuário precise entender DeFi
2. **Web3 invisível** — Sem carteira, seed phrase, gas ou protocolo. O porquinho faz o resto
3. **PIX como on-ramp** — Deposite R$10, R$50 ou R$500 via PIX em segundos
4. **Rendimento automático** — Alocação em JitoSOL na Solana, 5.87% ao ano
5. **Gamificação que educa** — Porquinho evolui conforme você poupa, com flashcards financeiros
6. **Alinhamento de incentivos** — Só cobramos quando você ganha (performance fee sobre o yield)

Abaixo dos bullets, um botão "Entrar na Experiência" que muda o toggle para o modo Experiência (mostrando os botões de login).

## Layout

```text
┌─────────────────────────┐
│      [Demo | Experiência]│  ← Switch/Toggle no topo
│                         │
│      🐷 (porquinho)     │
│      Smart Pig          │
│                         │
│  ── se Demo ──          │
│  • bullet 1             │
│  • bullet 2             │
│  • bullet 3 ...         │
│  [Entrar na Experiência]│
│                         │
│  ── se Experiência ──   │
│  [Google] [Apple] [Email]│
│                         │
│   Powered by Solana ⚡   │
└─────────────────────────┘
```

## Detalhes técnicos

- Arquivo alterado: `src/pages/Login.tsx`
- Usar um `useState<'demo' | 'experience'>` com default `'demo'` para controlar o modo
- Usar o componente `Switch` ou dois botões estilizados como toggle
- Bullets com ícones Lucide relevantes (Wallet, Eye, Zap, TrendingUp, GraduationCap, Shield)
- Animação com framer-motion ao alternar entre modos

