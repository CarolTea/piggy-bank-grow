# Renomear Smart Pig → Stellar Pig + Pegada Espacial

## Resumo
Substituir todas as ocorrências de "Smart Pig" / "SmartPig" por "Stellar Pig" / "StellarPig" no app. Adicionar elementos visuais espaciais/estelares ao design (estrelas, nebulosas, brilho cósmico) sem perder a identidade gamificada do porquinho.

## Escopo

### 1. Renomeação textual (todas as ocorrências)
- **`index.html`**: `<title>`, `og:title`, `twitter:title` — SmartPig → StellarPig
- **`src/pages/Login.tsx`**: h1 "Smart Pig" → "Stellar Pig"
- **`src/hooks/useSound.ts`**: localStorage key `smartpig_muted` → `stellarpig_muted`
- **`src/components/DepositModal.tsx`**: PIX key `smartpig@stellar.pay` → `stellarpig@stellar.pay`
- **`src/services/mockWeb3Services.ts`**: 4 flashcards com "Smart Pig" → "Stellar Pig"
- **`.lovable/plan.md`**: referências no handoff document

### 2. Pegada espacial/estelar no visual

#### Login (`src/pages/Login.tsx`)
- Background: trocar gradiente atual por um **gradiente espacial** mais profundo (tons de azul-marinho, roxo-escuro, preto-cosmos)
- Partículas (`LoginParticles`): adicionar **estrelas piscantes** (pequenos pontos brancos com opacity pulsante) misturadas às partículas roxas/rosas atuais
- H1 "Stellar Pig": reforçar text-shadow com um brilho **azul-estelar** em vez de pink puro

#### Dashboard Header (`src/pages/Dashboard.tsx`)
- `HeaderParticles`: adicionar **estrelas cadentes** (traços finos brancos que aparecem e desaparecem) e pontos de luz estelar no gradiente do header
- Saldo: text-shadow com brilho azul-ciano (mais "estelar") em vez de pink

#### EvolutionaryPig (`src/components/EvolutionaryPig.tsx`)
- Nos níveis Dourado e Rei: reforçar o glow para um efeito de **"aurora estelar"** com partículas que parecem constelações ao redor do porquinho
- Adicionar pequenas **estrelas piscantes** no `FloatingParticles` (pontinhos brancos que piscam, além das partículas coloridas)

#### CSS Globals (`src/index.css`)
- Adicionar uma nova classe utilitária `.glow-stellar` com box-shadow azul-ciano/roxo para elementos que precisarem de brilho espacial
- Opcional: keyframe de **twinkle** (piscar) para estrelas

## Arquivos a editar
1. `index.html`
2. `src/pages/Login.tsx`
3. `src/pages/Dashboard.tsx`
4. `src/components/EvolutionaryPig.tsx`
5. `src/hooks/useSound.ts`
6. `src/components/DepositModal.tsx`
7. `src/services/mockWeb3Services.ts`
8. `src/index.css`
9. `.lovable/plan.md`

## Notas técnicas
- Todas as cores continuam no sistema HSL/variáveis do design system
- Nenhuma lógica de negócio muda — apenas strings e efeitos visuais
- O porquinho continua o mesmo mascote, apenas com "atmosfera espacial" ao redor