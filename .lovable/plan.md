

# Upgrade Gamificado do Smart Pig

## Problema
O visual atual usa emojis genéricos para o porquinho (com acessórios flutuando na cabeça), cores frias/corporativas e pouca energia visual. Falta a sensação de "jogo mobile" que causa dopamina e retenção.

## Mudanças Propostas

### 1. Porquinho Desenhado em SVG (substituir emojis)
Criar um componente SVG inline do porquinho com 5 visuais distintos por nível, cada um com personalidade própria -- não emojis com coisas na cabeça. Cada nível terá cores, detalhes e tamanhos diferentes:
- **Bebê** (0-100): Porquinho rosa pequeno e simples, olhos grandes
- **Esperto** (100-500): Porquinho com óculos integrados no SVG, expressão confiante
- **Forte** (500-1k): Porquinho maior, com faixa/bandana, cor mais intensa
- **Dourado** (1k-5k): Porquinho dourado brilhante com glow animado
- **Rei** (5k+): Porquinho dourado com coroa integrada, partículas ao redor

Cada nível terá animações únicas: o bebê treme suavemente, o rei tem um halo pulsante de luz.

### 2. Paleta de Cores com Mais Energia
Atualizar `index.css` com cores mais vibrantes e quentes:
- **Primary**: de roxo frio para um gradiente vibrante neon rosa/roxo (mais saturado)
- **Accent**: laranja/amarelo quente para CTAs
- **Success/Yield**: verde-limão neon (mais chamativo)
- **Background**: fundo escuro sutil com gradientes (estilo app de jogo)
- Adicionar um **glow effect** nas classes utilitárias (box-shadow neon)
- Gradientes mais chamativos e saturados

### 3. Dashboard com Mais Vida
- Fundo do header com gradiente animado (cores que transitam suavemente)
- Partículas flutuantes (moedas, estrelas) no background do header usando Framer Motion
- Botões de ação com efeito "glow" e gradientes mais vivos
- Barra de progresso do porquinho com glow e animação de pulso
- Saldo com animação de contagem (counting up) ao mudar
- Badge de "streak" mostrando dias consecutivos poupando

### 4. Animações Dopaminérgicas Extras
- Pulse/glow no saldo quando rende
- Shake celebratório no porquinho ao depositar
- Moedas animadas caindo com physics mais realistas no Confetti
- Efeito de "level up" com flash de tela quando o porquinho evolui
- Botões com micro-animações de hover (scale + glow)

### 5. Login com Mais Impacto
- Background animado com partículas/bokeh em vez de gradiente estático
- Porquinho SVG na tela de login também
- Animação de entrada mais dramática

## Arquivos a Modificar
1. **`src/components/EvolutionaryPig.tsx`** -- Reescrever com SVGs desenhados por nível, animações únicas, efeito glow e partículas
2. **`src/index.css`** -- Nova paleta vibrante, classes utilitárias glow/neon, gradientes animados
3. **`src/pages/Dashboard.tsx`** -- Header com gradiente animado, partículas flutuantes, streak badge, botões com glow
4. **`src/pages/Login.tsx`** -- Background com partículas animadas, SVG do porquinho
5. **`src/components/Confetti.tsx`** -- Moedas 3D com physics melhores
6. **`src/components/DepositModal.tsx`** -- Animação de level-up quando evolui
7. **`tailwind.config.ts`** -- Adicionar keyframes de glow e pulse customizados

