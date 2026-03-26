

# Fix: Contraste do Nome do Porquinho

## Problema
O label do porquinho (ex: "Porquinho Bebê") usa a classe `text-gradient` que aplica um gradiente rosa/roxo ao texto. Como o fundo do header também é rosa/roxo (`gradient-primary`), o nome fica invisível. O texto "Próximo: ..." usa `text-white/70` que também tem baixo contraste.

## Correção

### Arquivo: `src/components/EvolutionaryPig.tsx`

1. **Label do nível (linha 289):** Trocar `text-gradient` por `text-white font-black` com `drop-shadow` para garantir legibilidade sobre qualquer fundo
2. **Texto "Próximo" (linha 307):** Trocar `text-white/70` por `text-white/90` para melhor contraste
3. **Label do próximo nível (linha 308):** Trocar `text-gradient-hot` por `text-accent font-black` (amarelo/dourado que contrasta com o fundo roxo)

